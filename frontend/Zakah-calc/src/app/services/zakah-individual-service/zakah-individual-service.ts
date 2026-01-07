import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ZakahIndividualRecordResponse,
  ZakahIndividualRecordSummaryResponse
} from '../../models/response/ZakahIndividualResponse';
import { ZakahIndividualRecordRequest } from '../../models/request/ZakahIndividualRequest';
import { ZakahCompanyRecordRequest } from '../../models/request/ZakahCompanyRequest';


@Injectable({
  providedIn: 'root'
})
export class ZakahIndividualRecordService {

  private readonly BASE_URL = `${environment.apiUrl}/zakah/individual`;


  formData = signal<ZakahIndividualRecordRequest>(this.getInitialFormData());
  latestResult = signal<ZakahIndividualRecordResponse | null>(null);
  history = signal<ZakahIndividualRecordResponse[]>([]);
  currentWizardStep = signal<number>(0);
  wizardSteps = signal<string[]>(['البداية', 'الأصول','الالتزامات', 'التفاصيل', 'مراجعة']);
  isCalculating = signal<boolean>(false);

  constructor(private http: HttpClient) { }

  resetForm(): void {
    this.formData.set(this.getInitialFormData());
    this.currentWizardStep.set(0);
  }



  calculate(): Observable<ZakahIndividualRecordResponse> {
    const data = this.formData();

    const request: ZakahIndividualRecordRequest = {
      calculationDate: data.calculationDate,
      goldPrice: Number(data.goldPrice),

      cash: Number(data.cash),
      gold: Number(data.gold),
      silver: Number(data.silver),
      stocks: Number(data.stocks),
      bonds: Number(data.bonds),
      tradeOffers: Number(data.tradeOffers),
      jewelry: Number(data.jewelry),
      otherAssets: Number(data.otherAssets),
      loans: Number(data.loans),
      debt: Number(data.debt),
    };

    console.log('REQUEST SENT TO BACKEND:', request);

    return this.http
      .post<ZakahIndividualRecordResponse>(`${this.BASE_URL}/calculate`, request)
      .pipe(
        tap(response => {
          this.latestResult.set(response);
          this.history.update(h => [response, ...h]);
          this.resetForm();
        })
      );
  }



  private getInitialFormData(): ZakahIndividualRecordRequest {
    return {
      calculationDate: new Date().toISOString().split('T')[0],
      goldPrice: 0,

      cash: 0,
      gold: 0,
      silver: 0,
      bonds: 0,
      stocks: 0,
      tradeOffers: 0,
      jewelry: 0,
      otherAssets: 0,
      loans: 0,
      debt: 0,
    };
  }


  updateFormData(patch: Partial<ZakahIndividualRecordRequest>): void {
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
  getAllSummaries(): Observable<ZakahIndividualRecordResponse[]> {
    return this.http.get<ZakahIndividualRecordResponse[]>(`${this.BASE_URL}/summaries`);
  }

  loadById(id: number): Observable<ZakahIndividualRecordResponse> {
    return this.http.get<ZakahIndividualRecordResponse>(`${this.BASE_URL}/${id}`);
  }

  loadfullrecord(id: number): Observable<ZakahIndividualRecordResponse> {
    return this.http.get<ZakahIndividualRecordResponse>(`${this.BASE_URL}/${id}`);
  }


  // calculateAndSave(request: ZakahIndividualRecordRequest): Observable<ZakahIndividualRecordResponse> {
  //   return this.http.post<ZakahIndividualRecordResponse>(`${this.BASE_URL}/calculate`, request);
  // }

  deleteRecord(id: number) {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }

}
