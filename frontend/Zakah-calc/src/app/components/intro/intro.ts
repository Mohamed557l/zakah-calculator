import { Component, output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthStorageService } from '../../services/storage-service/StorageService';

@Component({
  selector: 'app-intro',
  imports: [RouterLink],
  templateUrl: './intro.html',
  styleUrl: './intro.css',
})
export class Intro {
startCalculation = output<void>();
name = AuthStorageService.getUserFullName();

  onStart() {
    this.startCalculation.emit();
  }
}
