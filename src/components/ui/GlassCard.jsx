import React from 'react';

const GlassCard = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-gradient-to-br from-white/10 to-white/5 
      backdrop-blur-xl 
      border border-white/20 
      shadow-sm shadow-black/20
      rounded-2xl
      ${hover ? 'hover:bg-white/15 hover:border-white/30 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;