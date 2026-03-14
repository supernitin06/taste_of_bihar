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
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-bihari-md active:scale-95';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  const variantStyles = {
    primary: 'vibrant-gradient text-white hover:shadow-bihari-lg hover:scale-105 disabled:opacity-50',
    secondary: 'bg-white text-bihar-red border border-bihar-red/20 hover:bg-bihar-red hover:text-white shadow-bihari-md disabled:opacity-50',
    outline: 'border-2 border-bihar-red text-bihar-red hover:bg-bihar-red hover:text-white disabled:opacity-50',
    success: 'bg-bihar-green text-white hover:bg-bihar-green-dark shadow-bihari-md disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
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
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default BiharButton;
