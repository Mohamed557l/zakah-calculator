/* ===========================
   AUTHENTICATION & USER
   =========================== */
import {UserType} from '../enums/UserType';

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  userResponse: UserResponse;
}

export interface UserResponse {
  email: string;
  fullName: string;
  userType: UserType;
  isVerified: boolean;
  deleted: boolean;
}

/* ===========================
   ACCOUNT MANAGEMENT
   =========================== */
export interface DeleteAccountResponse {
  message: string;
  deletedAt: string;     // LocalDate -> ISO string
  restoreUntil: string;  // LocalDate -> ISO string
}

export interface ProfileUpdateResponse {
  fullName: string;
}

/* ===========================
   PASSWORD MANAGEMENT
   =========================== */
export interface ForgetPasswordResponse {
  email: string;
  message: string;
}

export interface ResetPasswordResponse {
  email: string;
  message: string;
}

export interface VerifyPasswordOtpResponse {
  message: string;
  resetToken?: string;   // موجود بعد تحقق OTP
}
