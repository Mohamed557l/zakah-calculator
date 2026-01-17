import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

import { AuthService } from '../../../services/auth-service/auth.service';
import { RegistrationRequest } from '../../../models/request/IAuthRequest';
import { UserType } from '../../../models/enums/UserType';
import { environment } from '../../../../environments/environment';
import { LeftSectionViewComponent } from '../left-section-view/left-section-view.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LeftSectionViewComponent],
  templateUrl: './register.html'
})

export class RegisterComponent implements OnInit {

  private readonly COMPANY_TYPE_KEY = 'company_type';
  secretKey = environment.secretKey;

  registerForm!: FormGroup;
  isLoading = signal(false);
  isFormValid = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.registerForm.valueChanges.subscribe(() => {
      this.isFormValid.set(this.registerForm.valid);
    });
  }

  private initForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(50)]],
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).*$/)
        ]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        persona: ['individual', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );

    this.isFormValid.set(this.registerForm.valid);
  }

  get f() {
    return this.registerForm.controls;
  }

  selectPersona(type: 'individual' | 'company') {
    this.registerForm.patchValue({ persona: type });

    if (type !== 'company') {
      localStorage.removeItem(this.COMPANY_TYPE_KEY);
    }
  }

  selectCompanyType(type: 'company-software' | 'company-other') {
    localStorage.setItem(this.COMPANY_TYPE_KEY, type);
  }

  getCompanyType(): string | null {
    return localStorage.getItem(this.COMPANY_TYPE_KEY);
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
    const companyType = this.getCompanyType();

    let typeUser: UserType;

    if (formValue.persona === 'individual') {
      typeUser = UserType.ROLE_INDIVIDUAL;

    } else {
      typeUser = companyType === 'company-software'
        ? UserType.ROLE_COMPANY_SOFTWARE
        : UserType.ROLE_COMPANY;
    }

    const request: RegistrationRequest = {
      fullName: formValue.name,
      email: formValue.email,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      userType: typeUser
    };

    this.authService.register(request).subscribe({
      next: () => {
        const encryptedEmail = CryptoJS.AES.encrypt(request.email, this.secretKey).toString();
        localStorage.removeItem(this.COMPANY_TYPE_KEY);
        this.router.navigate(['/verify-otp'], { queryParams: { email: encryptedEmail } });
      },
      error: () => {
        alert('فشل إنشاء الحساب');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }

  passwordMismatch = computed(() =>
    this.registerForm.get('password')?.value !==
    this.registerForm.get('confirmPassword')?.value
  );
}
