import React from "react";

interface KpiCardProps {
  label: string;
  value: string;
  valueTag?: string;
  icon: string;
  colorClass?: string;
  subtleValue?: string;
  subtleTag?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  valueTag,
  icon,
  colorClass = "text-gray-800",
  subtleValue,
  subtleTag,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
    <div className="text-3xl">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorClass}`}>
        {value}
        {valueTag && <span className="text-sm font-normal text-gray-400 ml-1">({valueTag})</span>}
      </p>
      {subtleValue && (
        <p className="text-sm text-gray-400 mt-1">
          {subtleValue}
          {subtleTag && <span className="text-xs ml-1">({subtleTag})</span>}
        </p>
      )}
    </div>
  </div>
);
