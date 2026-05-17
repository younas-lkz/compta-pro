import React from "react";
import { KpiCard } from "./KpiCard";
import type { KpiSummary } from "../services/accountingEngine";

interface BalanceOverviewProps {
  kpis: KpiSummary;
}

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

export const BalanceOverview: React.FC<BalanceOverviewProps> = ({ kpis }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <KpiCard
      label="Solde actuel"
      value={formatCurrency(kpis.currentBalance, kpis.currency)}
      valueTag="TTC"
      icon="🏦"
      colorClass="text-gray-800"
      subtleValue={formatCurrency(kpis.balanceExclNetVat, kpis.currency)}
      subtleTag="HT"
    />
    <KpiCard
      label="Chiffre d'affaires"
      value={formatCurrency(kpis.totalRevenue, kpis.currency)}
      valueTag="TTC"
      icon="📈"
      colorClass="text-green-600"
      subtleValue={formatCurrency(kpis.totalRevenueExcl, kpis.currency)}
      subtleTag="HT"
    />
    <KpiCard
      label="Dépenses"
      value={formatCurrency(kpis.totalExpenses, kpis.currency)}
      valueTag="TTC"
      icon="📉"
      colorClass="text-red-500"
      subtleValue={formatCurrency(kpis.totalExpensesExcl, kpis.currency)}
      subtleTag="HT"
    />
    <KpiCard
      label="Résultat net"
      value={formatCurrency(kpis.netResult, kpis.currency)}
      valueTag="TTC"
      icon={kpis.netResult >= 0 ? "✅" : "⚠️"}
      colorClass={kpis.netResult >= 0 ? "text-green-600" : "text-red-500"}
      subtleValue={formatCurrency(kpis.netResultExcl, kpis.currency)}
      subtleTag="HT"
    />
  </div>
);
