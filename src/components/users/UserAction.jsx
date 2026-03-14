import React from 'react';
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import Button from '../ui/Button';


const ActionButtons = ({
  actions = {},
  item,
  onAction,
  showMoreMenu = false,
  className = '',
  size = 'md'
}) => {
  // Default actions configuration
  const defaultActions = {
    view: {
      icon: Eye,
      label: 'View',
      color: 'cyan',
      show: actions.view !== false,
      onClick: (item) => onAction?.('view', item)
    },
    edit: {
      icon: Edit2,
      label: 'Edit',
      color: 'emerald',
      show: actions.edit !== false,
      onClick: (item) => onAction?.('edit', item)
    },
    delete: {
      icon: Trash2,
      label: 'Delete',
      color: 'rose',
      show: actions.delete !== false,
      onClick: (item) => onAction?.('delete', item)
    },
    ...actions // Merge custom actions
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSize = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const renderActionButton = (actionKey, actionConfig) => {
    if (!actionConfig.show) return null;

    const Icon = actionConfig.icon;
    const colorClass = {
      cyan: 'hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200',
      emerald: 'hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200',
      rose: 'hover:bg-rose-500/20 text-rose-300 hover:text-rose-200',
      blue: 'hover:bg-blue-500/20 text-blue-300 hover:text-blue-200',
      amber: 'hover:bg-amber-500/20 text-amber-300 hover:text-amber-200',
      purple: 'hover:bg-purple-500/20 text-purple-300 hover:text-purple-200',
    }[actionConfig.color] || 'hover:bg-white/20 text-gray-300 hover:text-white';

    return (
      <Button
        key={actionKey}
        onClick={(e) => {
          e.stopPropagation();
          if (actionConfig.onClick) {
            actionConfig.onClick(item);
          }
        }}
        className={`
          ${sizeClasses[size]} 
          rounded-lg bg-white/10 
          ${colorClass}
          transition-all duration-200
          hover:scale-105 active:scale-95
          flex items-center justify-center
        `}
        title={actionConfig.label}
        aria-label={actionConfig.label}
      >
        <Icon className={iconSize[size]} />
      </Button>
    );
  };

  const visibleActions = Object.entries(defaultActions)
    .filter(([_, config]) => config.show);

  if (showMoreMenu && visibleActions.length > 3) {
    const primaryActions = visibleActions.slice(0, 2);
    const dropdownActions = visibleActions.slice(2);

    return (
      <div className={`flex gap-1 ${className}`}>
        {primaryActions.map(([key, config]) => renderActionButton(key, config))}

        {/* Dropdown for additional actions */}
        <div className="relative group">
          <Button
            className={`
              ${sizeClasses[size]} 
              rounded-lg bg-white/10 
              hover:bg-white/20 text-gray-300 hover:text-white
              transition-all duration-200
              hover:scale-105 active:scale-95
              flex items-center justify-center
            `}
            title="More actions"
            aria-label="More actions"
          >
            <MoreVertical className={iconSize[size]} />
          </Button>

          <div className="
            absolute right-0 top-full mt-1 
            bg-gray-900/95 backdrop-blur-md
            border border-white/20 rounded-xl
            p-2 min-w-30
            shadow-xl
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200
            z-50
          ">
            {dropdownActions.map(([key, config]) => (
              <Button
                key={key}
                onClick={(e) => {
                  e.stopPropagation();
                  if (config.onClick) {
                    config.onClick(item);
                  }
                }}
                className="
                  w-full text-left px-3 py-2
                  text-sm text-gray-300 hover:text-white hover:bg-white/10
                  rounded-lg transition-colors
                  flex items-center gap-2
                  shadow-none bg-transparent hover:bg-white/10
                "
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {visibleActions.map(([key, config]) => renderActionButton(key, config))}
    </div>
  );
};

export default ActionButtons;