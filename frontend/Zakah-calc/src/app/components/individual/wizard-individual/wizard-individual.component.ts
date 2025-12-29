import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from 'express';
import { ZakahCompanyRecordRequest } from '../../../models/request/ZakahCompanyRequest';
import { ZakahCompanyRecordSummaryResponse } from '../../../models/response/ZakahCompanyResponse';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import { CurrencyPipe } from '@angular/common';
import { ZakahIndividualRecordRequest } from '../../../models/request/ZakahIndividualRequest';
import { ZakahIndividualRecordSummaryResponse } from '../../../models/response/ZakahIndividualResponse';
import { ZakahIndividualRecordService } from '../../../services/zakah-individual-service/zakah-individual-service';

@Component({
  selector: 'app-wizard-individual',
  templateUrl: './wizard-individual.component.html',
  styleUrls: ['./wizard-individual.component.css'],
  imports: [CurrencyPipe]
})
export class WizardIndividualComponent {

  // Wizard steps
  steps = signal([
    'البداية',
    'التفاصيل',
    'الأصول',
    'الخصوم',
    'الذهب',
    'مراجعة'
  ]);

  currentStep = signal(0);
  isCalculating = signal(false);

  formData = signal<ZakahIndividualRecordRequest>({
    cash: 0,
    gold: 0,
    silver: 0,
    bonds: 0,
    stocks: 0,
    goldPrice: 0,
    calculationDate: '',
  });

  zakahResult = signal<ZakahIndividualRecordSummaryResponse | null>(null);

  router = inject(Router);

  constructor(private zakahService: ZakahIndividualRecordService) { }

  next() {
    if (this.currentStep() < this.steps().length - 1) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  back() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target.name as keyof ZakahCompanyRecordRequest;
    const value = target.type === 'number' ? Number(target.value) : target.value;
    this.formData.update(prev => ({ ...prev, [name]: value }));
  }

  onFileChange(event: Event) {
    console.log('Excel upload later');
  }

  calculate() {
    this.isCalculating.set(true);

    this.zakahService.calculateAndSave(this.formData()).subscribe({
      next: (result) => {
        // ✅ احفظ آخر نتيجة
        this.zakahService.latestResult.set(result);

        this.isCalculating.set(false);
        this.router.navigate(['/individual/individual-after-calc']);
      },
      error: () => this.isCalculating.set(false)
    });
  }
}
