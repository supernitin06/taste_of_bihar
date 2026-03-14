import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  progress,
  className = '',
  onClick
}) => {
  const isPositive = trend === 'increase' || trend === 'up';

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-primary
        rounded-2xl p-6
        border border-gray-100 dark:border-gray-700
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-in-out
        overflow-hidden
        ${onClick ? 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-600' : ''}
        ${className}
      `}
    >
      {/* RIGHT GRADIENT BORDER (FULL HEIGHT + SAME RADIUS) */}
      <span
        className={`
          absolute top-0 right-0 h-full w-[5px]
          rounded-tr-2xl rounded-br-2xl
          ${color === 'blue' && 'bg-gradient-to-b from-blue-400 to-blue-600'}
          ${color === 'green' && 'bg-gradient-to-b from-emerald-400 to-emerald-600'}
          ${color === 'orange' && 'bg-gradient-to-b from-orange-400 to-orange-600'}
          ${color === 'red' && 'bg-gradient-to-b from-rose-400 to-rose-600'}
          ${color === 'purple' && 'bg-gradient-to-b from-purple-400 to-purple-600'}
          ${color === 'yellow' && 'bg-gradient-to-b from-yellow-400 to-yellow-600'}
        `}
      />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>

        {Icon && (
          <div
            className={`
              p-3 rounded-xl
              ${color === 'blue' && 'bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400'}
              ${color === 'green' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-400'}
              ${color === 'orange' && 'bg-orange-50 text-orange-600 dark:bg-orange-900/10 dark:text-orange-400'}
              ${color === 'red' && 'bg-rose-50 text-rose-600 dark:bg-rose-900/10 dark:text-rose-400'}
              ${color === 'purple' && 'bg-purple-50 text-purple-600 dark:bg-purple-900/10 dark:text-purple-400'}
              ${color === 'yellow' && 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/10 dark:text-yellow-400'}
            `}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex items-center gap-3">
        {trend && trendValue && (
          <div
            className={`
              flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
              ${isPositive
                ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}
            `}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}

        {progress === undefined && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            vs last period
          </span>
        )}
      </div>

      {/* PROGRESS */}
      {progress !== undefined && (
        <div className="mt-3 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
          <div
            className={`
              h-full rounded-full
              ${color === 'blue' && 'bg-blue-500'}
              ${color === 'green' && 'bg-emerald-500'}
              ${color === 'orange' && 'bg-orange-500'}
              ${color === 'red' && 'bg-rose-500'}
              ${color === 'purple' && 'bg-purple-500'}
              ${color === 'yellow' && 'bg-yellow-500'}
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
