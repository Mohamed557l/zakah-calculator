import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user-service/user-service';
import { AuthStorageService } from '../../services/storage-service/StorageService';
import {
  ProfileUpdateRequest,
  ChangePasswordRequest
} from '../../models/request/IAuthRequest';
import { ProfileUpdateResponse } from '../../models/response/IAuthResponse';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  /* ================= FORMS ================= */

  infoForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: [{ value: '', disabled: true }]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(3)]],
    confirmNewPassword: ['', Validators.required]
  });

  /* ================= SIGNAL STATE ================= */

  isUpdatingInfo = signal(false);
  isUpdatingPassword = signal(false);

  infoError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  /* ================= INIT ================= */

  ngOnInit(): void {
    const user = AuthStorageService.getUser();

    if (user) {
      this.infoForm.patchValue({
        name: user.fullName,
        email: user.email
      });
    }
  }

  /* ================= UPDATE INFO ================= */

  onUpdateInfo(event?: Event): void {
    event?.preventDefault();

    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    this.isUpdatingInfo.set(true);
    this.infoError.set(null);
    this.successMessage.set(null);

    const fullName = this.infoForm.get('name')!.value.trim();
    const parts = fullName.split(' ');

    const request: ProfileUpdateRequest = {
      firstName: parts[0],
      lastName: parts.slice(1).join(' ')
    };

    this.userService.updateProfile(request).subscribe({
      next: (res: ProfileUpdateResponse) => {
        this.isUpdatingInfo.set(false);

        if (res.fullName) {
          const currentUser = AuthStorageService.getUser();
          if (currentUser) {
            AuthStorageService.saveUser({
              ...currentUser,
              fullName: res.fullName
            });
          }

          this.infoForm.patchValue({ name: res.fullName });
          this.successMessage.set('تم تحديث معلوماتك بنجاح');
        }
      },
      error: (err) => {
        this.isUpdatingInfo.set(false);
        this.infoError.set(
          err.error?.message || 'حدث خطأ أثناء تحديث البيانات'
        );
      }
    });
  }

  /* ================= UPDATE PASSWORD ================= */

  onUpdatePassword(event?: Event): void {
    event?.preventDefault();

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordError.set('يرجى إدخال جميع الحقول');
      return;
    }

    const { newPassword, confirmNewPassword } = this.passwordForm.value;

    if (newPassword !== confirmNewPassword) {
      this.passwordError.set('كلمات المرور غير متطابقة');
      return;
    }

    this.isUpdatingPassword.set(true);
    this.passwordError.set(null);
    this.successMessage.set(null);

    const request: ChangePasswordRequest =
      this.passwordForm.getRawValue();

    this.userService.changePassword(request).subscribe({
      next: () => {
        this.isUpdatingPassword.set(false);
        this.successMessage.set('تم تغيير كلمة المرور بنجاح');
        this.passwordForm.reset();
      },
      error: (err) => {
        this.isUpdatingPassword.set(false);
        this.passwordError.set(
          err.error?.message || 'حدث خطأ أثناء تغيير كلمة المرور'
        );
      }
    });
  }

  /* ================= DELETE ACCOUNT ================= */

  onDeleteAccount(): void {
    if (!confirm('هل أنت متأكد من حذف الحساب؟')) return;

    this.userService.deleteAccount().subscribe(() => {
     this.router.navigate(['/login'])
    });
  }
}
