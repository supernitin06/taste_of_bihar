import React from 'react';
import { Star, CheckCircle, XCircle, ThumbsUp, MessageSquare, Calendar, Clock, Info } from 'lucide-react';
import Button from '../../ui/Button';
import Card from '../../ui/GlassCard';

const ReviewCard = ({ review, viewMode }) => {
  
  // Reusable Tooltip Component
  const QuickDetailsTooltip = () => (
    <div className="absolute right-0 top-8 w-72 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[99] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 text-left">
      {/* Arrow */}
      <div className="absolute -top-2 right-3 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700 transform rotate-45"></div>
      
      <h5 className="font-bold text-gray-900 dark:text-white mb-3 text-sm border-b border-gray-100 dark:border-gray-700 pb-2">Quick Details</h5>
      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Email:</span>
          <span className="font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{review.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Order ID:</span>
          <span className="font-medium text-gray-900 dark:text-white">{review.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Category:</span>
          <span className="font-medium text-gray-900 dark:text-white capitalize">{review.category}</span>
        </div>
      </div>
      <div className="my-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Full Review</p>
        <p className="text-xs text-gray-700 dark:text-gray-300 max-h-20 overflow-y-auto pr-2 scrollbar-thin">
          {review.review}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" className="flex-1 text-xs py-1.5 h-8 !gap-1"><CheckCircle size={12} /> Approve</Button>
        <Button variant="outline" className="flex-1 text-xs py-1.5 h-8 !gap-1"><XCircle size={12} /> Reject</Button>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍽️',
      service: '👨‍🍳',
      ambiance: '🏠',
      delivery: '🚚',
      packaging: '📦',
      value: '💰',
    };
    return icons[category] || '⭐';
  };

  if (viewMode === 'list') {
    return (
      <Card hover className="relative hover:z-10 transition-all duration-300">
        <div className="p-4">
          {/* --- Top Section: Main info --- */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                {review.reviewer.split(' ').map(n => n[0]).join('')}
              </div>
              {/* Reviewer & Dish */}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{review.reviewer}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{review.dishName}</p>
              </div>
            </div>

            {/* Action Button (Info Icon) */}
            <div className="relative group flex-shrink-0 self-start sm:self-center">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors">
                <Info size={18} />
              </button>
              <QuickDetailsTooltip />
            </div>
          </div>

          {/* --- Bottom Section: Stats --- */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{review.rating}</span>
            </div>

            {/* Status */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
              {review.status}
            </span>

            {/* Date & Time */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{review.date}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card hover className="relative hover:z-10">
      <div className="p-5 ">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${review.gradient} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
            {review.image}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1 truncate">{review.dishName}</h4>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
              <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{review.rating}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
              {review.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {review.reviewer.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-xs">{review.reviewer}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {review.helpful}
            </span>
          </div>
        </div>

        {/* Info Icon & Tooltip */}
        <div className="absolute top-4 right-4 group">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500 transition-colors">
            <Info size={18} />
          </button>
          <QuickDetailsTooltip />
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;