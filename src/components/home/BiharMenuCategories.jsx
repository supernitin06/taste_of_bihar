import React, { useState } from 'react';
import BiharCard from '../ui/BiharCard';
import BiharBadge from '../ui/BiharBadge';

const BiharMenuCategories = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 'traditional',
      name: 'Traditional Bihari',
      description: 'Classic dishes that represent the heart of Bihar',
      dishes: ['Litti Chokha', 'Sattu Paratha', 'Munga ke Dal Bhat'],
      emoji: '🍲',
      featured: true,
      color: 'from-bihar-maroon to-bihar-maroon-light',
    },
    {
      id: 'snacks',
      name: 'Snacks & Savories',
      description: 'Crispy and savory treats perfect for any time',
      dishes: ['Arharwali Chikhalwali', 'Namkeen Paratha', 'Boondi Laddu'],
      emoji: '🍪',
      color: 'from-bihar-mustard to-bihar-mustard-dark',
    },
    {
      id: 'sweets',
      name: 'Sweets & Desserts',
      description: 'Traditional sweets made with authentic recipes',
      dishes: ['Thekua', 'Kheer', 'Malpua', 'Til Bel'],
      emoji: '🍰',
      featured: true,
      color: 'from-bihar-green to-bihar-green-light',
    },
    {
      id: 'drinks',
      name: 'Beverages',
      description: 'Refreshing traditional and modern drinks',
      dishes: ['Thandai', 'Sattu Sharbat', 'Milk-based Shakes'],
      emoji: '🥤',
      color: 'from-bihar-cream-dark to-bihar-mustard-light',
    },
    {
      id: 'bread',
      name: 'Breads & Rotis',
      description: 'Fresh baked traditional breads',
      dishes: ['Sattu Paratha', 'Plain Roti', 'Puri', 'Bhatura'],
      emoji: '🫓',
      color: 'from-bihar-maroon-light to-bihar-mustard',
    },
    {
      id: 'rice',
      name: 'Rice Dishes',
      description: 'Traditional rice preparations',
      dishes: ['Khichdi', 'Biryani', 'Plain Rice'],
      emoji: '🍚',
      color: 'from-bihar-green-light to-bihar-green',
    },
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    onCategorySelect?.(category);
  };

  return (
    <div className="w-full py-24 px-6 relative bg-white dark:bg-black overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-bihar-mustard/5 rounded-full blur-[100px] -ml-20 -mt-20 shrink-0"></div>
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-bihar-red/5 rounded-full blur-[100px] -mr-20 -mb-20 shrink-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="vibrant-gradient text-white px-6 py-2 rounded-full w-fit mx-auto text-xs font-black uppercase tracking-[0.3em] shadow-lg">
            Our Legacy
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-display text-vibrant">
            Flavor Collections
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Discover the diverse culinary landscape of Bihar, from street-side snacks to royal feasts.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className={`group relative p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border-2 transition-all duration-500 cursor-pointer overflow-hidden shadow-xl
                ${selectedCategory === category.id 
                  ? 'border-bihar-red shadow-bihari-lg -translate-y-4' 
                  : 'border-transparent hover:border-bihar-red/20 opacity-90 hover:opacity-100 hover:-translate-y-2 hover:shadow-bihari'
                }
              `}
            >
              {/* Category Gradient Background (Animated on Hover) */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 vibrant-gradient`}></div>
              
              <div className="relative z-10 space-y-6">
                 <div className="w-20 h-20 bg-bihar-cream/50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                    {category.emoji}
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-2xl font-black text-bihar-maroon dark:text-white font-display group-hover:text-bihar-red transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {category.description}
                    </p>
                 </div>
                
                {/* Dishes List */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {category.dishes.map((dish, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter group-hover:bg-bihar-red group-hover:text-white transition-colors">
                      {dish}
                    </span>
                  ))}
                </div>

                {/* View Category Label */}
                <div className="pt-4 flex items-center gap-2 text-bihar-red font-black text-sm group-hover:gap-4 transition-all">
                   EXPLORE SELECTION <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-12">
            <BenefitItem emoji="✨" title="Authenticity" text="Generations of culinary wisdom in every recipe." />
            <BenefitItem emoji="🌱" title="Freshness" text="Handpicked local ingredients from Bihar's heartlands." />
            <BenefitItem emoji="🏍️" title="Speed" text="Piping hot deliveries that preserve the soul of the dish." />
        </div>
      </div>
    </div>
  );
};

const BenefitItem = ({ emoji, title, text }) => (
  <div className="text-center space-y-4 group">
    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">{emoji}</div>
    <h4 className="text-xl font-black text-bihar-maroon dark:text-white uppercase tracking-tighter">
      {title}
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium px-6">
      {text}
    </p>
  </div>
);

export default BiharMenuCategories;
