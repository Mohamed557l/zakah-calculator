
import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {AuthService} from '../../services/auth-service/auth.service';
import {UserService} from '../../services/user-service/user-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-restore-account',
  standalone: true,
  templateUrl: './restore-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RestoreAccountComponent {

  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);


  onRestore() {
    this.userService.restoreAccount()
      .subscribe(
        ()=> {
          console.log('Restore account');
          this.authService.refreshToken().subscribe({
            next: () => {
              this.router.navigate(['/intro']);
            },
            error: (err) => {
              console.error('Failed to refresh token', err);
            }
          });
        }
      )
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
