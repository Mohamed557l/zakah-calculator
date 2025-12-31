import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ZakahIndividualRecordRequest } from '../../../models/request/ZakahIndividualRequest';
import { ZakahIndividualRecordSummaryResponse } from '../../../models/response/ZakahIndividualResponse';
import { ZakahIndividualRecordService } from '../../../services/zakah-individual-service/zakah-individual-service';
import { Router } from '@angular/router';
import { TooltipComponent } from '../../../shared/tooltip/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wizard-individual',
  standalone: true,
  templateUrl: './wizard-individual.component.html',
  styleUrls: ['./wizard-individual.component.css'],
  imports: [CommonModule, CurrencyPipe, TooltipComponent, FormsModule]
})
export class WizardIndividualComponent {

  private zakahService = inject(ZakahIndividualRecordService);
  private router = inject(Router);

  // Wizard steps
  steps = signal([
    'البداية',
    'الأصول',
    'التفاصيل',
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

  // فاليديشن للأخطاء
  inputErrors = signal<{[key: string]: string}>({});

  // قائمة الحقول المطلوبة مع أسماءها العربية
  fieldLabels: {[key: string]: string} = {
    cash: 'النقد والأرصدة البنكية',
    gold: 'قيمة الذهب المملوكة',
    silver: 'قيمة الفضة المملوكة',
    bonds: 'السندات والصكوك',
    stocks: 'الأسهم والاستثمارات',
    goldPrice: 'سعر الذهب للجرام'
  };

  // دالة للتحقق من صحة الرقم في الوقت الحقيقي
  validateNumberInRealTime(value: string, fieldName: string): boolean {
    if (value === '' || value === null || value === undefined) {
      // إذا كان فارغ، امسح الخطأ (يمكن أن يكون صفر)
      this.inputErrors.update(errors => {
        const newErrors = {...errors};
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    }

    // تحقق إذا كان يحتوي على حروف غير مسموح بها
    const invalidChars = /[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(value);
    if (invalidChars) {
      this.inputErrors.update(errors => ({...errors, [fieldName]: `يجب أن يكون رقم فقط`}));
      return false;
    }

    // تحقق من الأرقام السالبة
    if (value.includes('-')) {
      this.inputErrors.update(errors => ({...errors, [fieldName]: `يجب أن يكون أكبر من أو يساوي صفر`}));
      return false;
    }

    const num = Number(value);

    // التحقق إذا كان رقم
    if (isNaN(num)) {
      this.inputErrors.update(errors => ({...errors, [fieldName]: `يجب أن يكون رقم صالح`}));
      return false;
    }

    // التحقق إذا كان موجب أو صفر
    if (num < 0) {
      this.inputErrors.update(errors => ({...errors, [fieldName]: `يجب أن يكون أكبر من أو يساوي صفر`}));
      return false;
    }

    // إذا كان صالح، امسح الخطأ
    this.inputErrors.update(errors => {
      const newErrors = {...errors};
      delete newErrors[fieldName];
      return newErrors;
    });

    return true;
  }

  next() {
    if (this.canProceed()) {
      if (this.currentStep() < this.steps().length - 1) {
        this.currentStep.set(this.currentStep() + 1);
      }
    }
  }

  back() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  // عند كتابة أي حرف
  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target.name as keyof ZakahIndividualRecordRequest;
    const value = target.value;

    // تحقق في الوقت الحقيقي
    const isValid = this.validateNumberInRealTime(value, name);

    // إذا كان صالح، خزّن القيمة
    if (isValid) {
      const numValue = parseFloat(value) || 0;
      this.formData.update(prev => ({ ...prev, [name]: numValue }));
    } else {
      // إذا كان غير صالح، اضبطه على 0
      this.formData.update(prev => ({ ...prev, [name]: 0 }));
    }
  }

  // عند خروج التركيز (blur) - تحقق إضافي
  onInputBlur(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target.name as keyof ZakahIndividualRecordRequest;
    const value = target.value;

    if (value === '' || value === null || value === undefined) {
      // إذا ترك الحقل فارغ، اضبطه على 0
      target.value = '0';
      this.formData.update(prev => ({ ...prev, [name]: 0 }));
      this.inputErrors.update(errors => {
        const newErrors = {...errors};
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(prev => ({ ...prev, calculationDate: value }));
  }

  // دالة للحصول على خطأ حقل معين
  getFieldError(fieldName: string): string | null {
    return this.inputErrors()[fieldName] || null;
  }

  // دالة للتحقق إذا كان هناك أخطاء
  hasErrors(): boolean {
    return Object.keys(this.inputErrors()).length > 0;
  }

  // دالة للتحقق إذا كان يمكن التالي
  canProceed(): boolean {
    // إذا في أخطاء، ماينفعش
    if (this.hasErrors()) {
      return false;
    }

    // إذا في خطوة الأصول، تأكد من وجود بيانات على الأقل
    if (this.steps()[this.currentStep()] === 'الأصول') {
      const data = this.formData();
      // إذا كل الحقول صفر، منع التالي
      if (data.cash === 0 && data.gold === 0 && data.silver === 0 &&
          data.bonds === 0 && data.stocks === 0) {
        return false;
      }
    }

    return true;
  }

  // دالة لعرض التاريخ
  getDisplayDate(): string {
    const date = this.formData().calculationDate;
    if (!date) {
      const today = new Date().toISOString().split('T')[0];
      this.formData.update(prev => ({ ...prev, calculationDate: today }));
      return today;
    }
    return date;
  }

  // دالة لعرض التاريخ بشكل مقروء
  formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  }

  calculate() {
    if (!this.hasErrors()) {
      this.isCalculating.set(true);

      this.zakahService.calculateAndSave(this.formData()).subscribe({
        next: (result) => {
          // احفظ آخر نتيجة
          this.zakahService.latestResult.set(result);
          this.isCalculating.set(false);
          this.router.navigate(['/individual/after-calc']);
        },
        error: () => this.isCalculating.set(false)
      });
    }
  }
}
