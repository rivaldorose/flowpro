import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function BudgetDonut({ total, spent, remaining }) {
  const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;
  
  const data = [
    { name: 'Uitgegeven', value: spent },
    { name: 'Resterend', value: remaining > 0 ? remaining : 0 },
  ];

  const getColor = (pct) => {
    if (pct < 50) return '#4ade80';
    if (pct < 80) return '#fb923c';
    return '#f87171';
  };

  const COLORS = [getColor(percentage), '#374151'];

  return (
    <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
      <h3 className="text-lg font-semibold text-white mb-6">Budget Overzicht</h3>
      
      <div className="flex items-center gap-8">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">
              €{(spent / 1000).toFixed(1)}K
            </span>
            <span className="text-sm text-gray-500">Uitgegeven</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-400">Totaal Budget</span>
            </div>
            <span className="font-semibold text-white">€{total.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(percentage) }} />
              <span className="text-gray-400">Uitgegeven</span>
            </div>
            <span className="font-semibold text-white">€{spent.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-gray-400">Resterend</span>
            </div>
            <span className="font-semibold text-white">€{remaining.toLocaleString()}</span>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Gebruikt</span>
              <span className={`font-bold ${percentage < 50 ? 'text-emerald-400' : percentage < 80 ? 'text-orange-400' : 'text-red-400'}`}>
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}