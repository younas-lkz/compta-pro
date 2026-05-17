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
      icon="🏦"
      colorClass="text-gray-800"
    />
    <KpiCard
      label="Chiffre d'affaires"
      value={formatCurrency(kpis.totalRevenue, kpis.currency)}
      icon="📈"
      colorClass="text-green-600"
      subtitle="Total encaissé (TTC)"
    />
    <KpiCard
      label="Dépenses"
      value={formatCurrency(kpis.totalExpenses, kpis.currency)}
      icon="📉"
      colorClass="text-red-500"
      subtitle="Total décaissé (TTC)"
    />
    <KpiCard
      label="Résultat net"
      value={formatCurrency(kpis.netResult, kpis.currency)}
      icon={kpis.netResult >= 0 ? "✅" : "⚠️"}
      colorClass={kpis.netResult >= 0 ? "text-green-600" : "text-red-500"}
    />
  </div>
);
