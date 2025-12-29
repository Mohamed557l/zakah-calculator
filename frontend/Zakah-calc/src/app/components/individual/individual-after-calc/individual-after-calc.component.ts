import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from 'express';
import { ZakahCompanyRecordSummaryResponse } from '../../../models/response/ZakahCompanyResponse';
import { ZakahIndividualRecordService } from '../../../services/zakah-individual-service/zakah-individual-service';
import { ZakahIndividualRecordResponse } from '../../../models/response/ZakahIndividualResponse';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-individual-after-calc',
  templateUrl: './individual-after-calc.component.html',
  styleUrls: ['./individual-after-calc.component.css'],
  imports: [CurrencyPipe],
})
export class IndividualAfterCalcComponent implements OnInit {

router = inject(Router);
  constructor() { } 
  _zakahService = inject(ZakahIndividualRecordService);

  zakahResult = signal<ZakahIndividualRecordResponse | null>(null);

  ngOnInit() {
    // Get the latest result from the service
    this.zakahResult.set(this._zakahService.latestResult());
  }

  onViewDashboard() {
      // navigate to dashboard

      this.router.navigate(['/individual/dashboard']);
  }

  onStartNewCalculation() {
  this._zakahService.latestResult.set(null);
  this.router.navigate(['/individual/wizard']); // go back to wizard
}
      
}
  