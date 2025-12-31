import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth-service/auth.service';
import { RegistrationRequest } from '../../../models/request/IAuthRequest';
import { UserType } from '../../../models/enums/UserType';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent implements OnInit {

  secretKey = environment.secretKey;

  registerForm!: FormGroup;

  // signal للحالة
  isLoading = signal(false);

  // signal لتفعيل/تعطيل الزر بناءً على صحة الفورم
  isFormValid = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // تحديث signal كل ما الفورم يتغير
    this.registerForm.valueChanges.subscribe(() => {
      this.isFormValid.set(this.registerForm.valid);
    });
  }

  private initForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        persona: ['individual', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );

    // initial value
    this.isFormValid.set(this.registerForm.valid);
  }

  get f() {
    return this.registerForm.controls;
  }

  selectPersona(type: 'individual' | 'company') {
    this.registerForm.patchValue({ persona: type });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (!this.isFormValid() || this.isLoading()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.registerForm.value;

    const request: RegistrationRequest = {
      fullName: formValue.name,
      email: formValue.email,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      userType:
        formValue.persona === 'individual'
          ? UserType.ROLE_INDIVIDUAL
          : UserType.ROLE_COMPANY
    };

    this.authService.register(request).subscribe({
      next: () => {
        const encryptedEmail = CryptoJS.AES.encrypt(request.email, this.secretKey).toString();
        this.router.navigate(['/verify-otp'], { queryParams: { email: encryptedEmail } });
      },
      error: (err) => {
        alert('فشل إنشاء الحساب');
        console.error('Register failed', err);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  // signal computed لمثال توضيحي: تقدر تستخدمه لعرض رسالة خطأ إذا كلمة المرور لا تتطابق
  passwordMismatch = computed(() =>
    this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value
  );
}
