import React from 'react';
import { ChevronRight, Flame, Star } from 'lucide-react';
import BiharButton from '../ui/BiharButton';

const BiharHeroBanner = ({ onOrderClick, onMenuClick }) => {
  const bihariDishes = [
    {
      name: 'Litti Chokha',
      description: 'Traditional roasted bread with spiced potato preparation',
      emoji: '🍞',
      color: 'from-bihar-red to-bihar-maroon',
    },
    {
      name: 'Sattu Paratha',
      description: 'Wholesome flatbread filled with roasted gram flour',
      emoji: '🫓',
      color: 'from-bihar-maroon to-bihar-maroon-dark',
    },
    {
      name: 'Thekua',
      description: 'Crispy traditional sweet delicacy with condensed milk',
      emoji: '🍪',
      color: 'vibrant-gradient',
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-bihar-cream dark:bg-black overflow-hidden selection:bg-bihar-red/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-br from-bihar-red/10 via-bihar-mustard/5 to-transparent rounded-full blur-[120px] -mr-[10%] -mt-[10%] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-bihar-maroon/10 via-bihar-mustard/5 to-transparent rounded-full blur-[120px] -ml-[10%] -mb-[10%] animate-pulse"></div>
      
      {/* Floating Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-bihar-mustard/20 rounded-full blur-2xl animate-bounce duration-[4000ms]"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-bihar-red/10 rounded-full blur-3xl animate-bounce duration-[6000ms]"></div>

      {/* Main Content Container */}
      <div className="relative z-10 px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto flex flex-col justify-center min-h-screen">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Section - Hero Content */}
          <div className="space-y-10 animate-fade-in">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 glass-vibrant px-5 py-2.5 rounded-full w-fit group cursor-default">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bihar-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bihar-red"></span>
              </span>
              <span className="text-sm font-bold text-bihar-red uppercase tracking-widest group-hover:tracking-[0.2em] transition-all duration-500">
                Experience Authentic Bihar
              </span>
            </div>

            {/* Main Title Area */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black font-display leading-[0.95] tracking-tighter">
                <span className="text-bihar-maroon dark:text-white">Taste of</span> <br />
                <span className="text-vibrant italic">Bihar</span>
              </h1>
              <p className="text-xl md:text-2xl text-bihar-maroon/70 dark:text-white/70 max-w-xl font-heading leading-relaxed">
                Journey through the flavors of Pataliputra to the heart of Mithila. Authentic recipes, traditional spices, and soulful cooking.
              </p>
            </div>

            {/* Hindi Tagline */}
            <div className="text-5xl md:text-6xl font-bold font-display text-bihar-red/80 dark:text-bihar-mustard opacity-90">
              बिहार का असली स्वाद
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <button 
                onClick={onOrderClick}
                className="vibrant-gradient text-white px-10 py-5 rounded-2xl font-black text-xl shadow-bihari-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Order Now
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={onMenuClick}
                className="glass dark:bg-white/10 text-bihar-maroon dark:text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white dark:hover:bg-white/20 transition-all flex items-center justify-center border-2 border-bihar-maroon/10"
              >
                Explore Menu
              </button>
            </div>
          </div>

          {/* Right Section - Interactive Dish Cards */}
          <div className="relative">
            <div className="space-y-6 lg:ml-12">
              {bihariDishes.map((dish, index) => (
                <div
                  key={index}
                  className={`
                    group relative cursor-pointer overflow-hidden
                    ${dish.color === 'vibrant-gradient' ? 'vibrant-gradient' : `bg-gradient-to-r ${dish.color}`}
                    p-8 rounded-[2rem] border-white/20 border
                    text-white shadow-bihari-lg
                    hover:scale-105 transition-all duration-500
                    hover:shadow-[0_30px_60px_-15px_rgba(128,0,0,0.5)]
                  `}
                >
                  {/* Glass Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="text-5xl md:text-6xl group-hover:rotate-12 group-hover:scale-125 transition-transform duration-500 drop-shadow-2xl">
                      {dish.emoji}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-display mb-1 uppercase tracking-tight">
                        {dish.name}
                      </h3>
                      <p className="text-white/80 text-sm font-medium leading-snug max-w-[200px]">
                        {dish.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="mt-24 py-12 px-8 glass-vibrant rounded-[2.5rem] border-bihar-mustard/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem label="Authentic Dishes" value="50+" color="text-bihar-red" />
            <StatItem label="Satisfied Guests" value="10k+" color="text-bihar-mustard" />
            <StatItem label="Avg. Rating" value="4.9" color="text-bihar-green" isStar />
            <StatItem label="Cities Served" value="12+" color="text-bihar-red" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color, isStar }) => (
  <div className="space-y-1 group">
    <div className={`text-4xl md:text-5xl font-black font-display ${color} group-hover:scale-110 transition-transform`}>
      {isStar && "⭐ "}{value}
    </div>
    <p className="text-sm font-bold text-bihar-maroon/60 dark:text-white/50 uppercase tracking-widest">
      {label}
    </p>
  </div>
);

export default BiharHeroBanner;
