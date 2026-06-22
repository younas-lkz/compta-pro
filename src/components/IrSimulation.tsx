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
  const irAmount = irBase * (irRate / 100);
  const netAfterIr = balanceExclNetVat - irAmount;

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

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Solde actuel (HT)</span>
          <span className="font-medium text-gray-800">
            {formatCurrency(balanceExclNetVat, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Salaires réintégrés</span>
          <span className="font-medium text-gray-800">
            + {formatCurrency(totalSalaries, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">
            Frais de nourriture et boissons réintégrés
          </span>
          <span className="font-medium text-gray-800">
            + {formatCurrency(totalFoodAndDrinks, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">IR estimé ({irRate} %)</span>
          <span className="font-medium text-red-500">
            − {formatCurrency(irAmount, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-semibold text-gray-700">
            Solde net après IR
          </span>
          <span
            className={`text-xl font-bold ${netAfterIr >= 0 ? "text-green-600" : "text-red-500"}`}
          >
            {formatCurrency(netAfterIr, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
