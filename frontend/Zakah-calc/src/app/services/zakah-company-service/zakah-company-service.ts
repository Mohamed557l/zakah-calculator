import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, tap } from 'rxjs'; // Updated import
import { environment } from '../../../environments/environment';
import { ZakahCompanyRecordResponse } from '../../models/response/ZakahCompanyResponse';
import { ZakahCompanyRecordRequest } from '../../models/request/ZakahCompanyRequest';
import { ZakahCompanyExcelService } from './zakah-company-excel-service';
import { AuthStorageService } from '../storage-service/StorageService';
import { SoftwareCompanyModel } from '../../models/software-company-model';

@Injectable({
  providedIn: 'root'
})
export class ZakahCompanyRecordService {

  private readonly BASE_URL = `${environment.apiUrl}/zakah/company`;
  private excelService = inject(ZakahCompanyExcelService);
  formData = signal<ZakahCompanyRecordRequest>(this.getInitialFormData());
  formSoftwareData = signal<SoftwareCompanyModel>(this.getInitialSoftwareFormData());

  latestResult = signal<ZakahCompanyRecordResponse | null>(null);
  history = signal<ZakahCompanyRecordResponse[]>([]);
  currentWizardStep = signal<number>(0);
  wizardSteps = signal<string[]>(['البداية', 'الأصول', 'الالتزامات', 'صافي الربح', 'التفاصيل', 'مراجعة']);
  isCalculating = signal<boolean>(false);
  companyType = AuthStorageService.getUserType();

  constructor(private http: HttpClient) { }

  getTemplate(): Observable<Blob> {
    return this.http.get('/templates/balance_sheet_templete.xlsx', { responseType: 'blob' });
  }
  resetForm(): void {
    this.formData.set(this.getInitialFormData());
    this.formSoftwareData.set(this.getInitialSoftwareFormData());
    this.currentWizardStep.set(0);
  }

  readCompanyExcelObservable(file: File): Observable<ZakahCompanyRecordRequest> {
    return from(this.excelService.readCompanyExcel(file));
  }




  calculate(): Observable<ZakahCompanyRecordResponse> {
    console.log('entering service')
    const data = this.formData();
    let request: ZakahCompanyRecordRequest = {} as ZakahCompanyRecordRequest;
    console.log('entering conditions')

    if (this.companyType === 'ROLE_COMPANY') {
      console.log('entering ROLE_COMPANY')

      request = {
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
        provisionsUnderLiabilities: data.provisionsUnderLiabilities,

      };
    } else if (this.companyType === 'ROLE_COMPANY_SOFTWARE') {
      const softwareData = this.formSoftwareData(); // 🔴 **تغيير مهم هنا**
      console.log('entering ROLE_COMPANY_SOFTWARE')


      request = {
        balanceSheetDate: softwareData.balanceSheetDate,
        cashEquivalents: softwareData.handOnCash + softwareData.accountsCurrentDepositsBank +
          softwareData.depositsStatutory + softwareData.partiesThirdWithDeposits,
        investment: softwareData.investmentsEquity + softwareData.affiliatesSubsidiaries +
          softwareData.investmentsSukukIslamic + softwareData.securitiesTrading,
        inventory: softwareData.expensesContractPrepaid,
        accountsReceivable: softwareData.receivablesTrade + softwareData.receivableNotes +
          softwareData.incomeAccrued,
        accountsPayable: softwareData.payableAccounts + softwareData.payableNotes,
        accruedExpenses: softwareData.expensesAccrued,
        shortTermLiability: softwareData.loansTermShort,
        yearlyLongTermLiabilities: softwareData.debtTermLongPortionCurrent,
        netProfit: softwareData.netProfit,
        generatingFixedAssets: softwareData.generatingFixedAssets,
        contraAssets: softwareData.assetsFixedProvisionDepreciation +
          softwareData.investmentsProvisionImpairment +
          softwareData.debtsDoubtfulAllowance +
          softwareData.discountsCashProvision,
        provisionsUnderLiabilities: softwareData.provisionOverhaulMaintenance +
          softwareData.assetsProvisionInsurance,
        goldPrice: softwareData.goldPrice,
      };
    }
    console.log('after conditions');

    console.log(request);

    return this.http.post<ZakahCompanyRecordResponse>(`${this.BASE_URL}/calculate`, request)
      .pipe(
        tap(response => {
          console.log(response)
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
  private getInitialSoftwareFormData(): SoftwareCompanyModel {
    return {
      generatingFixedAssets: 0,
      investmentsEquity: 0,
      affiliatesSubsidiaries: 0,
      investmentsSukukIslamic: 0,
      receivablesTrade: 0,
      receivableNotes: 0,
      incomeAccrued: 0,
      expensesContractPrepaid: 0,
      handOnCash: 0,
      accountsCurrentDepositsBank: 0,
      depositsStatutory: 0,
      securitiesTrading: 0,
      partiesThirdWithDeposits: 0,
      assetsFixedProvisionDepreciation: 0,
      provisionOverhaulMaintenance: 0,
      assetsProvisionInsurance: 0,
      investmentsProvisionImpairment: 0,
      debtsDoubtfulAllowance: 0,
      discountsCashProvision: 0,
      payableAccounts: 0,
      payableNotes: 0,
      loansTermShort: 0,
      debtTermLongPortionCurrent: 0,
      expensesAccrued: 0,
      balanceSheetDate: new Date().toISOString().split('T')[0],
      goldPrice: 0,
      netProfit: 0
    }
  }


  updateFormData(patch: Partial<ZakahCompanyRecordRequest>): void {
    this.formData.update(current => ({ ...current, ...patch }));
  }

  updateSoftwareFormData(patch: Partial<SoftwareCompanyModel>): void {
    this.formSoftwareData.update(current => ({ ...current, ...patch }));
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
