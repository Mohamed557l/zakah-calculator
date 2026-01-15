import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject, takeWhile, takeUntil, map, tap } from 'rxjs';
import * as CryptoJS from 'crypto-js';

import { AuthService } from '../../../services/auth-service/auth.service';
import { VerifyOtpRequest } from '../../../models/request/IAuthRequest';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { LeftSectionViewComponent } from "../left-section-view/left-section-view.component";

@Component({
  selector: 'app-verify-password-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LeftSectionViewComponent],
  templateUrl: './verify-password-otp.component.html',
  styleUrls: ['./verify-password-otp.component.css']
})
export class VerifyPasswordOtpComponent implements OnInit, OnDestroy {

  otpForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  email!: string;
  secretKey: string = environment.secretKey;

  resendCounter = signal(60);
  resendDisabled = signal(true);

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // تهيئة الفورم
    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });

    // قراءة البريد من query param وفك التشفير
    this.route.queryParams.subscribe(params => {
      const encryptedEmail = params['email'];
      if (encryptedEmail) {
        const bytes = CryptoJS.AES.decrypt(encryptedEmail, this.secretKey);
        this.email = bytes.toString(CryptoJS.enc.Utf8);
      }
      this.startResendTimer();
    });
  }

  // timer لإعادة إرسال OTP
  startResendTimer(): void {
    this.resendDisabled.set(true);
    this.resendCounter.set(30);

    interval(1000).pipe(
      map(i => 30 - i - 1),
      takeWhile(val => val >= 0),
      tap(val => this.resendCounter.set(val)),
      takeUntil(this.destroy$)
    ).subscribe({
      complete: () => this.resendDisabled.set(false)
    });
  }

  // إعادة إرسال OTP
  resendOtp(): void {
    if (!this.email || this.resendDisabled()) return;

    this.authService.resendPasswordOtp({ email: this.email }).subscribe({
      next: () => this.startResendTimer(),
      error: () => {
        this.startResendTimer();
        this.errorMessage.set('حدث خطأ أثناء إعادة إرسال الرمز.');
      }
    });
  }

  // تحقق OTP
  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const request: VerifyOtpRequest = {
      email: this.email,
      otp: this.otpForm.value.otpCode
    };

    this.authService.verifyPasswordOtp(request).subscribe({
      next: (res) => {
        // بعد التحقق، نرسل resetToken للصفحة التالية
        const encryptedToken = CryptoJS.AES.encrypt(res.resetToken!, this.secretKey).toString();
        this.router.navigate(['/password/new-password'], {
          queryParams: { token: encryptedToken }
        });
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
