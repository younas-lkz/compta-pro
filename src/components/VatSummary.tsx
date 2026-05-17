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
  const totalCollected = vatData.reduce(
    (sum, v) => sum + v.collected.vatAmount,
    0,
  );
  const totalPaid = vatData.reduce((sum, v) => sum + v.paid.vatAmount, 0);
  const netVat = totalCollected - totalPaid;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Récapitulatif TVA
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left pb-2 font-medium text-gray-400">Taux</th>
            <th className="text-right pb-2 font-medium text-green-600">
              TVA collectée
            </th>
            <th className="text-right pb-2 font-medium text-green-400 text-xs">
              Base HT
            </th>
            <th className="text-right pb-2 font-medium text-red-500">
              TVA déductible
            </th>
            <th className="text-right pb-2 font-medium text-red-300 text-xs">
              Base HT
            </th>
          </tr>
        </thead>
        <tbody>
          {vatData.map((v) => (
            <tr key={v.rate} className="border-b border-gray-50">
              <td className="py-2 font-medium text-gray-700">{v.rate}</td>
              <td className="py-2 text-right font-medium text-green-600">
                {formatCurrency(v.collected.vatAmount, currency)}
              </td>
              <td className="py-2 text-right text-gray-400 text-xs">
                {formatCurrency(v.collected.amountExcl, currency)}
              </td>
              <td className="py-2 text-right font-medium text-red-500">
                {formatCurrency(v.paid.vatAmount, currency)}
              </td>
              <td className="py-2 text-right text-gray-400 text-xs">
                {formatCurrency(v.paid.amountExcl, currency)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200">
            <td className="pt-3 font-semibold text-gray-700">Total</td>
            <td className="pt-3 text-right font-bold text-green-600">
              {formatCurrency(totalCollected, currency)}
            </td>
            <td />
            <td className="pt-3 text-right font-bold text-red-500">
              {formatCurrency(totalPaid, currency)}
            </td>
            <td />
          </tr>
          <tr>
            <td className="pt-2 font-semibold text-gray-700">TVA nette due</td>
            <td
              colSpan={4}
              className={`pt-2 text-right font-bold text-lg ${netVat >= 0 ? "text-indigo-700" : "text-green-600"}`}
            >
              {formatCurrency(netVat, currency)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
