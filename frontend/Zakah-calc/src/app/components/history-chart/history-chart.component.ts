import { Component, computed, input, OnInit, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common'; // Added import for DatePipe
import { ZakahResult } from '../../models/zakah.model';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css'],
  imports: [DatePipe , CurrencyPipe] // Added DatePipe to imports for standalone component
})
export class HistoryChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  history = input.required<ZakahResult[]>();
  selectedItem = input.required<ZakahResult | null>();
  itemSelected = output<ZakahResult>();

  viewBox = '0 0 500 200';
   svgWidth = 500;
   svgHeight = 200;
   chartHeight = 175; // Leave space for labels
   barGap = 10;

  maxAmount = computed(() => {
    const historyData = this.history();
    if (historyData.length === 0) return 1;
    const amounts = historyData.map(h => h.zakahDue);
    return Math.max(...amounts, 1); // Avoid division by zero, ensure there's a max
  });

  bars = computed(() => {
    const historyData = [...this.history()].reverse(); // Show oldest first
    const count = historyData.length;
    if (count === 0) return [];
    
    const barWidth = (this.svgWidth - (count - 1) * this.barGap) / count;
    
    return historyData.map((item, index) => {
      const height = item.zakahDue > 0 ? (item.zakahDue / this.maxAmount()) * this.chartHeight : 0;
      return {
        x: index * (barWidth + this.barGap),
        y: this.svgHeight - height - 20, // y position from top, leave 20px for label
        width: barWidth,
        height: Math.max(height, 0), // Ensure height is not negative
        data: item,
      };
    });
  });

  onBarClick(item: ZakahResult) {
    this.itemSelected.emit(item);
  }

}