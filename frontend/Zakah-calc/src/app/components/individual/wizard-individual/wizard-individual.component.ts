import {Component, inject, signal} from '@angular/core';
import {ZakahIndividualRecordRequest} from '../../../models/request/ZakahIndividualRequest';
import {ZakahIndividualRecordService} from '../../../services/zakah-individual-service/zakah-individual-service';
import {Router} from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {TooltipComponent} from "../../../shared/tooltip/tooltip";

@Component({
  selector: 'app-wizard-individual',
  standalone: true,
  templateUrl: './wizard-individual.component.html',
  styleUrls: ['./wizard-individual.component.css'],
  imports: [CurrencyPipe, TooltipComponent]
})
export class WizardIndividualComponent {

  zakahService = inject(ZakahIndividualRecordService);
  private router = inject(Router);

  formData = this.zakahService.formData;
  currentStep = this.zakahService.currentWizardStep;
  steps = this.zakahService.wizardSteps;
  isCalculating = this.zakahService.isCalculating;

  fileName = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  downloadInProgress = signal(false);

  // ================= Validation =================
  fieldErrors = signal<Partial<Record<keyof ZakahIndividualRecordRequest, string>>>({});

  ngOnInit() {
    const currentData = this.formData();
    if (!currentData.calculationDate) {
      const today = new Date().toISOString().split('T')[0];
      this.zakahService.updateFormData({calculationDate: today});
    }
  }

  // ================= Date Helpers =================
  getDisplayDate(): string {
    return this.formData().calculationDate || '';
  }

  // ================= Inputs =================
  private validateField(
    key: keyof ZakahIndividualRecordRequest,
    value: number | string | null
  ): string | null {
    if (value === null || value === undefined || value === '') {
      return 'هذا الحقل مطلوب';
    }
    if (typeof value === 'number' && value < 0) {
      return 'القيمة لا يمكن أن تكون سالبة';
    }
    return null;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const key = target.name as keyof ZakahIndividualRecordRequest;

    if (!key) return;

    const rawValue = target.value;
    const value =
      rawValue === '' || isNaN(Number(rawValue))
        ? 0
        : Number(rawValue);

    this.zakahService.updateFormData({
      [key]: value
    });

    const error = this.validateField(key, value);
    this.fieldErrors.update(errors => ({
      ...errors,
      [key]: error || undefined
    }));
  }


  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.zakahService.updateFormData({calculationDate: value});
    this.fieldErrors.update(errors => ({
      ...errors,
      calculationDate: value ? undefined : 'يرجى اختيار تاريخ'
    }));
  }

  private validateAll(): boolean {
    const data = this.formData();
    let valid = true;
    const errors: Partial<Record<keyof ZakahIndividualRecordRequest, string>> = {};

    const requiredFields: (keyof ZakahIndividualRecordRequest)[] = [
      'cash', 'gold', 'silver', 'bonds', 'stocks', 'goldPrice', 'calculationDate'
    ];

    requiredFields.forEach(key => {
      const value = data[key];
      const error = this.validateField(key, value as any);
      if (error) {
        errors[key] = error;
        valid = false;
      }
    });

    this.fieldErrors.set(errors);
    return valid;
  }

  // ================= Wizard =================
  next(): void {
    this.zakahService.nextStep();
  }

  back(): void {
    this.zakahService.prevStep();
  }

  calculate(): void {
    if (!this.validateAll()) return;

    this.errorMessage.set(null);
    this.isCalculating.set(true);

    this.zakahService.calculate().subscribe({
      next: (result) => {
        console.log('Calculation result:', result);
        this.zakahService.latestResult.set(result);
        this.isCalculating.set(false);
        this.router.navigate(['/individual/after-calc']);
      },
      error: (err) => {
        console.error('Calculation error:', err);
        this.errorMessage.set('حدث خطأ أثناء حساب الزكاة. يرجى التأكد من البيانات والمحاولة لاحقاً.');
        this.isCalculating.set(false);
      },
      complete: () => {
        this.isCalculating.set(false);
      }
    });
  }

  // ================= Display =================
  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, y, m, d] = match;
      return `${d}/${m}/${y}`;
    }
    return dateStr;
  }
}
