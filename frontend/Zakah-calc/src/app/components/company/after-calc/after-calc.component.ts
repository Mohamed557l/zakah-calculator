import { Component, inject, OnInit, output, signal } from '@angular/core';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import { CurrencyPipe } from '@angular/common';
import { ZakahCompanyRecordSummaryResponse } from '../../../models/response/ZakahCompanyResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-after-calc',
  imports:[CurrencyPipe],
  templateUrl: './after-calc.component.html',
  styleUrls: ['./after-calc.component.css']
})
export class AfterCalcComponent implements OnInit {
  router = inject(Router);
  constructor() { } 
  _zakahService = inject(ZakahCompanyRecordService);

  zakahResult = signal<ZakahCompanyRecordSummaryResponse | null>(null);

  ngOnInit() {
    // Get the latest result from the service
    this.zakahResult.set(this._zakahService.latestResult());
  }

  onViewDashboard() {
      // navigate to dashboard

      this.router.navigate(['/company/dashboard']);
  }

  onStartNewCalculation() {
  this._zakahService.latestResult.set(null);
  this.router.navigate(['/company/wizard']); // go back to wizard
}

}

