import React, { useMemo, useState } from "react";
import type { Transaction } from "../domain/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
}

const formatDate = (date: Date): string =>
  date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

type SortKey = "valueDateUtc" | "amountTtc" | "counterpartName";

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "credit" | "debit">(
    "all",
  );
  const [sortKey, setSortKey] = useState<SortKey>("valueDateUtc");
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortDesc, setSortDesc] = useState(true);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((t) => t.cashFlowCategory).filter(Boolean)),
      ).sort(),
    [transactions],
  );

  const filtered = useMemo(() => {
    setVisibleCount(10);
    return transactions
      .filter((t) => {
        const matchSearch =
          !search ||
          t.counterpartName.toLowerCase().includes(search.toLowerCase()) ||
          t.cashFlowCategory.toLowerCase().includes(search.toLowerCase()) ||
          t.note.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
          !categoryFilter || t.cashFlowCategory === categoryFilter;
        const matchType =
          typeFilter === "all" ||
          (typeFilter === "credit" && t.amountTtc > 0) ||
          (typeFilter === "debit" && t.amountTtc < 0);
        return matchSearch && matchCategory && matchType;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortKey === "valueDateUtc")
          comparison = a.valueDateUtc.getTime() - b.valueDateUtc.getTime();
        else if (sortKey === "amountTtc")
          comparison = a.amountTtc - b.amountTtc;
        else if (sortKey === "counterpartName")
          comparison = a.counterpartName.localeCompare(b.counterpartName);
        return sortDesc ? -comparison : comparison;
      });
  }, [transactions, search, categoryFilter, typeFilter, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDesc((prev) => !prev);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey === column ? (sortDesc ? " ↓" : " ↑") : " ↕";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Transactions ({filtered.length})
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "credit" | "debit")
            }
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">Tous les types</option>
            <option value="credit">Encaissements</option>
            <option value="debit">Décaissements</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th
                className="text-left px-6 py-3 font-medium cursor-pointer hover:text-gray-700"
                onClick={() => toggleSort("valueDateUtc")}
              >
                Date
                <SortIcon column="valueDateUtc" />
              </th>
              <th
                className="text-left px-6 py-3 font-medium cursor-pointer hover:text-gray-700"
                onClick={() => toggleSort("counterpartName")}
              >
                Contrepartie
                <SortIcon column="counterpartName" />
              </th>
              <th className="text-left px-6 py-3 font-medium">Catégorie</th>
              <th className="text-left px-6 py-3 font-medium">Méthode</th>
              <th
                className="text-right px-6 py-3 font-medium cursor-pointer hover:text-gray-700"
                onClick={() => toggleSort("amountTtc")}
              >
                Montant TTC
                <SortIcon column="amountTtc" />
              </th>
              <th className="text-right px-6 py-3 font-medium">Solde</th>
              <th className="text-center px-6 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.slice(0, visibleCount).map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                  {formatDate(t.valueDateUtc)}
                </td>
                <td className="px-6 py-3 font-medium text-gray-800">
                  {t.counterpartName || "—"}
                </td>
                <td className="px-6 py-3">
                  {t.cashFlowCategory && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                      {t.cashFlowCategory}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-gray-500">{t.paymentMethod}</td>
                <td
                  className={`px-6 py-3 text-right font-semibold ${t.amountTtc >= 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {formatCurrency(t.amountTtc, t.currency)}
                </td>
                <td className="px-6 py-3 text-right text-gray-600">
                  {formatCurrency(t.balance, t.currency)}
                </td>
                <td className="px-6 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === "Exécuté"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Annulé"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  Aucune transaction correspondante
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {visibleCount < filtered.length && (
        <div className="px-6 py-4 border-t border-gray-100 text-center">
          <button
            onClick={() => setVisibleCount((n) => n + 10)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Voir plus ({filtered.length - visibleCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
};
