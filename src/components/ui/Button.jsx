import React from 'react';


const Button = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  variant = '', // primary, danger, active, inactive
  size = '', // sm
  ...props
}) => {
  const hasWidth = className.includes('w-');
  // Only apply default padding if no size class AND no manual padding class is present
  const hasPaddingY = className.includes('py-') || className.includes('p-');
  const hasPaddingX = className.includes('px-') || className.includes('p-');

  // Map props to classes
  const variantClass = variant ? `btn-${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${!hasWidth && fullWidth ? 'w-full' : ''}
        ${!hasPaddingY && !size ? 'py-3' : ''} 
        ${!hasPaddingX && !size ? 'px-4' : ''}
        btn
        ${variantClass}
        ${sizeClass}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
