import { Component, computed, inject, output, signal } from '@angular/core';
import { Persona, ZakahResult } from '../../models/zakah.model';
import { ZakahService } from '../../services/zakah.service';
import { HistoryChartComponent } from "../history-chart/history-chart.component";
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [HistoryChartComponent , CurrencyPipe , DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  zakahService = inject(ZakahService);
  
  startNew = output<void>();

  history = this.zakahService.calculationHistory;
  
  isViewingHistory = computed(() => !!this.zakahService.selectedHistoryItem());

  onStartNew() {
    this.zakahService.startNewCalculation();
    this.startNew.emit();
  }
  
  onSelectHistoryItem(item: ZakahResult) {
    this.zakahService.selectHistoryItem(item);
  }

  onViewLatest() {
    this.zakahService.viewLatestResult();
  }

  markAsPaid(result: ZakahResult) {
    this.zakahService.markAsPaid(result.calculationDate);
}
}
