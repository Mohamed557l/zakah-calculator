import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthStorageService } from '../../services/storage-service/StorageService';
import { UserType } from '../../models/enums/UserType';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.html',
  styleUrl: './intro.css',
})
export class Intro {
  type = AuthStorageService.getUserType();
  router = inject(Router);
  startCalculation = output<void>();
  name = AuthStorageService.getUserFullName();

  onStart() {
    // this.startCalculation.emit();
    console.log(this.type);
    if (this.type === UserType.ROLE_COMPANY_SOFTWARE) {
      this.router.navigate(['/company/company-software/wizard']);
      return;
    }

    if (this.type === UserType.ROLE_COMPANY) {
      this.router.navigate(['/company/wizard']);
      return;
    }

    if (this.type === UserType.ROLE_INDIVIDUAL) {
      this.router.navigate(['/individual/wizard']);
    }
  }

  //   ngOnInit(): void {
 
  //   if (this.type === UserType.ROLE_COMPANY_SOFTWARE) {
  //     this.router.navigate(['/company/company-software/wizard']);
  //     return;
  //   }

  //   if (this.type === UserType.ROLE_COMPANY) {
  //     this.router.navigate(['/company/wizard']);
  //     return;
  //   }

  //   if (this.type === UserType.ROLE_INDIVIDUAL) {
  //     this.router.navigate(['/individual/wizard']);
  //   }
  // }
}
