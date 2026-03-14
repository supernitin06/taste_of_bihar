import React from 'react';

const GradientButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-ghost',
    success: 'btn-primary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3
        rounded-xl
        font-semibold
        text-#2563eb
        transition-all duration-300
        hover:scale-105
        active:scale-95
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;