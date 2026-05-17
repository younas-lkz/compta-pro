export type TransactionStatus = "Exécuté" | "Annulé" | "Décliné" | "En attente";
export type PaymentMethod = "Carte" | "Transférer" | "Prélèvement" | string;

export interface VatBreakdown {
  rate0: { vat: number; amountExcl: number };
  rate5_5: { vat: number; amountExcl: number };
  rate10: { vat: number; amountExcl: number };
  rate20: { vat: number; amountExcl: number };
}

export interface Transaction {
  status: TransactionStatus;
  valueDateUtc: Date;
  operationDateUtc: Date;
  amountTtc: number;
  debit: number | null;
  credit: number | null;
  balance: number;
  currency: string;
  totalVat: number;
  totalAmountExcl: number;
  vat: VatBreakdown;
  accountName: string;
  counterpartName: string;
  counterpartIban: string;
  paymentMethod: PaymentMethod;
  cardName: string;
  receiptFilename: string;
  receiptRequired: boolean;
  receiptLost: boolean;
  note: string;
  bank: string;
  cashFlowCategory: string;
  cashFlowSubcategory: string;
}

export const isDebit = (transaction: Transaction): boolean =>
  transaction.amountTtc < 0;

export const isCredit = (transaction: Transaction): boolean =>
  transaction.amountTtc > 0;

export const isMissingReceipt = (transaction: Transaction): boolean =>
  transaction.receiptRequired &&
  !transaction.receiptFilename &&
  !transaction.receiptLost;

export const hasLostReceipt = (transaction: Transaction): boolean =>
  transaction.receiptLost;
