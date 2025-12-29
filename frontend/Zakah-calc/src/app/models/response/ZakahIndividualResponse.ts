import {ZakahStatus} from '../enums/ZakahStatus';

export interface ZakahIndividualRecordResponse {
currentZakahPool: string|number;
balanceSheetDate: string|number|Date;
totalLiabilities: string|number;
nisabAmount: string|number;
cashEquivalents: any;
investment: any;
inventory: any;
accountsReceivable: any;
accountsPayable: any;
accruedExpenses: any;
shortTermLiability: any;
yearlyLongTermLiabilities: any;
  id: number;
  status: ZakahStatus;

  // Individual Assets
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  bonds: number;

  // Zakah Info
  goldPrice: number;

  // Main Info
  totalAssets: number;
  zakahAmount: number;
  calculationDate: string;
}

export interface ZakahIndividualRecordSummaryResponse {
balanceSheetDate: string|number|Date;
  id: number;
  status: ZakahStatus;
  zakahAmount: number;
  calculationDate: string;
}
