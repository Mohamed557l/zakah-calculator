import { Routes } from '@angular/router';
import { ForgetPassword } from './components/auth/forget-password/forget-password';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Landing } from './components/landing/landing';

export const routes: Routes = [
    { path: '', component: Landing },

    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'forgot-password', component: ForgetPassword },

    { path: 'intro', loadComponent: () => import('./components/intro/intro').then(m => m.Intro) },
    { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard) },
    { path: 'wizard', loadComponent: () => import('./components/wizard/wizard').then(m => m.Wizard) },
    { path: 'guide', loadComponent: () => import('./components/zakah-guide/zakah-guide').then(m => m.ZakahGuide) },
    { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.Profile) },
    { path: 'verify-otp', loadComponent: () => import('./components/auth/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) },
    { path: 'verify-otp-pass', loadComponent: () => import('./components/auth/verfiy-otp-pass/verfiy-otp-pass.component').then(m => m.VerfiyOtpPassComponent) },
    { path: 'new-pass', loadComponent: () => import('./components/auth/new-pass/new-pass.component').then(m => m.NewPassComponent) },
    { path: 'not-found', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },

    { path: '**', redirectTo: 'not-found' }
];
