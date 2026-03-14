import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useGetdashboardStatsQuery } from '../../api/services/dashboard';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  bgColor = "bg-orange-500",
  iconBgColor = "bg-orange-100"
}) => {
  const isPositive = trend === 'up';

  const { data } = useGetdashboardStatsQuery();
  console.log("data", data);
  

  return (
    <div className="border-1 card-elevated rounded-2xl p-6 hover:scale-[1.02] group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 ">
          <Icon className="w-6 h-6 text-black" />
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)',
              color: isPositive ? '#22c55e' : '#f97373',
            }}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trendValue}
          </div>
        )}
      </div>

      <div>
        <p className="text-muted text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;