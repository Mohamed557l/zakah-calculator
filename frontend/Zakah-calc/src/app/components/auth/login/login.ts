import { Component, OnInit, signal, output } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service/auth.service';
import { IuserLogin } from '../../../models/IuserRegistration';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = signal(false); // لإظهار حالة التحميل

  loggedIn = output<void>();
  navigateToRegister = output<void>();
  forgotPassword = output<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // سهولة الوصول للحقول في HTML
  get f() { return this.loginForm.controls; }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const credentials: IuserLogin = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('تم الدخول بنجاح', response);
          // حفظ التوكن (مثال بسيط)
          localStorage.setItem('token', response.token);
          
          this.loggedIn.emit();
          this.router.navigate(['/intro']);
        },
        error: (err) => {
          console.error('خطأ في الدخول', err);
          this.isLoading.set(false);
          alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        },
        complete: () => this.isLoading.set(false)
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onNavigateToRegister() { this.navigateToRegister.emit(); }
  onForgotPassword() { this.forgotPassword.emit(); }
}