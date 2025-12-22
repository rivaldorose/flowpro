import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  trend,
  trendValue,
  color = 'emerald'
}) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/10 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/10 text-orange-400',
  };

  return (
    <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}