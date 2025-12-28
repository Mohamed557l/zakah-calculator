// src/app/services/zakah.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Persona, ZakahFormData, ZakahResult } from '../models/zakah.model';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ZakahService {
  // Form data
  private formDataSignal = signal<ZakahFormData>({
    balanceSheetDate: new Date().toISOString().split('T')[0],
    persona: 'individual',
    cash: 0,
    stocks: 0,
    inventory: 0,
    receivables: 0,
    accountPayable: 0,
    expenses: 0,
    shortTermLoans: 0,
    longTermDebt: 0,
    goldWeightInGrams: 0,
    goldPricePerGram: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netAssets: 0,
    zakahAmount: 0
  });

  // Steps management
  private currentStepSignal = signal(0);
  private isCalculatingSignal = signal(false);

  // Steps for different personas
  private individualSteps = ['البداية', 'التفاصيل', 'الأصول', 'الخصوم', 'الذهب', 'مراجعة'];
  private companySteps = ['البداية', 'التفاصيل', 'أصول الشركة', 'الخصوم', 'مراجعة'];

  // History management
  private selectedHistoryItemSignal = signal<ZakahResult | null>(null);
  calculationHistory = signal<ZakahResult[]>([]);

  // Computed properties
  formData = this.formDataSignal.asReadonly();
  currentWizardStep = this.currentStepSignal.asReadonly();
  isCalculating = this.isCalculatingSignal.asReadonly();
  selectedHistoryItem = this.selectedHistoryItemSignal.asReadonly();

  wizardSteps = computed(() => {
    const persona = this.formDataSignal().persona;
    return persona === 'individual' ? this.individualSteps : this.companySteps;
  });

  latestResult = computed(() => this.calculationHistory().length > 0 ? this.calculationHistory()[0] : null);

  historicalAverage = computed(() => {
    const history = this.calculationHistory();
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, item) => acc + item.zakahDue, 0);
    return sum / history.length;
  });

  viewingResult = computed(() => this.selectedHistoryItem() || this.latestResult());

  updateFormData(patch: Partial<ZakahFormData>) {
    this.formDataSignal.update(current => ({
      ...current,
      ...patch
    }));
  }

  nextStep() {
    const current = this.currentStepSignal();
    const steps = this.wizardSteps();
    if (current < steps.length - 1) {
      this.currentStepSignal.set(current + 1);
    }
  }

  prevStep() {
    const current = this.currentStepSignal();
    if (current > 0) {
      this.currentStepSignal.set(current - 1);
    }
  }

  goToStep(stepIndex: number) {
    const steps = this.wizardSteps();
    if (stepIndex >= 0 && stepIndex < steps.length) {
      this.currentStepSignal.set(stepIndex);
    }
  }

  async calculateZakah() {
    this.isCalculatingSignal.set(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = this.formDataSignal();

      // Calculate totals
      const totalAssets = (data.cash || 0) + (data.stocks || 0) + (data.inventory || 0) +
                         (data.receivables || 0);

      const totalLiabilities = (data.accountPayable || 0) + (data.expenses || 0) +
                              (data.shortTermLoans || 0) + (data.longTermDebt || 0);

      const netAssets = totalAssets - totalLiabilities;
      const zakahAmount = Math.max(0, netAssets) * 0.025; // 2.5%

      this.updateFormData({
        totalAssets,
        totalLiabilities,
        netAssets,
        zakahAmount
      });

      // Create ZakahResult and add to history
      const nisabThreshold = 10000; // Example threshold; adjust based on requirements
      const zakatableAmount = netAssets;
      const nisabMet = zakatableAmount >= nisabThreshold;
      const zakahDue = nisabMet ? zakatableAmount * 0.025 : 0;

      const result: ZakahResult = {
        totalAssets,
        totalLiabilities,
        zakatableAmount,
        nisabMet,
        nisabThreshold,
        zakahDue,
        calculationDate: new Date().toISOString(),
        formData: { ...data },
        status: undefined
      };

      this.calculationHistory.update(history => [result, ...history]);

    } finally {
      this.isCalculatingSignal.set(false);
    }
  }

  // دالة لقراءة ملف Excel
  async readExcelFile(file: File): Promise<Partial<ZakahFormData>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });

          // افتراض أن البيانات في الورقة الأولى
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // تحويل الورقة إلى مصفوفة مع تحديد النوع
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null
          });

          // تحليل البيانات بناءً على هيكل Excel الذي أرسلته
          const parsedData = this.parseExcelData(jsonData);

          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  private parseExcelData(jsonData: any[][]): Partial<ZakahFormData> {
    // القيم الافتراضية 0
    const parsedData: Partial<ZakahFormData> = {
      cash: 0,
      stocks: 0,
      inventory: 0,
      receivables: 0,
      accountPayable: 0,
      expenses: 0,
      shortTermLoans: 0,
      goldWeightInGrams: 0,
      longTermDebt: 0
    };

    try {
      // البحث عن العناوين والبيانات
      if (jsonData.length >= 2) {
        const headers = jsonData[0] as string[]; // الصف الأول: العناوين
        const values = jsonData[1];  // الصف الثاني: القيم

        // تعيين تخطيط Excel بناءً على المثال الذي أرسلته
        const columnMapping: { [key: string]: keyof ZakahFormData } = {
          'النقد': 'cash',
          'الأسهم/الاستثمارات': 'stocks',
          'المخزون': 'inventory',
          'المستحقات': 'receivables',
          'الذمم الدائنة': 'accountPayable',
          'المصاريف': 'expenses',
          'قروض قصيرة الأجل': 'shortTermLoans',
          'ديون طويلة الأجل (الجزء السنوي)':'longTermDebt'
        };

        // معالجة كل عمود
        headers.forEach((header: string, index: number) => {
          if (header && columnMapping[header]) {
            const field = columnMapping[header];
            const value = values[index];

            // تحويل القيمة إلى عدد، إذا لم تكن صحيحة ضع 0
            const parsedValue = this.parseNumber(value);

            // استخدام Type assertion للتعامل مع dynamic keys
            switch (field) {
              case 'cash':
                parsedData.cash = parsedValue;
                break;
              case 'stocks':
                parsedData.stocks = parsedValue;
                break;
              case 'inventory':
                parsedData.inventory = parsedValue;
                break;
              case 'receivables':
                parsedData.receivables = parsedValue;
                break;
              case 'accountPayable':
                parsedData.accountPayable = parsedValue;
                break;
              case 'expenses':
                parsedData.expenses = parsedValue;
                break;
              case 'shortTermLoans':
                parsedData.shortTermLoans = parsedValue;
                break;
              case 'longTermDebt':
                parsedData.longTermDebt = parsedValue;
                break;
            }
          }
        });
      }
    } catch (error) {
      console.error('Error parsing Excel data:', error);
    }

    return parsedData;
  }

  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    // تحويل النص إلى عدد
    const num = Number(value);

    // إذا كان القيمة غير صالحة، إرجاع 0
    return isNaN(num) ? 0 : num;
  }

  startNewCalculation() {
    // Reset form data to defaults (adjust as needed)
    this.formDataSignal.set({
      balanceSheetDate: new Date().toISOString().split('T')[0],
      persona: 'individual',
      cash: 0,
      stocks: 0,
      inventory: 0,
      receivables: 0,
      accountPayable: 0,
      expenses: 0,
      shortTermLoans: 0,
      longTermDebt: 0,
      goldWeightInGrams: 0,
      goldPricePerGram: 75.21,
      // goldValue: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      netAssets: 0,
      zakahAmount: 0
    });
    this.selectedHistoryItemSignal.set(null);
  }

  selectHistoryItem(item: ZakahResult) {
    this.selectedHistoryItemSignal.set(item);
  }

  viewLatestResult() {
    this.selectedHistoryItemSignal.set(null);
  }

  markAsPaid(calculationDate: string) {
    // Placeholder: Update history item status if needed (e.g., add a 'paid' field to ZakahResult)
    console.log(`Marked as paid for calculation date: ${calculationDate}`);
    // Example: this.calculationHistory.update(history => history.map(item => item.calculationDate === calculationDate ? { ...item, paid: true } : item));
  }
}