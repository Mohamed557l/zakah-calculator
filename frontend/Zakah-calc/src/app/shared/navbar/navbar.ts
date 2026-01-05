import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStorageService } from '../../services/storage-service/StorageService';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserType } from '../../models/enums/UserType';
import {ClickOutsideDirective} from '../../directives/ClickOutside.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ClickOutsideDirective],
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly _AuthService = inject(AuthService)
  name = AuthStorageService.getUserFullName();
  type = AuthStorageService.getUserType();
  //  : UserResponse

  isProfileMenuOpen = signal(false);


  constructor(private router: Router) {

  }

  // Inside your component class
  toggleProfileMenu(event: Event) {
    event.stopPropagation(); // Prevents the click from hitting the 'document' listener
    this.isProfileMenuOpen.update(val => !val);
  }

  closeMenu() {
    this.isProfileMenuOpen.set(false);
  }

  switchWizard() {
    this.isProfileMenuOpen.set(false);
    if(this.type === UserType.ROLE_INDIVIDUAL){
      this.router.navigate(['/individual/wizard']);
    }else if (this.type === UserType.ROLE_COMPANY){
      this.router.navigate(['/company/wizard']);
    }
  }

  switchDashboard() {
    this.isProfileMenuOpen.set(false);
    if(this.type === UserType.ROLE_INDIVIDUAL){
      this.router.navigate(['/individual/dashboard']);
    }else if (this.type === UserType.ROLE_COMPANY){
      this.router.navigate(['/company/dashboard']);
    }
  }

  logout() {
    this._AuthService.logout();
    this.isProfileMenuOpen.set(false);
    this.router.navigate(['/']);
  }

}
