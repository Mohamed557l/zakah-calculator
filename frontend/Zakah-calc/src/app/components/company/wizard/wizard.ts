import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ZakahCompanyRecordRequest } from '../../../models/request/ZakahCompanyRequest';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import { ZakahCompanyRecordSummaryResponse } from '../../../models/response/ZakahCompanyResponse';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard.html',
  styleUrls: ['./wizard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZakahCompanyRecordComponent {

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

  formData = signal<ZakahCompanyRecordRequest>({
    balanceSheetDate: '',
    cashEquivalents: 0,
    investment: 0,
    inventory: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
    accruedExpenses: 0,
    shortTermLiability: 0,
    yearlyLongTermLiabilities: 0,
    goldPrice: 0
  });

  zakahResult = signal<ZakahCompanyRecordSummaryResponse | null>(null);

  router = inject(Router);

  constructor(private zakahService: ZakahCompanyRecordService) {}

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
      this.router.navigate(['/after-calc']);
    },
    error: () => this.isCalculating.set(false)
  });
}
}
