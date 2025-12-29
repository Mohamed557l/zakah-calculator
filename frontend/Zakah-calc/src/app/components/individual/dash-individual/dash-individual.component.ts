import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ZakahCompanyRecordSummaryResponse, ZakahCompanyRecordResponse } from '../../../models/response/ZakahCompanyResponse';
import { ZakahCompanyRecordService } from '../../../services/zakah-company-service/zakah-company-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ZakahIndividualRecordService } from '../../../services/zakah-individual-service/zakah-individual-service';
import { Router } from '@angular/router';
import { ZakahIndividualRecordResponse, ZakahIndividualRecordSummaryResponse } from '../../../models/response/ZakahIndividualResponse';

@Component({
  selector: 'app-dash-individual',
  templateUrl: './dash-individual.component.html',
  styleUrls: ['./dash-individual.component.css'],
  imports: [CurrencyPipe, DatePipe]
})
export class DashIndividualComponent {


  private zakahService = inject(ZakahIndividualRecordService);
  private router = inject(Router);
  isLoading = signal(true);
  // 🔹 الحالي
  currentRecord = signal<ZakahIndividualRecordResponse | null>(null);

  // 🔹 التاريخ
  history = signal<ZakahIndividualRecordSummaryResponse[]>([]);

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

   private loadFullRecord(id: number) {
    this.zakahService.getById(id).subscribe({
      next: (res) => this.currentRecord.set(res)
    });
  }

   onSelectHistoryItem(item: ZakahIndividualRecordSummaryResponse) {
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
    this.router.navigate(['/individual/wizard']);
  }

}
