import React from 'react';

/**
 * Bihar-themed badge component for labels and status indicators
 */
const BiharBadge = ({
  children,
  variant = 'mustard', // mustard, maroon, green, cream
  size = 'md', // sm, md, lg
  icon = null,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantStyles = {
    mustard: 'bg-bihar-mustard/20 text-bihar-mustard-dark border border-bihar-mustard/40',
    maroon: 'bg-bihar-maroon/20 text-bihar-maroon border border-bihar-maroon/40',
    green: 'bg-bihar-green/20 text-bihar-green-dark border border-bihar-green/40',
    cream: 'bg-bihar-cream text-bihar-mustard border border-bihar-mustard/30 shadow-sm',
    dark: 'bg-bihar-maroon text-white border border-bihar-maroon/60',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default BiharBadge;
