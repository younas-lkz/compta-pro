import React, { useMemo } from "react";
import type { Transaction } from "../domain/transaction";
import {
  computeKpis,
  groupExpensesByCategory,
  groupByMonth,
  summarizeVat,
} from "../services/accountingEngine";
import { BalanceOverview } from "./BalanceOverview";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { MonthlyTrend } from "./MonthlyTrend";
import { VatSummary } from "./VatSummary";
import { IrSimulation } from "./IrSimulation";
import { TransactionTable } from "./TransactionTable";

interface DashboardProps {
  transactions: Transaction[];
  fileName: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  fileName,
  onReset,
}) => {
  const kpis = useMemo(() => computeKpis(transactions), [transactions]);
  const categories = useMemo(
    () => groupExpensesByCategory(transactions),
    [transactions],
  );
  const monthlyData = useMemo(() => groupByMonth(transactions), [transactions]);
  const vatData = useMemo(() => summarizeVat(transactions), [transactions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💼</span>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Compta Pro</h1>
            <p className="text-xs text-gray-400">
              {fileName} · {transactions.length} transactions
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          ← Changer de fichier
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <BalanceOverview kpis={kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBreakdown categories={categories} currency={kpis.currency} />
          <MonthlyTrend data={monthlyData} currency={kpis.currency} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VatSummary vatData={vatData} currency={kpis.currency} />
          <IrSimulation
            balanceExclNetVat={kpis.balanceExclNetVat}
            totalSalaries={kpis.totalSalaries}
            totalFoodAndDrinks={kpis.totalFoodAndDrinks}
            currency={kpis.currency}
          />
        </div>

        <TransactionTable transactions={transactions} />
      </main>
    </div>
  );
};
