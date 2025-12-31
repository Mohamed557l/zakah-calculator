import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ZakahIndividualRecordResponse,
  ZakahIndividualRecordSummaryResponse
} from '../../models/response/ZakahIndividualResponse';
import {ZakahIndividualRecordRequest} from '../../models/request/ZakahIndividualRequest';


@Injectable({
  providedIn: 'root'
})
export class ZakahIndividualRecordService {

  private readonly BASE_URL = `${environment.apiUrl}/zakah/individual`;

  latestResult = signal<ZakahIndividualRecordResponse | null>(null);
  history = signal<ZakahIndividualRecordSummaryResponse[]>([]);


  constructor(private http: HttpClient) {}

  /* ================= GET ================= */

  // GET /zakah/individual/{id}
  getById(id: number): Observable<ZakahIndividualRecordResponse> {
    return this.http.get<ZakahIndividualRecordResponse>(
      `${this.BASE_URL}/${id}`
    );
  }

  // GET /zakah/individual/all/summaries
  getAllSummaries(): Observable<ZakahIndividualRecordSummaryResponse[]> {
    return this.http.get<ZakahIndividualRecordSummaryResponse[]>(
      `${this.BASE_URL}/all/summaries`
    );
  }

  /* ================= POST ================= */

  // POST /zakah/individual/calculate
  calculateAndSave(
     request: ZakahIndividualRecordRequest
   ): Observable<ZakahIndividualRecordResponse> {
     return this.http.post<ZakahIndividualRecordResponse>(
       `${this.BASE_URL}/calculate`,
       request
     );
   }
  /* ================= DELETE ================= */

  // DELETE /zakah/individual/{id}
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.BASE_URL}/${id}`
    );
  }
}
