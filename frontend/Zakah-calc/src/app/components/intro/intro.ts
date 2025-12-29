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
type = AuthStorageService.getUserType() ?? UserType.ROLE_COMPANY;
    router = inject(Router);
startCalculation = output<void>();
name = AuthStorageService.getUserFullName();

  onStart() {
    // this.startCalculation.emit();
if(this.type === "ROLE_INDIVIDUAL"){
        this.router.navigate(['/individual/wizard']);
      }else{
        this.router.navigate(['/company/wizard']);
      }
  }
}
