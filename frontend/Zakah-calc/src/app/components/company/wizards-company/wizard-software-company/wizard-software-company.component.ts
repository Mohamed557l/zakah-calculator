import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ZakahCompanyRecordRequest } from '../../../../models/request/ZakahCompanyRequest';
import { ZakahCompanyExcelService } from '../../../../services/zakah-company-service/zakah-company-excel-service';
import { ZakahCompanyRecordService } from '../../../../services/zakah-company-service/zakah-company-service';
import { CurrencyPipe } from '@angular/common';
import { TooltipComponent } from "../../../../shared/tooltip/tooltip";
import { SoftwareCompanyModel } from '../../../../models/software-company-model';

@Component({
  selector: 'app-wizard-software-company',
  templateUrl: './wizard-software-company.component.html',
  styleUrls: ['./wizard-software-company.component.css'],
  imports: [CurrencyPipe, TooltipComponent],
})
export class WizardSoftwareCompanyComponent implements OnInit {

  private excelService = inject(ZakahCompanyExcelService);
  zakahService = inject(ZakahCompanyRecordService);
  private router = inject(Router);

  softwareFormData = this.zakahService.formSoftwareData;
  currentStep = this.zakahService.currentWizardStep;
  steps = this.zakahService.wizardSteps;
  isCalculating = this.zakahService.isCalculating;
  companyType = this.zakahService.companyType;

  fileName = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  downloadInProgress = signal(false);

  // ================= Validation =================
  fieldErrors = signal<Partial<Record<keyof SoftwareCompanyModel, string>>>({});

  ngOnInit() {
    // Initialize balanceSheetDate if not set
    const currentData = this.softwareFormData();
    if (!currentData.balanceSheetDate) {
      const today = new Date().toISOString().split('T')[0];
      this.zakahService.updateSoftwareFormData({ balanceSheetDate: today });
    }
  }

  // ================= Date Helpers =================

  private normalizeToISO(dateStr: string): string {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();

    // 1. معالجة الصيغة DD-MM-YYYY القادمة من الإكسيل
    const dmyMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    // 2. معالجة صيغة YYYY-MM-DD القياسية
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // 3. محاولة أخيرة باستخدام كائن Date
    const date = new Date(trimmed);
    return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '';
  }

  getDisplayDate(): string {
    return this.softwareFormData().balanceSheetDate || '';
  }

  get isSoftwareCompany(): boolean {
    return this.zakahService.companyType === 'ROLE_COMPANY_SOFTWARE';
  }
  get formData() {
    // هذا سيرجع البيانات الصحيحة بناءً على نوع الشركة
    return this.softwareFormData;
  }
  // ================= Inputs =================

  private validateField(
    key: keyof SoftwareCompanyModel,
    value: number | string
  ): string | null {

    // 👈 تجاهل التاريخ
    if (key === 'balanceSheetDate') {
      return value ? null : 'يرجى اختيار تاريخ';
    }

    if (value === null || value === undefined || value === '') {
      return 'هذا الحقل مطلوب';
    }

    if (typeof value === 'string' && isNaN(Number(value))) {
      return 'من فضلك أدخل رقمًا صحيحًا';
    }

    const numericValue = Number(value);

    if (numericValue < 0) {
      return 'القيمة لا يمكن أن تكون سالبة';
    }

    return null;
  }


  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const key = target.name as keyof SoftwareCompanyModel;
    const value = target.valueAsNumber || 0;

    this.zakahService.updateSoftwareFormData({ [key]: value } as any);

    const error = this.validateField(key, value);
    this.fieldErrors.update(errors => ({
      ...errors,
      [key]: error || undefined
    }));
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    // ✅ **استخدم الدالة الجديدة**
    this.zakahService.updateSoftwareFormData({ balanceSheetDate: value } as any);

