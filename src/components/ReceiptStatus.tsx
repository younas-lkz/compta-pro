import React from "react";
import type { ReceiptAudit } from "../services/accountingEngine";

interface ReceiptStatusProps {
  audit: ReceiptAudit;
}

export const ReceiptStatus: React.FC<ReceiptStatusProps> = ({ audit }) => {
  const allGood = audit.missingCount === 0 && audit.lostCount === 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Justificatifs
      </h2>
      {allGood ? (
        <div className="flex items-center gap-2 text-green-600">
          <span className="text-2xl">✅</span>
          <span className="font-medium">
            Tous les justificatifs sont en ordre
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {audit.missingCount > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800">
                  {audit.missingCount} justificatif(s) manquant(s)
                </p>
                <ul className="mt-1 text-sm text-yellow-700 space-y-0.5">
                  {audit.missingTransactions.slice(0, 5).map((t, i) => (
                    <li key={i}>
                      • {t.counterpartName} –{" "}
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: t.currency,
                      }).format(Math.abs(t.amountTtc))}
                    </li>
                  ))}
                  {audit.missingCount > 5 && (
                    <li className="text-yellow-500">
                      …et {audit.missingCount - 5} autre(s)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
          {audit.lostCount > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
              <span className="text-2xl">🚫</span>
              <div>
                <p className="font-semibold text-red-800">
                  {audit.lostCount} justificatif(s) perdu(s)
                </p>
                <ul className="mt-1 text-sm text-red-700 space-y-0.5">
                  {audit.lostTransactions.slice(0, 5).map((t, i) => (
                    <li key={i}>
                      • {t.counterpartName} –{" "}
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: t.currency,
                      }).format(Math.abs(t.amountTtc))}
                    </li>
                  ))}
                  {audit.lostCount > 5 && (
                    <li className="text-red-400">
                      …et {audit.lostCount - 5} autre(s)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
