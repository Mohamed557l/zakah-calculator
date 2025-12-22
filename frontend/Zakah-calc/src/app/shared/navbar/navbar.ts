import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);

  isLogin = signal(true)
  
  isProfileMenuOpen = signal(false);

  toggleProfileMenu() {
    this.isProfileMenuOpen.update(v => !v);
  }
  closeMenu() {
    this.isProfileMenuOpen.set(false);
  }

  logout() {
    // logout logic
    this.router.navigate(['/']);
  }
}
