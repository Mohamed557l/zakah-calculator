import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor/auth-interceptor-interceptor';
import { refreshTokenInterceptor } from './interceptors/refreshTokenInterceptor/refresh-token-interceptor-interceptor';
import { errorInterceptor } from './interceptors/errorInterceptor/error-interceptor-interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        refreshTokenInterceptor,
        errorInterceptor
      ])
    )
  ]
};
