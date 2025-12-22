import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginResponse, IuserLogin, IuserRegisteration } from '../../models/IuserRegistration';
import { IForgotPassword, IForgotPasswordResponse } from '../../models/IuserRegistration';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-domain.com/api/auth';

  constructor(private http: HttpClient) { }
  login(credentials: IuserLogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: IuserRegisteration): Observable<any> {
    // نرسل البيانات للسيرفر ونستقبل النتيجة
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

  // داخل الـ Class
forgotPassword(data: IForgotPassword): Observable<IForgotPasswordResponse> {
  return this.http.post<IForgotPasswordResponse>(`${this.apiUrl}/forgot-password`, data);
}
}