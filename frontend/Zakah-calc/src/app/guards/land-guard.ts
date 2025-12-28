import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/storage-service/StorageService';

export const landGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // ✅ Allow on server (SSR)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = AuthStorageService.getAccessToken();

  // ❌ If logged in → redirect away from guest pages
  if (token) {
    return router.createUrlTree(['/intro']); // change if needed
  }

  // ✅ Not logged in → allow access
  return true;
};
