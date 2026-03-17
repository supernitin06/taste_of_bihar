import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import BiharButton from '../ui/BiharButton';
import { useGetRatingsQuery } from '../../api/services/rating';


const CustomerReviews = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();
  const { data: ratingsData, isLoading } = useGetRatingsQuery();

  const reviews = React.useMemo(() => {
    if (!ratingsData?.data?.ratings) return [];

    return ratingsData.data.ratings.map((r, index) => {
      const gradients = [
        'from-orange-500/10 to-transparent',
        'from-red-500/10 to-transparent',
        'from-yellow-500/10 to-transparent',
        'from-blue-500/10 to-transparent',
        'from-purple-500/10 to-transparent',
        'from-green-500/10 to-transparent'
      ];
      const emojis = ['🍛', '🍕', '🍜', '🍲', '🥗', '🍩'];

      return {
        id: r._id,
        dishName: "Gourmet Experience",
        review: r.comment || "Bihar's flavors at their peak. Truly remarkable.",
        reviewer: r.rater?.userId?.name || "Premium Patron",
        date: new Date(r.createdAt).toLocaleDateString('en-US', {
           month: 'long',
           day: 'numeric'
        }),
        rating: r.rating?.overall || 5,
        image: emojis[index % emojis.length],
        gradient: gradients[index % gradients.length]
      };
    });
  }, [ratingsData]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardScroll = Math.round(scrollRef.current.clientWidth / 1.5);
      const scrollAmount = direction === 'left' ? -cardScroll : cardScroll;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      setTimeout(checkScroll, 500);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [reviews]);

  if (isLoading) {
    return (
      <div className="premium-card p-12 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-bihar-red" />
        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Gathering Flavors...</span>
      </div>
    );
  }

  return (
    <div className="premium-card p-8 group">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Social Proof</p>
          <h3 className="text-2xl font-black text-bihar-red dark:text-white font-display">Guest Experiences</h3>
        </div>
        <BiharButton 
           variant="secondary"
           onClick={() => navigate('/reviews')}
        >
          Explore Archives
        </BiharButton>
      </div>

      <div className="relative group/scroll">
        {/* Navigation Buttons */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300">
           <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-4 glass rounded-2xl hover:bg-bihar-red hover:text-white transition-all disabled:opacity-30"
           >
              <ChevronLeft className="w-5 h-5" />
           </button>
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300">
           <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-4 glass rounded-2xl hover:bg-bihar-red hover:text-white transition-all disabled:opacity-30"
           >
              <ChevronRight className="w-5 h-5" />
           </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth py-4"
        >
          {reviews.length === 0 ? (
             <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] text-gray-400 font-bold uppercase tracking-widest">
                No reviews yet
             </div>
          ) : reviews.map((review) => (
            <div
              key={review.id}
              className={`w-[320px] sm:w-[400px] flex-shrink-0 bg-white/50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-50 dark:border-white/5 hover:border-bihar-red/20 hover:shadow-bihari-md transition-all duration-500 relative overflow-hidden group/card`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${review.gradient} opacity-50`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/50 dark:ring-white/5">
                    {review.image}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-bihar-mustard text-bihar-mustard' : 'text-gray-200 dark:text-gray-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.date}</span>
                  </div>
                </div>

                <h4 className="font-black text-xl text-bihar-maroon dark:text-white mb-4 line-clamp-1">{review.dishName}</h4>
                
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8 line-clamp-3 italic">
                  "{review.review}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                  <div className="w-10 h-10 vibrant-gradient rounded-xl flex items-center justify-center text-white font-black text-xs uppercase">
                    {review.reviewer.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-bihar-red dark:text-white uppercase tracking-wider">{review.reviewer}</h5>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Guest</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;