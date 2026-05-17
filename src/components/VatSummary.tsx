import React from "react";
import type { VatSummary as VatSummaryData } from "../services/accountingEngine";

interface VatSummaryProps {
  vatData: VatSummaryData[];
  currency: string;
}

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

export const VatSummary: React.FC<VatSummaryProps> = ({
  vatData,
  currency,
}) => {
  const totalVat = vatData.reduce((sum, v) => sum + v.vatAmount, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Récapitulatif TVA
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-100">
            <th className="text-left pb-2 font-medium">Taux</th>
            <th className="text-right pb-2 font-medium">Base HT</th>
            <th className="text-right pb-2 font-medium">TVA</th>
          </tr>
        </thead>
        <tbody>
          {vatData.map((v) => (
            <tr key={v.rate} className="border-b border-gray-50">
              <td className="py-2 text-gray-700">{v.rate}</td>
              <td className="py-2 text-right text-gray-700">
                {formatCurrency(v.amountExcl, currency)}
              </td>
              <td className="py-2 text-right font-medium text-indigo-600">
                {formatCurrency(v.vatAmount, currency)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-3 font-semibold text-gray-700">Total TVA</td>
            <td />
            <td className="pt-3 text-right font-bold text-indigo-700">
              {formatCurrency(totalVat, currency)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