    this.fieldErrors.update(errors => ({
      ...errors,
      balanceSheetDate: value ? undefined : 'يرجى اختيار تاريخ'
    }));
  }

  private validateAll(): boolean {
    const data = this.softwareFormData();
    let valid = true;
    const errors: Partial<Record<keyof SoftwareCompanyModel, string>> = {};

    (Object.keys(data) as (keyof SoftwareCompanyModel)[]).forEach(key => {
      const value = data[key] as any;
      const error = this.validateField(key, value);
      if (error) {
        errors[key] = error;
        valid = false;
      }
    });

    this.fieldErrors.set(errors);
    return valid;
  }



  // ================= Excel =================

  downloadExcelTemplate(): void {
    this.downloadInProgress.set(true);
    this.zakahService.getTemplate().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'software_balance_sheet_templete.xlsx';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.errorMessage.set('حدث خطأ في تحميل النموذج.'),
      complete: () => this.downloadInProgress.set(false)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.fileName.set(file.name);
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.zakahService.readCompanyExcelObservable(file).subscribe({
      next: (excelData) => {
        // ✅ **استخدم الدالة الجديدة**
        this.zakahService.updateSoftwareFormData({
          cashEquivalents: excelData.cashEquivalents || 0,
          investment: excelData.investment || 0,
          inventory: excelData.inventory || 0,
          accountsReceivable: excelData.accountsReceivable || 0,
          accountsPayable: excelData.accountsPayable || 0,
          accruedExpenses: excelData.accruedExpenses || 0,
          shortTermLiability: excelData.shortTermLiability || 0,
          yearlyLongTermLiabilities: excelData.yearlyLongTermLiabilities || 0,
          goldPrice: excelData.goldPrice || 0,
          balanceSheetDate: excelData.balanceSheetDate
            ? this.normalizeToISO(excelData.balanceSheetDate.toString())
            : new Date().toISOString().split('T')[0],
          netProfit: excelData.netProfit || 0,
          generatingFixedAssets: excelData.generatingFixedAssets || 0,
          contraAssets: excelData.contraAssets || 0,
          provisionsUnderLiabilities: excelData.provisionsUnderLiabilities || 0
        } as any);

        const detailsStep = this.steps().indexOf('التفاصيل');
        if (detailsStep !== -1) this.zakahService.goToStep(detailsStep);
      },
      error: () => this.errorMessage.set('حدث خطأ في قراءة ملف Excel.'),
      complete: () => {
        this.isLoading.set(false);
        input.value = '';
      }
    });
  }

  // ================= Wizard =================

  next(): void {
    this.zakahService.nextStep();
  }

  back(): void {
    this.zakahService.prevStep();
  }

  calculate(): void {
    console.log("calculate() function STARTED")
    if (!this.validateAll()) {
      console.log("❌ Validation failed!");
      return;
    }

    this.errorMessage.set(null);
    this.isCalculating.set(true);

    console.log('before service')
    this.zakahService.calculate().subscribe({
      next: (result) => {
        this.zakahService.latestResult.set(result);
        this.isCalculating.set(false);
        this.router.navigate(['/company/after-calc']);
      },
      error: (err) => {
        console.error('Calculation error:', err);
        this.errorMessage.set('حدث خطأ أثناء حساب الزكاة. يرجى التأكد من البيانات والمحاولة لاحقاً.');
        this.isCalculating.set(false);
      },
      complete: () => {
        this.isCalculating.set(false);
      }
    });
  }


  // ================= Display =================

  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';

    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, y, m, d] = match;
      return `${d}/${m}/${y}`;
    }

    return dateStr;
  }

  onNumberInput(event: Event) {
  const input = event.target as HTMLInputElement;

  let value = input.value;

  // إزالة أي شيء غير رقم أو نقطة
  value = value.replace(/[^0-9.]/g, '');

  // منع أكثر من نقطة
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  input.value = value;

  this.zakahService.updateSoftwareFormData({
    [input.name]: value === '' ? 0 : Number(value)
  });
}

blockInvalidNumberKeys(event: KeyboardEvent) {
  const invalidKeys = ['e', 'E', '+', '-'];
  if (invalidKeys.includes(event.key)) {
    event.preventDefault();
  }
}


}
