import {ZakahStatus} from '../enums/ZakahStatus';

export interface ZakahCompanyRecordResponse {
  id: number;
  status: ZakahStatus;

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

  // Calculations
  totalAssets: number;
  totalLiabilities: number;
  currentZakahPool: number;
  zakahAmount: number;
  nisabAmount: number;

  balanceSheetDate: string;
}

export interface ZakahCompanyRecordSummaryResponse {
  id: number;
  balanceSheetDate: string;
  status: ZakahStatus;
  zakahAmount: number;
}
