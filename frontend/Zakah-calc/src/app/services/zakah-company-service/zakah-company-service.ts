import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, tap } from 'rxjs'; // Updated import
import { environment } from '../../../environments/environment';
import { ZakahCompanyRecordResponse } from '../../models/response/ZakahCompanyResponse';
import { ZakahCompanyRecordRequest } from '../../models/request/ZakahCompanyRequest';
import { ZakahCompanyExcelService } from './zakah-company-excel-service';

@Injectable({
  providedIn: 'root'
})
export class ZakahCompanyRecordService {

  private readonly BASE_URL = `${environment.apiUrl}/zakah/company`;
  private excelService = inject(ZakahCompanyExcelService);

  formData = signal<ZakahCompanyRecordRequest>(this.getInitialFormData());
  latestResult = signal<ZakahCompanyRecordResponse | null>(null);
  history = signal<ZakahCompanyRecordResponse[]>([]);
  currentWizardStep = signal<number>(0);
  wizardSteps = signal<string[]>(['البداية', 'الأصول', 'الالتزامات', 'التفاصيل', 'مراجعة']);
  isCalculating = signal<boolean>(false);

  constructor(private http: HttpClient) { }

  getTemplate(): Observable<Blob> {
    return this.http.get('/templates/balance_sheet_templete.xlsx', { responseType: 'blob' });
  }
  resetForm(): void {
    this.formData.set(this.getInitialFormData());
    this.currentWizardStep.set(0);
  }

  readCompanyExcelObservable(file: File): Observable<ZakahCompanyRecordRequest> {
    return from(this.excelService.readCompanyExcel(file));
  }

  calculate(): Observable<ZakahCompanyRecordResponse> {
    const data = this.formData();
    const request: ZakahCompanyRecordRequest = {
      balanceSheetDate: data.balanceSheetDate,
      cashEquivalents: data.cashEquivalents,
      investment: data.investment,
      inventory: data.inventory,
      accountsReceivable: data.accountsReceivable,
      accountsPayable: data.accountsPayable,
      accruedExpenses: data.accruedExpenses,
      shortTermLiability: data.shortTermLiability,
      yearlyLongTermLiabilities: data.yearlyLongTermLiabilities,
      goldPrice: data.goldPrice,
      netProfit: data.netProfit,
      generatingFixedAssets: data.generatingFixedAssets,
      contraAssets: data.contraAssets,
      provisionsUnderLiabilities: data.provisionsUnderLiabilities
    };

    return this.http.post<ZakahCompanyRecordResponse>(`${this.BASE_URL}/calculate`, request)
      .pipe(
        tap(response => {
          this.latestResult.set(response);
          this.history.update(h => [response, ...h]);
          this.resetForm();
        })
      );
  }

  private getInitialFormData(): ZakahCompanyRecordRequest {
    return {
  balanceSheetDate: new Date().toISOString().split('T')[0],
  goldPrice: 0,
  netProfit: 0,
  cashEquivalents: 0,
  accountsReceivable: 0,
  inventory: 0,
  investment: 0,
  generatingFixedAssets: 0,
  accountsPayable: 0,
  accruedExpenses: 0,
  shortTermLiability: 0,
  yearlyLongTermLiabilities: 0,
  contraAssets: 0,
  provisionsUnderLiabilities: 0
};
  }


  updateFormData(patch: Partial<ZakahCompanyRecordRequest>): void {
    this.formData.update(current => ({ ...current, ...patch }));
  }

  nextStep(): void {
    if (this.currentWizardStep() < this.wizardSteps().length - 1) {
      this.currentWizardStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentWizardStep() > 0) {
      this.currentWizardStep.update(s => s - 1);
    }
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.wizardSteps().length) {
      this.currentWizardStep.set(stepIndex);
    }
  }
  getAllSummaries(): Observable<ZakahCompanyRecordResponse[]> {
    return this.http.get<ZakahCompanyRecordResponse[]>(`${this.BASE_URL}/summaries`);
  }

  loadById(id: number): Observable<ZakahCompanyRecordResponse> {
    return this.http.get<ZakahCompanyRecordResponse>(`${this.BASE_URL}/${id}`);
  }

  loadfullrecord(id: number): Observable<ZakahCompanyRecordResponse> {
    return this.http.get<ZakahCompanyRecordResponse>(`${this.BASE_URL}/${id}`);
  }
 
  calculateAndSave(request: ZakahCompanyRecordRequest): Observable<ZakahCompanyRecordResponse> {
    return this.http.post<ZakahCompanyRecordResponse>(`${this.BASE_URL}/calculate`, request);
  }

  deleteRecord(id: number): void {
    this.http.delete<void>(`${this.BASE_URL}/${id}`).subscribe({
      next: () => {
        // 1. الحصول على القائمة الحالية قبل التعديل
        const currentHistory = this.history();

        // 2. إيجاد مكان (Index) السجل الذي سيتم حذفه
        const deletedIndex = currentHistory.findIndex(r => r.id === id);

        // 3. تحديث قائمة التاريخ (الحذف من الذاكرة)
        const updatedHistory = currentHistory.filter(r => r.id !== id);
        this.history.set(updatedHistory);

        // 4. منطق التبديل التلقائي:
        // إذا كان السجل المحذوف هو المعروض حالياً في لوحة التحكم
        if (this.latestResult()?.id === id) {
          if (updatedHistory.length > 0) {
            // حاول عرض السجل الذي كان قبله في القائمة
            // إذا كان المحذوف هو أول واحد، سيعرض الجديد الذي أصبح أول واحد
            const nextIndex = deletedIndex > 0 ? deletedIndex - 1 : 0;
            this.latestResult.set(updatedHistory[nextIndex]);
          } else {
            // إذا لم يتبقى أي سجلات، قم بتصفير العرض
            this.latestResult.set(null);
          }
        }

        console.log('تم الحذف والتبديل للسجل التالي بنجاح');
      },
      error: (err) => {
        console.error('فشل الحذف:', err);
      }
    });
  }
}