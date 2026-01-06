import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import {
  ZakahCompanyRecordResponse,
  ZakahCompanyRecordSummaryResponse
} from '../../../models/response/ZakahCompanyResponse';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CurrencyPipe, DatePipe, NgxSpinnerModule]
})
export class DashboardComponent implements OnInit {
  zakahService = inject(ZakahCompanyRecordService);
  private router = inject(Router);
  isLoading = signal(true);

  // 🔹 الربط المباشر بـ signals الخدمة لضمان التزامن اللحظي
  currentRecord = this.zakahService.latestResult;
  history = this.zakahService.history;
  spinner = inject(NgxSpinnerService);
  isViewingHistory = signal(false);

  ngOnInit() {
    this.spinner.show();
    // تحميل البيانات وتحديث الـ signals في الخدمة
    this.zakahService.getAllSummaries().subscribe({
      next: (list) => {
        this.zakahService.history.set(list); // تحديث الخدمة
        this.loadFullRecord(list[0].id);

        this.isLoading.set(false);
        setTimeout(() => {
          if (!this.isLoading()) {
            this.spinner.hide();
          }
        }, 1000); // 🔹 إخفاء الـ spinner

      },
      error: (err) => {
        console.error('Error loading summaries:', err);
        // this.isLoading.set(false);
        this.spinner.hide();
      }
    });
  }



  private loadFullRecord(id: number) {
    this.zakahService.loadById(id).subscribe({
      next: (res) => {
        console.log('Data Received from API:', res); // تأكد من مسميات الحقول هنا في الكونسول
        // نقوم بعمل تصفير مؤقت ثم وضع القيمة الجديدة لضمان استجابة الـ Signal
        this.zakahService.latestResult.set(null);
        setTimeout(() => {
          this.zakahService.latestResult.set(res);
        }, 0);
      },
      error: (err) => console.error('Error loading record:', err)
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
      this.zakahService.deleteRecord(id);

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
