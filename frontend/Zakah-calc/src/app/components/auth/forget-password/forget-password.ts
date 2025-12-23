import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth-service/auth.service';
import { ForgetPasswordRequest } from '../../../models/request/IAuthRequest';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  // ===== Signals =====
  email = signal('');
  emailError = signal<string | null>(null);
  requestSent = signal(false);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ===== Handlers =====
  onEmailChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.email.set(value);
    if (this.emailError()) this.emailError.set(null);
  }

  // ===== Validation =====
  private validate(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email()) {
      this.emailError.set('البريد الإلكتروني مطلوب');
      return false;
    }

    if (!emailRegex.test(this.email())) {
      this.emailError.set('الرجاء إدخال بريد إلكتروني صالح');
      return false;
    }

    this.emailError.set(null);
    return true;
  }

  // ===== Submit =====
  onResetRequest() {
    if (!this.validate()) return;

    this.isLoading.set(true);

    const data: ForgetPasswordRequest = {
      email: this.email()
    };

    this.authService
      .forgetPassword(data)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.requestSent.set(true);
          console.log(res)
         
          this.router.navigate(['/verify-otp-pass'], {
            queryParams: { email: this.email() }
          });
        },
        error: () => {
          this.emailError.set('حدث خطأ، حاول مرة أخرى لاحقاً');
        }
      });
  }
}
