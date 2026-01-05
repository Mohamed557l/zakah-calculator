import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStorageService } from '../../services/storage-service/StorageService';
import { AuthService } from '../../services/auth-service/auth.service';
import {Router} from '@angular/router';

let isRefreshing = false;

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // 🔹 Skip refresh for restore-account API or USER_ALREADY_DELETED
      if (
        error.status === 403 &&
        error.error?.code === 'USER_ALREADY_DELETED'
      ) {
        // ممكن تعمل bypass للـ retry
        console.log('User is deleted, redirect to restore account');
        router.navigate(['/restore-account']);
        return throwError(() => error);
      }


      // 🔹 Handle 401/403 with refresh token
      if (
        (error.status === 401 || error.status === 403) &&
        !isRefreshing &&
        AuthStorageService.getRefreshToken()
      ) {
        isRefreshing = true;

        return authService.refreshToken().pipe(
          switchMap(() => {
            isRefreshing = false;

            const token = AuthStorageService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });

            return next(retryReq);
          }),
          catchError(err => {
            isRefreshing = false;
            // 🔹 Clear only if refresh token request itself failed
            AuthStorageService.clear();
            return throwError(() => err);
          })
        );
      }

      // 🔹 Pass other errors
      return throwError(() => error);
    })
  );
};
