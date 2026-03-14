import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import BiharButton from '../ui/BiharButton';
import BiharBadge from '../ui/BiharBadge';

const BiharFoodCard = ({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  rating,
  category,
  isFeatured = false,
  tags = [],
  isVeg = true,
  onAddToCart,
  onFavorite,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    setQuantity(quantity + 1);
    onAddToCart?.({ id, name, price, quantity: quantity + 1 });
  };

  const handleRemoveFromCart = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.({ id, name, isFavorited: !isFavorited });
  };

  return (
    <div className={`group rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-bihar-red/5 hover:border-bihar-red/20 shadow-xl hover:shadow-bihari transition-all duration-500 transform hover:-translate-y-2 ${isFeatured ? 'ring-2 ring-accent' : ''}`}>
      {/* Image Container */}
      <div className="relative h-56 bg-bihar-cream/30 dark:bg-black/20 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-bihar-cream/20">
            🥘
          </div>
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {discount > 0 && (
            <div className="bg-bihar-red text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
              {discount}% OFF
            </div>
          )}
          <button
            onClick={handleFavorite}
            className={`p-2.5 rounded-2xl backdrop-blur-md transition-all duration-300 border border-white/20 ${
              isFavorited
                ? 'bg-bihar-red text-white scale-110'
                : 'bg-white/40 dark:bg-black/40 text-white hover:bg-white hover:text-bihar-red'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 left-4 vibrant-gradient text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="glass px-3 py-1 rounded-xl text-xs font-bold text-white uppercase tracking-wider backdrop-blur-xl bg-black/30 border-white/10">
            {category}
          </div>
        </div>

        {/* Veg/Non-Veg Indicator */}
        <div className="absolute bottom-4 right-4">
          <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center backdrop-blur-md shadow-lg transition-transform hover:rotate-12 ${
            isVeg
              ? 'border-green-500 bg-green-500/20 text-white'
              : 'border-red-500 bg-red-500/20 text-white'
          }`}>
             <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating || 5) ? 'text-accent fill-accent' : 'text-gray-300 dark:text-gray-700'}`} />
            ))}
            <span className="text-xs font-bold text-gray-500 ml-1">{rating || '5.0'}</span>
          </div>
          <h3 className="text-xl font-black text-bihar-maroon dark:text-white font-display line-clamp-1 group-hover:text-bihar-red transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price and Add Area */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-bihar-red">₹{price}</span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
              )}
            </div>
          </div>

          <div className="w-32">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-bihar-red/5 hover:bg-bihar-red text-bihar-red hover:text-white rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                <ShoppingCart className="w-4 h-4 group-hover/btn:scale-120 transition-transform" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center justify-between vibrant-gradient text-white rounded-2xl p-1 shadow-lg">
                <button
                  onClick={handleRemoveFromCart}
                  className="w-8 h-8 flex items-center justify-center font-black text-xl hover:bg-white/20 rounded-xl transition-colors"
                >
                  −
                </button>
                <span className="font-black">{quantity}</span>
                <button
                  onClick={handleAddToCart}
                  className="w-8 h-8 flex items-center justify-center font-black text-xl hover:bg-white/20 rounded-xl transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiharFoodCard;
