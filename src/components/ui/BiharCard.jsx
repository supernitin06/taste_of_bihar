import React from 'react';

/**
 * Bihar-themed card component with cultural design elements
 */
const BiharCard = ({
  children,
  variant = 'default', // default, featured, hover
  onClick,
  className = '',
  title = null,
  image = null,
  footer = null,
  badge = null,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 overflow-hidden';

  const variantStyles = {
    default: 'bg-white dark:bg-gray-900 border border-bihar-mustard/20 dark:border-bihar-green/20 shadow-bihari',
    featured: 'bg-gradient-to-br from-bihar-cream to-white dark:from-bihar-maroon/20 dark:to-gray-900 border border-bihar-mustard/30 shadow-bihari-lg hover:shadow-bihari-lg',
    hover: 'bg-white dark:bg-gray-900 border border-bihar-mustard/20 hover:border-bihar-mustard hover:shadow-bihari-md cursor-pointer hover:translate-y-[-4px]',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden bg-bihar-cream/30">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {badge && (
            <div className="absolute top-3 right-3 bg-bihar-maroon text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        {title && (
          <h3 className="text-lg font-bold text-bihar-maroon dark:text-bihar-mustard mb-2 font-display">
            {title}
          </h3>
        )}
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className="px-4 py-3 bg-bihar-cream/20 dark:bg-bihar-maroon/10 border-t border-bihar-mustard/20">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BiharCard;
