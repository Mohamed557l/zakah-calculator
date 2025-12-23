import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { VerifyAccountRequest } from '../../../models/request/IAuthRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class VerifyOtpComponent implements OnInit {
  otpForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });
  }

  submitOtp() {
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
      next: (res) => {
        // التوكن يتم حفظه داخل الـ AuthStorageService من الـ service
        this.router.navigate(['/intro']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'حدث خطأ أثناء التحقق من الحساب.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
