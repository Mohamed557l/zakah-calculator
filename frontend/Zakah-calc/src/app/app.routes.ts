import {Routes} from '@angular/router';
import {Login} from './components/auth/login/login';
import {RegisterComponent} from './components/auth/register/register';
import {Landing} from './components/landing/landing';
import {ForgetPasswordComponent} from './components/auth/forget-password/forget-password.component';
import {Intro} from './components/intro/intro';
import {Navbar} from './shared/navbar/navbar';

import {authGuard} from './guards/auth-guard/auth-guard';
import {permitGuard} from './guards/permit-guard/permit-guard';
import {roleGuard} from './guards/authorization-guard/role-guard';


export const routes: Routes = [

  // ===================== PUBLIC (NOT AUTHENTICATED) =====================
  {
    path: '',
    canActivate: [permitGuard],
    children: [
      {path: '', component: Landing},
      {path: 'login', component: Login},
      {path: 'register', component: RegisterComponent},

      // ===== PASSWORD FLOW =====
      {
        path: 'password',
        children: [
          {path: '', redirectTo: 'forgot-password', pathMatch: 'full'},
          {path: 'forgot-password', component: ForgetPasswordComponent},
          {
            path: 'verify-password-otp',
            loadComponent: () =>
              import('./components/auth/verify-password-otp/verify-password-otp.component')
                .then(m => m.VerifyPasswordOtpComponent),
          },
          {
            path: 'new-password',
            loadComponent: () =>
              import('./components/auth/new-password/new-password.component')
                .then(m => m.NewPasswordComponent),
          },
        ],
      },

      // ===== ACCOUNT VERIFY =====
      {
        path: 'verify-otp',
        loadComponent: () =>
          import('./components/auth/verify-otp-account/verify-otp-account.component')
            .then(m => m.VerifyOtpAccountComponent),
      },
    ],
  },

  // ===================== AUTHENTICATED (ANY USER) =====================
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {path: 'intro', component: Intro},
      {path: 'navbar', component: Navbar},
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile')
            .then(m => m.Profile),
      },
      {
        path: 'guide',
        loadComponent: () =>
          import('./components/zakah-guide/zakah-guide')
            .then(m => m.ZakahGuide),
      },
    ],
  },


  {
    path: 'restore-account',
    loadComponent: () => import('./components/restore-account/restore-account.component')
      .then(m => m.RestoreAccountComponent),
    canActivate: [authGuard],
  },

  // ===================== COMPANY (ROLE_COMPANY) =====================
  {
    path: 'company',
    canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'wizard',
        loadComponent: () =>
          import('./components/company/wizard/wizard')
            .then(m => m.ZakahCompanyRecordComponent),
      },
      {
        path: '',
        redirectTo: 'wizard',
        pathMatch: "full"
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/company/dashboard/dashboard')
            .then(m => m.DashboardComponent),
      },
      {
        path: 'after-calc',
        loadComponent: () =>
          import('./components/company/after-calc/after-calc.component')
            .then(m => m.AfterCalcComponent),
      },
    ],
  },

  // ===================== INDIVIDUAL (ROLE_INDIVIDUAL) =====================
  {
    path: 'individual',
    canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'wizard',
        loadComponent: () =>
          import('./components/individual/wizard-individual/wizard-individual.component')
            .then(m => m.WizardIndividualComponent),
      },
      {
        path: '',
        redirectTo: 'wizard',
        pathMatch: "full"
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/individual/dash-individual/dash-individual.component')
            .then(m => m.DashIndividualComponent),
      },
      {
        path: 'after-calc',
        loadComponent: () =>
          import('./components/individual/individual-after-calc/individual-after-calc.component')
            .then(m => m.IndividualAfterCalcComponent),
      },
    ],
  },

  // ===================== NOT FOUND =====================
  {
    path: 'not-found',
    loadComponent: () =>
      import('./components/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
  },

  // ===================== WILDCARD =====================
  {path: '**', redirectTo: 'not-found'},
];
