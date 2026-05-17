import type { Transaction } from "../domain/transaction";
import {
  isCredit,
  isDebit,
  isMissingReceipt,
  hasLostReceipt,
} from "../domain/transaction";

export interface KpiSummary {
  currentBalance: number;
  balanceExclNetVat: number;
  totalRevenue: number;
  totalRevenueExcl: number;
  totalExpenses: number;
  totalExpensesExcl: number;
  netResult: number;
  netResultExcl: number;
  netVatDue: number;
  currency: string;
}

export interface CategoryAmount {
  category: string;
  amount: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string; // "YYYY-MM"
  label: string; // "Jan 2026"
  revenue: number;
  expenses: number;
}

export interface VatSummary {
  rate: string;
  collected: { vatAmount: number; amountExcl: number };
  paid: { vatAmount: number; amountExcl: number };
}

export interface ReceiptAudit {
  missingCount: number;
  lostCount: number;
  missingTransactions: Transaction[];
  lostTransactions: Transaction[];
}

export const computeKpis = (transactions: Transaction[]): KpiSummary => {
  const executed = transactions.filter((t) => t.status === "Exécuté");
  const credits = executed.filter(isCredit);
  const debits = executed.filter(isDebit);

  const currentBalance =
    executed.length > 0
      ? [...executed].sort(
          (a, b) => b.valueDateUtc.getTime() - a.valueDateUtc.getTime(),
        )[0].balance
      : 0;

  const totalRevenue = credits.reduce((sum, t) => sum + t.amountTtc, 0);
  const totalRevenueExcl = credits.reduce((sum, t) => sum + t.totalAmountExcl, 0);

  const totalExpenses = debits.reduce((sum, t) => sum + Math.abs(t.amountTtc), 0);
  const totalExpensesExcl = debits.reduce((sum, t) => sum + Math.abs(t.totalAmountExcl), 0);

  const vatCollected = credits.reduce((sum, t) => sum + Math.abs(t.totalVat), 0);
  const vatPaid = debits.reduce((sum, t) => sum + Math.abs(t.totalVat), 0);
  const netVatDue = vatCollected - vatPaid;

  return {
    currentBalance,
    balanceExclNetVat: currentBalance - netVatDue,
    totalRevenue,
    totalRevenueExcl,
    totalExpenses,
    totalExpensesExcl,
    netResult: totalRevenue - totalExpenses,
    netResultExcl: totalRevenueExcl - totalExpensesExcl,
    netVatDue,
    currency: transactions[0]?.currency ?? "EUR",
  };
};

export const groupExpensesByCategory = (
  transactions: Transaction[],
): CategoryAmount[] => {
  const map = new Map<string, { amount: number; count: number }>();
  transactions
    .filter((t) => t.status === "Exécuté" && isDebit(t) && t.cashFlowCategory)
    .forEach((t) => {
      const key = t.cashFlowCategory;
      const existing = map.get(key) ?? { amount: 0, count: 0 };
      map.set(key, {
        amount: existing.amount + Math.abs(t.amountTtc),
        count: existing.count + 1,
      });
    });
  return Array.from(map.entries())
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      transactionCount: count,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const groupByMonth = (transactions: Transaction[]): MonthlyData[] => {
  const map = new Map<string, { revenue: number; expenses: number }>();
  transactions
    .filter((t) => t.status === "Exécuté")
    .forEach((t) => {
      const date = t.valueDateUtc;
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      const existing = map.get(key) ?? { revenue: 0, expenses: 0 };
      if (isCredit(t)) {
        map.set(key, { ...existing, revenue: existing.revenue + t.amountTtc });
      } else if (isDebit(t)) {
        map.set(key, {
          ...existing,
          expenses: existing.expenses + Math.abs(t.amountTtc),
        });
      }
    });

  const monthNames = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      const [year, monthNum] = month.split("-");
      return {
        month,
        label: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
        ...data,
      };
    });
};

export const summarizeVat = (transactions: Transaction[]): VatSummary[] => {
  const executed = transactions.filter((t) => t.status === "Exécuté");
  const credits = executed.filter(isCredit);
  const debits = executed.filter(isDebit);

  const rates: Array<{
    rate: string;
    vat: (t: Transaction) => number;
    excl: (t: Transaction) => number;
  }> = [
    { rate: "0%",   vat: (t) => t.vat.rate0.vat,   excl: (t) => t.vat.rate0.amountExcl },
    { rate: "5,5%", vat: (t) => t.vat.rate5_5.vat, excl: (t) => t.vat.rate5_5.amountExcl },
    { rate: "10%",  vat: (t) => t.vat.rate10.vat,  excl: (t) => t.vat.rate10.amountExcl },
    { rate: "20%",  vat: (t) => t.vat.rate20.vat,  excl: (t) => t.vat.rate20.amountExcl },
  ];

  return rates
    .map(({ rate, vat, excl }) => ({
      rate,
      collected: {
        vatAmount: credits.reduce((sum, t) => sum + Math.abs(vat(t)), 0),
        amountExcl: credits.reduce((sum, t) => sum + Math.abs(excl(t)), 0),
      },
      paid: {
        vatAmount: debits.reduce((sum, t) => sum + Math.abs(vat(t)), 0),
        amountExcl: debits.reduce((sum, t) => sum + Math.abs(excl(t)), 0),
      },
    }))
    .filter(
      (s) =>
        s.collected.vatAmount > 0 ||
        s.collected.amountExcl > 0 ||
        s.paid.vatAmount > 0 ||
        s.paid.amountExcl > 0
    );
};

export const auditReceipts = (transactions: Transaction[]): ReceiptAudit => {
  const executed = transactions.filter((t) => t.status === "Exécuté");
  const missingTransactions = executed.filter(isMissingReceipt);
  const lostTransactions = executed.filter(hasLostReceipt);
  return {
    missingCount: missingTransactions.length,
    lostCount: lostTransactions.length,
    missingTransactions,
    lostTransactions,
  };
};
