import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import {
  ZakahCompanyRecordResponse,
  ZakahCompanyRecordSummaryResponse
} from '../../../models/response/ZakahCompanyResponse';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CurrencyPipe, DatePipe]
})
export class DashboardComponent implements OnInit {

  private zakahService = inject(ZakahCompanyRecordService);
  private router = inject(Router);
  isLoading = signal(true);
  // 🔹 الحالي
  currentRecord = signal<ZakahCompanyRecordResponse | null>(null);

  // 🔹 التاريخ
  history = signal<ZakahCompanyRecordSummaryResponse[]>([]);

  isViewingHistory = signal(false);

  historicalAverage = computed(() => {
    const h = this.history();
    if (!h.length) return 0;
    return h.reduce((sum, i) => sum + i.zakahAmount, 0) / h.length;
  });

  ngOnInit() {
    // 1️⃣ تحميل history
    this.zakahService.getAllSummaries().subscribe({
      next: (list) => {
        this.history.set(list);

        // 2️⃣ لو في latestResult من wizard
        if (this.zakahService.latestResult()) {
          this.currentRecord.set(this.zakahService.latestResult());
        }
        // 3️⃣ لو Refresh / Direct
        else if (list.length) {
          const latest = list[0]; // بافتراض API بيرجع الأحدث أولاً
          this.loadFullRecord(latest.id);
        }
      }
    });
  }

  // 🔹 تحميل Record كامل
  private loadFullRecord(id: number) {
    this.zakahService.getById(id).subscribe({
      next: (res) => this.currentRecord.set(res)
    });
  }

  // 🔹 عند الضغط على عنصر تاريخي
  onSelectHistoryItem(item: ZakahCompanyRecordSummaryResponse) {
    this.isViewingHistory.set(true);
    this.loadFullRecord(item.id);
  }

  // 🔹 عرض الأحدث
  onViewLatest() {
    this.currentRecord.set(this.zakahService.latestResult());
    this.isViewingHistory.set(false);
  }

  // 🔹 حساب جديد
  onStartNew() {
    this.router.navigate(['/company/wizard']);
  }
}
