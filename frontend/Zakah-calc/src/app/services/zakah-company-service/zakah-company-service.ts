import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ZakahCompanyRecordResponse,
  ZakahCompanyRecordSummaryResponse
} from '../../models/response/ZakahCompanyResponse';
import { ZakahCompanyRecordRequest } from '../../models/request/ZakahCompanyRequest';


@Injectable({
  providedIn: 'root'
})
export class ZakahCompanyRecordService {

  private readonly BASE_URL = `${environment.apiUrl}/zakah/company`;

  latestResult = signal<ZakahCompanyRecordResponse | null>(null);
  history = signal<ZakahCompanyRecordSummaryResponse[]>([]);

  constructor(private http: HttpClient) {}

  calculateAndSave(
    request: ZakahCompanyRecordRequest
  ): Observable<ZakahCompanyRecordResponse> {
    return this.http.post<ZakahCompanyRecordResponse>(
      `${this.BASE_URL}/calculate`,
      request
    );
  }

  getAllSummaries(): Observable<ZakahCompanyRecordSummaryResponse[]> {
    return this.http.get<ZakahCompanyRecordSummaryResponse[]>(
      `${this.BASE_URL}/summaries`
    );
  }

  // GET /zakah/company/{id}
  getById(id: number): Observable<ZakahCompanyRecordResponse> {
    return this.http.get<ZakahCompanyRecordResponse>(
      `${this.BASE_URL}/${id}`
    );
  }

  /* ================= DELETE ================= */

  // DELETE /zakah/company/{id}
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.BASE_URL}/${id}`
    );
  }
}
