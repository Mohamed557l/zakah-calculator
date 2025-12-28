import { Component, inject, output } from '@angular/core';
import { ZakahService } from '../../services/zakah.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-next-steps',
  imports: [CurrencyPipe],
  templateUrl: './next-steps.html',
  styleUrl: './next-steps.css',
})
export class NextSteps {
  zakahService = inject(ZakahService);

  viewDashboard = output<void>();
  startNewCalculation = output<void>();

  onViewDashboard() {
    this.viewDashboard.emit();
  }

  onStartNewCalculation() {
    this.startNewCalculation.emit();
  }
}
