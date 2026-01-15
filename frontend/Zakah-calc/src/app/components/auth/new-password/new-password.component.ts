import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as CryptoJS from 'crypto-js';

import { AuthService } from '../../../services/auth-service/auth.service';
import { ResetPasswordRequest } from '../../../models/request/IAuthRequest';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { LeftSectionViewComponent } from "../left-section-view/left-section-view.component";

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LeftSectionViewComponent],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  newPasswordForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  private resetToken!: string; // بعد فك التشفير

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // قراءة resetToken من query param وفك التشفير
    const encryptedToken = this.router.routerState.snapshot.root.queryParams['token'];
    if (encryptedToken) {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, environment.secretKey);
      this.resetToken = bytes.toString(CryptoJS.enc.Utf8);
    }

    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  submitNewPassword(): void {
    if (this.newPasswordForm.invalid || !this.resetToken) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const data: ResetPasswordRequest = {
      resetToken: this.resetToken,
      newPassword: this.newPasswordForm.value.newPassword,
      confirmNewPassword: this.newPasswordForm.value.confirmPassword
    };

    this.authService.resetPassword(data)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'فشل إعادة تعيين كلمة المرور، حاول لاحقاً');
        }
      });
  }
}
