import React, { useState } from "react";

interface IrSimulationProps {
  balanceExclNetVat: number;
  totalSalaries: number;
  totalFoodAndDrinks: number;
  currency: string;
}

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

export const IrSimulation: React.FC<IrSimulationProps> = ({
  balanceExclNetVat,
  totalSalaries,
  totalFoodAndDrinks,
  currency,
}) => {
  const [irRate, setIrRate] = useState(20);

  const irBase = balanceExclNetVat + totalSalaries + totalFoodAndDrinks;
  const patrimoineRate = 18.6;
  const irAmount = irBase * (irRate / 100);
  const patrimoineAmount = irBase * (patrimoineRate / 100);
  const balanceAfterSalaries = balanceExclNetVat + totalSalaries;
  const balanceAfterFoodAndDrinks = balanceAfterSalaries + totalFoodAndDrinks;
  const netAfterIr = balanceExclNetVat - irAmount;
  const netAfterPatrimoine = netAfterIr - patrimoineAmount;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Simulation IR
      </h2>

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-gray-500 whitespace-nowrap">
          Taux d'imposition
        </label>
        <input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={irRate}
          onChange={(e) =>
            setIrRate(
              Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
            )
          }
          className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="text-sm text-gray-500">%</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-500">Solde actuel (HT)</span>
          <span className="font-semibold tabular-nums text-gray-800">
            {formatCurrency(balanceExclNetVat, currency)}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,8rem)_minmax(0,8rem)] gap-x-4 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
            <span>Réintégration</span>
            <span className="text-right">Montant</span>
            <span className="text-right">Solde</span>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-1 gap-y-1 px-4 py-2 md:grid-cols-[minmax(0,1fr)_minmax(0,8rem)_minmax(0,8rem)] md:items-center md:gap-x-4 md:gap-y-0">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                Salaires réintégrés
              </span>
              <span className="flex items-center justify-between font-medium text-amber-500/80 md:block md:text-right md:tabular-nums">
                <span className="text-xs uppercase tracking-wide text-gray-500 md:hidden">
                  Montant
                </span>
                + {formatCurrency(totalSalaries, currency)}
              </span>
              <span className="flex items-center justify-between font-medium text-amber-500/80 md:block md:text-right md:tabular-nums">
                <span className="text-xs uppercase tracking-wide text-gray-500 md:hidden">
                  Solde
                </span>
                {formatCurrency(balanceAfterSalaries, currency)}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-y-1 px-4 py-2 md:grid-cols-[minmax(0,1fr)_minmax(0,8rem)_minmax(0,8rem)] md:items-center md:gap-x-4 md:gap-y-0">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                Frais de nourriture et boissons réintégrés
              </span>
              <span className="flex items-center justify-between font-medium text-amber-500/80 md:block md:text-right md:tabular-nums">
                <span className="text-xs uppercase tracking-wide text-gray-500 md:hidden">
                  Montant
                </span>
                + {formatCurrency(totalFoodAndDrinks, currency)}
              </span>
              <span className="flex items-center justify-between font-medium text-amber-500/80 md:block md:text-right md:tabular-nums">
                <span className="text-xs uppercase tracking-wide text-gray-500 md:hidden">
                  Solde
                </span>
                {formatCurrency(balanceAfterFoodAndDrinks, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,8rem)_minmax(0,8rem)] gap-x-4 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">
            <span>Prélèvement</span>
            <span className="text-right">Montant</span>
            <span className="text-right">Solde</span>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-1 gap-y-1 px-4 py-2 md:grid-cols-[minmax(0,1fr)_minmax(0,8rem)_minmax(0,8rem)] md:items-center md:gap-x-4 md:gap-y-0">
              <span className="text-sm text-gray-500">
                IR estimé ({irRate} %)
              </span>
              <span className="flex items-center justify-between font-medium text-red-500 md:block md:text-right md:tabular-nums">
                <span className="text-xs uppercase tracking-wide text-gray-400 md:hidden">
                  Montant
                </span>
                − {formatCurrency(irAmount, currency)}
              </span>
              <span
                className={`flex items-center justify-between font-medium md:block md:text-right md:tabular-nums ${netAfterIr >= 0 ? "text-gray-800" : "text-red-500"}`}
              >
                <span className="text-xs uppercase tracking-wide text-gray-400 md:hidden">
                  Solde
                </span>
                {formatCurrency(netAfterIr, currency)}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-y-1 px-4 py-2 md:grid-cols-[minmax(0,1fr)_minmax(0,8rem)_minmax(0,8rem)] md:items-center md:gap-x-4 md:gap-y-0">
              <span className="text-sm text-gray-500">
                Prélèvement patrimoine ({patrimoineRate.toLocaleString("fr-FR")}
                %)
              </span>
              <span className="flex items-center justify-between font-medium text-red-500 md:block md:text-right md:tabular-nums">
                <span className="text-xs uppercase tracking-wide text-gray-400 md:hidden">
                  Montant
                </span>
                − {formatCurrency(patrimoineAmount, currency)}
              </span>
              <span
                className={`flex items-center justify-between font-medium md:block md:text-right md:tabular-nums ${netAfterPatrimoine >= 0 ? "text-gray-800" : "text-red-500"}`}
              >
                <span className="text-xs uppercase tracking-wide text-gray-400 md:hidden">
                  Solde
                </span>
                {formatCurrency(netAfterPatrimoine, currency)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-semibold text-gray-700">
            Solde net après prélèvements
          </span>
          <span
            className={`text-xl font-bold ${netAfterPatrimoine >= 0 ? "text-green-600" : "text-red-500"}`}
          >
            {formatCurrency(netAfterPatrimoine, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
