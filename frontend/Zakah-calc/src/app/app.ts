import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./components/auth/login/login";
import { Navbar } from "./shared/navbar/navbar";
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Zakah-calc');
  private router = inject(Router);
  authState = inject(AuthService);

  showLogin() {
    this.router.navigate(['/login']);
  }

  showRegister() {
    this.router.navigate(['/register']);
  }

  showForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
