import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ForgetPasswordRequest } from '../../../models/request/IAuthRequest';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { LeftSectionViewComponent } from "../left-section-view/left-section-view.component";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LeftSectionViewComponent],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  emailForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Shortcut للـ form controls
  get f() {
    return this.emailForm.controls;
  }

  sendOtp() {
    // إذا الفورم غير صالح أو جاري التحميل
    if (this.emailForm.invalid || this.isLoading()) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const emailValue = this.f['email'].value;

    // تشفير البريد باستخدام AES
    const encryptedEmail = CryptoJS.AES.encrypt(emailValue, environment.secretKey).toString();

    const request: ForgetPasswordRequest = { email: emailValue };

    this.authService.forgetPassword(request).subscribe({
      next: () => {
        // إرسال البريد المشفر للصفحة التالية
        this.router.navigate(['/password/verify-password-otp'], { queryParams: { email: encryptedEmail } });
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'حدث خطأ، حاول مرة أخرى');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
