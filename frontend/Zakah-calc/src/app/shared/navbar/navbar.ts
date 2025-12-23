import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStorageService } from '../../services/storage-service/StorageService';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserResponse } from '../../models/response/IAuthResponse';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);
  private readonly _AuthService = inject(AuthService)
  name = AuthStorageService.getUserFullName();
  type = AuthStorageService.getUserType();
  //  : UserResponse
  
  isProfileMenuOpen = signal(false);


  toggleProfileMenu() {
    this.isProfileMenuOpen.update(v => !v);
  }
  closeMenu() {
    this.isProfileMenuOpen.set(false);
  }

  logout() {
    AuthStorageService.clear();
    this._AuthService.logout();
    this.isProfileMenuOpen.set(false);
    this.router.navigate(['/']);
  }
}
