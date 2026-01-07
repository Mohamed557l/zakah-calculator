import { ZakahStatus } from '../enums/ZakahStatus';

export interface ZakahIndividualRecordResponse {
  id: number;
  status: ZakahStatus;

  // Individual Assets
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  bonds: number;
  tradeOffers: number;
  jewelry: number;
  otherAssets: number;

  // Liabilities
  loans: number;
  debt: number;

  // Zakah Info
  goldPrice: number;

  // Calculated Values (Main Display)
  totalAssets: number;
  totalLiabilities: number;
  zakahPool: number;
  zakahAmount: number;

  calculationDate: string; // yyyy-MM-dd
}


export interface ZakahIndividualRecordSummaryResponse {
  balanceSheetDate: string | number | Date;
  id: number;
  status: ZakahStatus;
  zakahAmount: number;
  calculationDate: string;
}
