import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ZakahIndividualRecordService } from '../../../services/zakah-individual-service/zakah-individual-service';
import { Router } from '@angular/router';
import {
  ZakahIndividualRecordResponse,
  ZakahIndividualRecordSummaryResponse
} from '../../../models/response/ZakahIndividualResponse';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dash-individual',
  templateUrl: './dash-individual.component.html',
  styleUrls: ['./dash-individual.component.css'],
  imports: [CurrencyPipe, DatePipe, NgxSpinnerModule],
  standalone: true,
})
export class DashIndividualComponent {

  zakahService = inject(ZakahIndividualRecordService);
  private router = inject(Router);
  spinner = inject(NgxSpinnerService);
  isLoading = signal(true);

  // 🔹 الربط المباشر بـ signals الخدمة لضمان التزامن اللحظي
  currentRecord = this.zakahService.latestResult;
  history = this.zakahService.history;

  isViewingHistory = signal(false);

  ngOnInit() {
   
      this.spinner.show();
  // 🔹 تشغيل الـ spinner

    this.zakahService.getAllSummaries().subscribe({
      next: (list) => {
        this.zakahService.history.set(list);

        if (list.length > 0) {
          this.loadFullRecord(list[0].id);
        }

        this.isLoading.set(false);
        setTimeout(() => {
    if (this.isLoading()) {
      this.spinner.hide();
    }
  }, 700);
      // 🔹 إخفاء الـ spinner
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      }
    });
  }




  private loadFullRecord(id: number) {
    setTimeout(() => {
      if (this.isLoading()) {
        this.spinner.show();
      }
    }, 400); // ✅ spinner أثناء تغيير السجل

    this.zakahService.loadById(id).subscribe({
      next: (res) => {
        this.zakahService.latestResult.set(null);
        setTimeout(() => {
          this.zakahService.latestResult.set(res);
          this.spinner.hide();
        });
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      }
    });
  }

  onSelectHistoryItem(item: any) {
    this.isViewingHistory.set(true);
    this.loadFullRecord(item.id);
  }

  onViewLatest() {
    // منطق عرض الأحدث يعتمد على أول عنصر في المصفوفة المحدثة
    const h = this.history();
    if (h.length > 0) {
      this.loadFullRecord(h[0].id);
    }
    this.isViewingHistory.set(false);
  }

  confirmDelete(id: number) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا السجل نهائياً؟')) {
      this.zakahService.deleteRecord(id).subscribe({
        next: () => {
          // تحديث القائمة بعد الحذف
          this.zakahService.history.update(h =>
            h.filter(item => item.id !== id)
          );

          // لو كنت بتعرض السجل المحذوف، رجّع للأحدث
          const current = this.currentRecord();
          if (current && current.id === id) {
            const h = this.history();
            this.zakahService.latestResult.set(h.length ? h[0] : null);
          }
        },
        error: (err) => {
          console.error('Delete failed', err);
        }
      });
    }
  }

  // 🔹 حساب جديد
  onStartNew() {
    this.router.navigate(['/individual/wizard']);
  }

  historicalAverage = computed(() => {
    const h = this.history();
    if (!h.length) return 0;
    return h.reduce((sum, i) => sum + i.zakahAmount, 0) / h.length;
  });

}
