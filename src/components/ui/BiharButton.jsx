import React from 'react';

/**
 * Bihar-themed button component with cultural colors and animations
 */
const BiharButton = ({
  children,
  variant = 'primary', // primary, secondary, outline, success, danger
  size = 'md', // sm, md, lg
  fullWidth = false,
  icon = null,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-black uppercase tracking-widest rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 disabled:grayscale disabled:opacity-50';

  const sizeStyles = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-8 py-3.5 text-[10px]',
    lg: 'px-12 py-5 text-sm',
  };

  const variantStyles = {
    primary: 'vibrant-gradient text-white shadow-bihari-lg hover:shadow-2xl hover:scale-105 relative overflow-hidden group',
    secondary: 'bg-white dark:bg-white/5 text-bihar-red dark:text-white border border-gray-100 dark:border-white/5 hover:border-bihar-red hover:shadow-bihari-sm',
    outline: 'border-2 border-bihar-red text-bihar-red dark:text-bihar-red hover:bg-bihar-red hover:text-white',
    success: 'bg-bihar-green text-white hover:shadow-bihari-lg',
    danger: 'bg-bihar-red text-white hover:shadow-bihari-lg',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default BiharButton;
