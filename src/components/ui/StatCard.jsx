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

  const colorConfig = {
    blue: 'from-blue-400 to-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'from-emerald-400 to-emerald-600 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'from-orange-400 to-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    red: 'from-rose-400 to-rose-600 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    purple: 'from-purple-400 to-purple-600 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    yellow: 'from-yellow-400 to-yellow-600 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  };

  const currentStatus = colorConfig[color] || colorConfig.blue;
  const [gradient, bgIcon] = currentStatus.split(' ');

  return (
    <div
      onClick={onClick}
      className={`
        premium-card p-8 group relative overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Decorative Cultural Pattern Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 cultural-pattern opacity-[0.05] group-hover:opacity-[0.1] transition-opacity -mr-10 -mt-10 rotate-12 group-hover:rotate-45 duration-700"></div>

      {/* Dynamic Glow Background */}
      <div className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr ${gradient} opacity-0 group-hover:opacity-[0.05] blur-3xl transition-opacity duration-700`}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2">
              {title}
            </p>
            <h3 className="text-4xl font-black text-bihar-red dark:text-white font-display">
              {value}
            </h3>
          </div>

          {Icon && (
            <div className={`p-5 rounded-[1.5rem] bg-gradient-to-br ${gradient} text-white shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {trend && trendValue && (
            <div
              className={`
                flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider
                ${isPositive
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'}
              `}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trendValue}</span>
            </div>
          )}
          
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {progress === undefined ? 'Growth Pattern' : `${progress}% Momentum`}
          </span>
        </div>

        {progress !== undefined && (
          <div className="mt-6 w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient} animate-shimmer`}
              style={{ width: `${progress}%`, backgroundSize: '200% 100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
