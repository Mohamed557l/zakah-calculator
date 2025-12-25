import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { map, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { AuthService } from '../../../services/auth-service/auth.service';
import { VerifyAccountRequest } from '../../../models/request/IAuthRequest';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {

  otpForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  email!: string;

  // 🔥 RxJS state
  resendCounter$!: any;
  resendDisabled = true;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });

    this.email = history.state?.email;
    this.startResendTimer();
  }

  // ✅ RxJS timer
  startResendTimer(): void {
    this.resendDisabled = true;

    this.resendCounter$ = interval(1000).pipe(
      map(i => 59 - i),
      takeWhile(v => v >= 0),
      tap({
        complete: () => this.resendDisabled = false
      }),
      takeUntil(this.destroy$)
    );
  }

  resendOtp(): void {
    if (!this.email || this.resendDisabled) return;

    this.authService.resendOtp({ email: this.email }).subscribe({
      next: () => this.startResendTimer(),
      error: () => this.errorMessage = 'حدث خطأ أثناء إعادة إرسال الرمز.'
    });
  }

  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request: VerifyAccountRequest = {
      otpCode: this.otpForm.value.otpCode
    };

    this.authService.verifyAccount(request).subscribe({
      next: () => this.router.navigate(['/intro']),
      error: (err) => {
        this.errorMessage = err?.error?.message || 'حدث خطأ أثناء التحقق من الحساب.';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
