import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, colorClass = "bg-white" }) => {
  return (
    <div className={`${colorClass} rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};
