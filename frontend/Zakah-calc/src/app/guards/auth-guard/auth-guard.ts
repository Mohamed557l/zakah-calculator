import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStorageService } from '../../services/storage-service/StorageService';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 1️⃣ لو مش عامل login
  if (!AuthStorageService.hasAccessToken()) {
    router.navigate(['/login']);
    return false;
  }

  // 2️⃣ لو الحساب متحذف، نروح restore-account بس مش على نفس الصفحة
  if (AuthStorageService.isDeleted() && state.url !== '/restore-account') {
    router.navigate(['/restore-account']);
    return false;
  }

  // 3️⃣ مسموح
  return true;
};
