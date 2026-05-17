import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryAmount } from "../services/accountingEngine";

interface CategoryBreakdownProps {
  categories: CategoryAmount[];
  currency: string;
}

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#3b82f6",
  "#f97316",
  "#14b8a6",
];

const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  currency,
}) => {
  if (categories.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Dépenses par catégorie
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={categories}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {categories.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value ?? 0), currency),
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {categories.map((cat, i) => (
          <div
            key={cat.category}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-gray-600">{cat.category}</span>
              <span className="text-gray-400">({cat.transactionCount})</span>
            </span>
            <span className="font-medium text-gray-800">
              {formatCurrency(cat.amount, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
