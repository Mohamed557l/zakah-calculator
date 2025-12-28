import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Landing } from './components/landing/landing';
import { authGuard } from './guards/auth-guard';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { landGuard } from './guards/land-guard';

export const routes: Routes = [
  { path: '', component: Landing },
    { path: '', component: Landing , canActivate:[landGuard]},
    { path: '', component: Landing , canActivate:[landGuard]},

  { path: 'register', component: Register },
  { path: 'login', component: Login },

  // ===================== FORGET / RESET PASSWORD FLOW =====================
  {
    path: 'password',
    children: [
      { path: 'forgot-password', component: ForgetPasswordComponent },
      { path: '' , redirectTo: 'forgot-password',pathMatch: 'full'},
      { path: 'verify-password-otp', loadComponent: () => import('./components/auth/verify-password-otp/verify-password-otp.component').then(m => m.VerifyPasswordOtpComponent) }, // /password/verify-otp
      { path: 'new-password', loadComponent: () => import('./components/auth/new-password/new-password.component').then(m => m.NewPasswordComponent) }
    ]
  },

  // ===================== ACCOUNT VERIFY =====================
  { path: 'verify-otp', loadComponent: () => import('./components/auth/verify-otp-account/verify-otp-account.component').then(m => m.VerifyOtpAccountComponent) },
    { path: 'register', component: Register , canActivate:[landGuard]},
    { path: 'login', component: Login , canActivate:[landGuard] },
    { path: 'forgot-password', component: ForgetPasswordComponent , canActivate:[landGuard]},
    { path: 'register', component: Register , canActivate:[landGuard]},
    { path: 'login', component: Login , canActivate:[landGuard] },
    { path: 'forgot-password', component: ForgetPasswordComponent , canActivate:[landGuard]},

    { path: 'intro', loadComponent: () => import('./components/intro/intro').then(m => m.Intro)  , canActivate:[authGuard]},
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),canActivate:[authGuard] },
    { path: 'wizard', loadComponent: () => import('./components/wizard/wizard').then(m => m.WizardComponent) ,canActivate:[authGuard]},
    { path: 'guide', loadComponent: () => import('./components/zakah-guide/zakah-guide').then(m => m.ZakahGuide),canActivate:[authGuard] },
    { path: 'navbar', loadComponent: () => import('./shared/navbar/navbar').then(m => m.Navbar),canActivate:[authGuard] },
    { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.Profile),canActivate:[authGuard] },

    { path: 'not-found', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },

    { path: '**', redirectTo: 'not-found' }
];
