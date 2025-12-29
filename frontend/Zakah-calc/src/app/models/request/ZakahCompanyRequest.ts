export interface ZakahCompanyRecordRequest {
  balanceSheetDate: string; // dd-MM-yyyy

  // Assets
  cashEquivalents: number;
  investment: number;
  inventory: number;
  accountsReceivable: number;

  // Liabilities
  accountsPayable: number;
  accruedExpenses: number;
  shortTermLiability: number;
  yearlyLongTermLiabilities: number;

  // Zakah Info
  goldPrice: number;
}
 