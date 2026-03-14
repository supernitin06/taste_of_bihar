// components/ui/ActionButtons.jsx
import React from 'react';
import { MoreVertical } from 'lucide-react';

const ActionButtons = ({
  item,
  actions = [],
  maxVisible = 2,
  size = 'md',
  className = ''
}) => {
  if (!Array.isArray(actions) || actions.length === 0) return null;

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorMap = {
    cyan: 'hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300',
    emerald: 'hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
    rose: 'hover:bg-rose-50 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-300',
    blue: 'hover:bg-blue-50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-300',
    amber: 'hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-300',
    purple: 'hover:bg-purple-50 dark:hover:bg-purple-500/20 text-purple-600 dark:text-purple-300'
  };

  const visible = actions.filter(a => a.show !== false);
  const primary = visible.slice(0, maxVisible);
  const extra = visible.slice(maxVisible);

  const renderBtn = (action) => {
    // Icon can be a React component or a function that returns a component
    const Icon = typeof action.icon === 'function' ? action.icon(item) : action.icon;
    const label = typeof action.label === 'function' ? action.label(item) : action.label;
    const color = typeof action.color === 'function' ? action.color(item) : action.color;
    const isDisabled = typeof action.disabled === 'function' ? action.disabled(item) : action.disabled;
    
    return (
      <button
        key={action.key}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDisabled) {
            action.onClick?.(item);
          }
        }}
        disabled={isDisabled}
        className={`
          ${sizeClasses[size]}
          rounded-lg bg-gray-100 dark:bg-white/10
          ${colorMap[color] || 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'}
          transition hover:scale-105 active:scale-95
          flex items-center justify-center
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={label}
      >
        {Icon && <Icon className={iconSize[size]} />}
      </button>
    );
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {primary.map(renderBtn)}

      {extra.length > 0 && (
        <div className="relative group">
          <button
            className={`${sizeClasses[size]} rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20`}
          >
            <MoreVertical className={iconSize[size]} />
          </button>

          <div className="
            absolute right-0 mt-1 -top-10 min-w-30
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl
            shadow-lg
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition p-2 z-50
          ">
            {extra.map(action => {
              // Icon can be a React component or a function that returns a component
              const Icon = typeof action.icon === 'function' ? action.icon(item) : action.icon;
              const label = typeof action.label === 'function' ? action.label(item) : action.label;
              const isDisabled = typeof action.disabled === 'function' ? action.disabled(item) : action.disabled;
              
              return (
                <button
                  key={action.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) {
                      action.onClick?.(item);
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full px-3 py-2 z-50 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg flex items-center gap-2 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`} 
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
