import React from 'react';
import { CheckCircle, XCircle, Star, Award } from 'lucide-react';

const BADGE_CONFIG = {
  active: {
    icon: CheckCircle,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
  },
  inactive: {
    icon: XCircle,
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
  },
  gold: {
    icon: Award,
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
  },
  silver: {
    icon: Star,
    className:
      'bg-slate-100 text-slate-800 dark:bg-slate-400/20 dark:text-slate-300 border-slate-200 dark:border-slate-400/30',
  },
  bronze: {
    icon: Star,
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
  },
  default: {
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300 border-gray-200 dark:border-gray-500/30',
  },
};

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const Badge = ({ type = 'default', size = 'md', children, onClick }) => {
  const { icon: Icon, className } = BADGE_CONFIG[type] || BADGE_CONFIG.default;

  return (
    <span
      onClick={onClick}
      className={`
        ${SIZE_CLASSES[size]}
        ${className}
        ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-all' : ''}
        rounded-full
        border
        backdrop-blur-sm
        flex items-center gap-1.5
        font-medium
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
};

export default Badge;
