import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
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
      // Generate deterministic gradient/emoji based on index or id to keep it consistent
      const gradients = [
        'from-orange-100 to-orange-50',
        'from-red-100 to-red-50',
        'from-yellow-100 to-yellow-50',
        'from-blue-100 to-blue-50',
        'from-purple-100 to-purple-50',
        'from-green-100 to-green-50'
      ];
      const emojis = ['🍝', '🍕', '🍔', '🍣', '🥗', '🍰'];

      return {
        id: r._id,
        dishName: "Dining Experience", // Generic since API seems to be order-level or doesn't explicitly return dish name here
        review: r.comment || "No comment provided.",
        reviewer: r.rater?.userId?.name || r.rater?.userId?.displayName || "Valued Customer",
        date: new Date(r.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        rating: r.rating?.overall || 0,
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
      const cardScroll = Math.round(scrollRef.current.clientWidth / 2);
      const scrollAmount = direction === 'left' ? -cardScroll : cardScroll;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      checkScroll();

      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="bg-primary rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-primary">Customer Reviews</h3>
        <Button
          onClick={() => navigate('/reviews')}
          className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors bg-transparent shadow-none p-0 w-auto hover:bg-transparent"
        >
          See More Reviews
        </Button>
      </div>

      <div className="relative overflow-hidden">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-all hover:scale-110 p-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div className="w-full overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-full sm:w-[45%] flex-shrink-0 card rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${review.gradient} dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {review.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-lg mb-1">{review.dishName}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(review.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : review.rating % 1 !== 0 && i === Math.floor(review.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                            }`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-primary opacity-80 ml-1">{review.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-primary opacity-70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {review.review}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-semibold text-primary text-sm">{review.reviewer}</p>
                    <p className="text-xs text-primary opacity-60">{review.date}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <Button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-all hover:scale-110 p-0"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;