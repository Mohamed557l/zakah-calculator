import { Injectable } from '@angular/core';

import {UserType} from '../../models/enums/UserType';
import {AuthenticationResponse, UserResponse} from '../../models/response/IAuthResponse';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  /* ================= TOKENS ================= */

  static saveTokens(auth: AuthenticationResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    localStorage.setItem(USER, JSON.stringify(auth.userResponse));
  }

  private static isBrowser(): boolean {
  return typeof window !== 'undefined';
}

  static getAccessToken(): string | null {
      if (!this.isBrowser()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static hasAccessToken(): boolean {
    
    return !!this.getAccessToken();
  }

  /* ================= USER ================= */

  static saveUser(user: UserResponse): void {
    
    localStorage.setItem(USER, JSON.stringify(user));
  }

  static getUser(): UserResponse | null {
    if (!this.isBrowser()) return null;
    const raw = localStorage.getItem(USER);
    return raw ? (JSON.parse(raw) as UserResponse) : null;
  }

  static getUserId(): number | null {
    if (!this.isBrowser()) return null;
    return this.getUser()?.userId ?? null;
  }

  static getUserType(): UserType | null {
    if (!this.isBrowser()) return null;
    return this.getUser()?.userType ?? null;
  }

  static getUserFullName(): string | null {
    if (!this.isBrowser()) return null;
    return this.getUser()?.fullName ?? null;
  }

  /* ================= ROLE HELPERS ================= */

  static isIndividual(): boolean {
    return this.getUserType() === UserType.ROLE_INDIVIDUAL;
  }

  static isCompany(): boolean {
    return this.getUserType() === UserType.ROLE_COMPANY;
  }

  static isLoggedIn(): boolean {
    return this.hasAccessToken();
  }

  /* ================= LOGOUT ================= */

  static clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER);
  }
}
