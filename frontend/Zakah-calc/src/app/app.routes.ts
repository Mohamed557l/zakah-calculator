import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Landing } from './components/landing/landing';
import { authGuard } from './guards/auth-guard';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { landGuard } from './guards/land-guard';
import { Intro } from './components/intro/intro';
import { Navbar } from './shared/navbar/navbar';

export const routes: Routes = [
  // ===================== LANDING =====================
  { path: '', component: Landing, canActivate: [landGuard] },

  // ===================== AUTH =====================
  { path: 'register', component: Register, canActivate: [landGuard] },
  { path: 'login', component: Login, canActivate: [landGuard] },

  // ===================== PASSWORD FLOW =====================
  {
    path: 'password',
    canActivate: [landGuard],
    children: [
      { path: '', redirectTo: 'forgot-password', pathMatch: 'full' },
      { path: 'forgot-password', component: ForgetPasswordComponent },
      {
        path: 'verify-password-otp',
        loadComponent: () =>
          import('./components/auth/verify-password-otp/verify-password-otp.component').then(
            (m) => m.VerifyPasswordOtpComponent
          ),
      },
      {
        path: 'new-password',
        loadComponent: () =>
          import('./components/auth/new-password/new-password.component').then(
            (m) => m.NewPasswordComponent
          ),
      },
    ],
  },

  // ===================== ACCOUNT VERIFY =====================
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./components/auth/verify-otp-account/verify-otp-account.component').then(
        (m) => m.VerifyOtpAccountComponent
      ),
  },

  // ===================== AUTHENTICATED ROUTES =====================
  { path: 'intro', component: Intro, canActivate: [authGuard] },
  {
    path: 'dashboard',
    loadComponent: () => import('../app/components/company/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'wizard',
    loadComponent: () => import('./components/company/wizard/wizard').then((m) => m.WizardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'after-calc',
    loadComponent: () => import('./components/after-calc/after-calc.component').then((m) => m.AfterCalcComponent),
    canActivate: [authGuard],
  },
  {
    path: 'guide',
    loadComponent: () =>
      import('./components/zakah-guide/zakah-guide').then((m) => m.ZakahGuide),
    canActivate: [authGuard],
  },
  { path: 'navbar', component: Navbar, canActivate: [authGuard] },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },

  // ===================== NOT FOUND =====================
  {
    path: 'not-found',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },

  // ===================== WILDCARD =====================
  { path: '**', redirectTo: 'not-found' },
];
