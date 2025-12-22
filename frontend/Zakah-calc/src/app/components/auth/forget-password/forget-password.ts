import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth-service/auth.service'; // استيراد الخدمة
import { IForgotPassword } from '../../../models/IuserRegistration';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {
  // Signals للحالة
  email = signal('');
  emailError = signal<string | null>(null);
  requestSent = signal(false);
  isLoading = signal(false); // لحالة التحميل

  constructor(private authService: AuthService) {}

  onEmailChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.email.set(value);
    // إزالة الخطأ بمجرد البدء في الكتابة
    if (this.emailError()) this.emailError.set(null);
  }

  private validate(): boolean {
    this.emailError.set(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email()) {
      this.emailError.set('البريد الإلكتروني مطلوب.');
      return false;
    }
    if (!emailRegex.test(this.email())) {
      this.emailError.set('الرجاء إدخال عنوان بريد إلكتروني صالح.');
      return false;
    }
    return true;
  }

  onResetRequest() {
    if (this.validate()) {
      this.isLoading.set(true);
      const data: IForgotPassword = { email: this.email() };

      this.authService.forgotPassword(data).subscribe({
        next: (response) => {
          console.log('تم إرسال طلب إعادة التعيين:', response);
          this.requestSent.set(true);
        },
        error: (err) => {
          console.error('خطأ في إرسال الطلب:', err);
          this.emailError.set('حدث خطأ، تأكد من صحة البريد أو حاول لاحقاً.');
          this.isLoading.set(false);
        },
        complete: () => this.isLoading.set(false)
      });
    }
  }
}