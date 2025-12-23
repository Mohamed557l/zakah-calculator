import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStorageService } from '../../services/storage-service/StorageService';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);
  private readonly _AuthService = inject(AuthService)
  isLogin = signal(true)
  
  
  isProfileMenuOpen = signal(false);

  toggleProfileMenu() {
    this.isProfileMenuOpen.update(v => !v);
  }
  closeMenu() {
    this.isProfileMenuOpen.set(false);
  }

  logout() {
    AuthStorageService.clear();

    this.isLogin.set(false);
    this.isProfileMenuOpen.set(false);

  
    this.router.navigate(['/']);
  }
}
