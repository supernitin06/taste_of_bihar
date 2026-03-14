// components/ui/ActionButtons.jsx
import React from 'react';
import { MoreVertical } from 'lucide-react';
 
const ActionButton = ({
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
    cyan: 'hover:bg-cyan-500/20 text-cyan-300',
    emerald: 'hover:bg-emerald-500/20 text-emerald-300',
    rose: 'hover:bg-rose-500/20 text-rose-300',
    blue: 'hover:bg-blue-500/20 text-blue-300',
    amber: 'hover:bg-amber-500/20 text-amber-300',
    purple: 'hover:bg-purple-500/20 text-purple-300'
  };
 
  const visible = actions.filter(a => a.show !== false);
  const primary = visible.slice(0, maxVisible);
  const extra = visible.slice(maxVisible);
 
  const renderBtn = (action) => {
    const Icon = action.icon;
    return (
      <button
        key={action.key}
        onClick={(e) => {
          e.stopPropagation();
          action.onClick?.(item);
        }}
        className={`
          ${sizeClasses[size]}
          rounded-lg bg-white/10
          ${colorMap[action.color] || 'text-gray-300 hover:bg-white/20'}
          transition hover:scale-105 active:scale-95
          flex items-center justify-center
        `}
        title={action.label}
      >
        {Icon ? <Icon className={iconSize[size]} /> : null}
      </button>
    );
  };
 
  return (
    <div className={`flex gap-1 ${className}`}>
      {primary.map(renderBtn)}
 
      {extra.length > 0 && (
        <div className="relative group">
          <button
            className={`${sizeClasses[size]} rounded-lg bg-white/10 text-gray-300 hover:bg-white/20`}
          >
            <MoreVertical className={iconSize[size]} />
          </button>
 
          <div className="
            absolute right-0 mt-1 min-w-30
            bg-gray-900/95 border border-white/20 rounded-xl
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition p-2 z-50
          ">
            {extra.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.(item);
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
                >
                  {Icon ? <Icon className="w-4 h-4" /> : null}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ActionButton;