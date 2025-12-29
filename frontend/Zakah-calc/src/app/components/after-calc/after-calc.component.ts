import { Component, inject, OnInit, output } from '@angular/core';
import { ZakahService } from '../../services/zakah.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-after-calc',
  imports:[CurrencyPipe],
  templateUrl: './after-calc.component.html',
  styleUrls: ['./after-calc.component.css']
})
export class AfterCalcComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
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
