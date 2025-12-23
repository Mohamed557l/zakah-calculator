import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {
  AuthenticationResponse,
  ForgetPasswordResponse,
  ResetPasswordResponse,
  VerifyOtpResponse
} from '../../models/response/IAuthResponse';
import {AuthStorageService} from '../storage-service/StorageService';
import {
  AuthenticationRequest,
  ForgetPasswordRequest,
  RefreshRequest,
  RegistrationRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
  VerifyOtpRequest
} from '../../models/request/IAuthRequest';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // isLoggedIn = signal<boolean>(AuthStorageService.isLoggedIn());

 private readonly BASE_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  /* ================= AUTH ================= */

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.BASE_URL}/login`, request)
      .pipe(
        tap(res => AuthStorageService.saveTokens(res))
      );
  }

  register(request: RegistrationRequest): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/register`, request);
  }

  verifyAccount(
    request: VerifyAccountRequest
  ): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(`${this.BASE_URL}/verify-acount`, request)
      .pipe(
        tap(res => AuthStorageService.saveTokens(res))
      );
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = AuthStorageService.getRefreshToken();

    return this.http
      .post<AuthenticationResponse>(
        `${this.BASE_URL}/refresh-token`,
        { refreshToken } as RefreshRequest
      )
      .pipe(
        tap(res => AuthStorageService.saveTokens(res))
      );
  }

  /* ================= PASSWORD ================= */

  forgetPassword(
    request: ForgetPasswordRequest
  ): Observable<ForgetPasswordResponse> {
    return this.http.post<ForgetPasswordResponse>(
      `${this.BASE_URL}/password/forget-password`,
      request
    );
  }

  verifyOtp(
    request: VerifyOtpRequest
  ): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(
      `${this.BASE_URL}/password/verify-otp`,
      request
    );
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.BASE_URL}/password/reset-password`,
      request
    );
  }

  /* ================= LOGOUT ================= */

  logout(): void {
    AuthStorageService.clear();
  }
}
