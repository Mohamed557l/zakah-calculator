export interface ZakahIndividualRecordRequest {
  // To be added to total assets
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  bonds: number;        // الشهادات
  tradeOffers: number;  // عروض التجارة
  jewelry: number;      // المجوهرات
  otherAssets: number;  // الاستثمارات الأخرى

  // To be deducted from total assets (liabilities)
  loans: number;        // القروض
  debt: number;         // الديون

  // General
  goldPrice: number;
  calculationDate: string; // ISO string (yyyy-MM-dd)
}
