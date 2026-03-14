import React, { useState, useMemo } from 'react';
import { Star, Grid3x3, List, Search, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, Settings, X } from 'lucide-react';
import Button from '../../ui/Button';
import Card from '../../ui/GlassCard';
import ReviewCard from './ReviewCard';
import InputField from '../../ui/InputField';
import StatCard from '../../ui/StatCard';
import Select from '../../ui/Select';
import { useGetRatingsQuery } from '../../../api/services/rating';



const CustomerReviewsPage = () => {
  const [viewMode, setViewMode] = useState('grid');

  const [showViewMenu, setShowViewMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    category: 'all',
    dateRange: 'all',
  });

  const { data: ratingsData, isLoading } = useGetRatingsQuery();

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      rating: 'all',
      category: 'all',
      dateRange: 'all',
    });
  };

  const allReviews = useMemo(() => {
    if (!ratingsData?.data?.ratings) return [];

    return ratingsData.data.ratings.map((r) => ({
      id: r._id,
      reviewer: r.rater?.userId?.displayName || r.rater?.userId?.name || 'Guest',
      email: r.rater?.userId?.email || 'N/A',
      orderId: r.ratedEntities?.order || 'N/A',
      dishName: 'Restaurant Order',
      review: r.comment || '',
      rating: r.rating?.overall || 0,
      status: r.status || 'pending',
      date: new Date(r.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      helpful: 0, // Placeholder
      image: '🍽️', // Placeholder
      gradient: 'from-orange-400 to-red-500', // Placeholder
      categories: r.rating?.categories || {},
      // Default category for display (highest rated or just food)
      category: 'food'
    }));
  }, [ratingsData]);

  const filteredReviews = useMemo(() => {
    return allReviews.filter(review => {
      const matchesSearch = (review.dishName && review.dishName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.reviewer && review.reviewer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.review && review.review.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filters.status === 'all' || review.status === filters.status;
      const matchesRating = filters.rating === 'all' ||
        (filters.rating === '5' && review.rating === 5) ||
        (filters.rating === '4' && review.rating >= 4 && review.rating < 5) ||
        (filters.rating === '3' && review.rating >= 3 && review.rating < 4) ||
        (filters.rating === 'low' && review.rating < 3);

      // Map filter keys to API keys
      let categoryMatch = true;
      if (filters.category !== 'all') {
        categoryMatch = false; // Default to false if filtering specific category
        if (filters.category === 'food') categoryMatch = review.categories?.foodQuality > 0;
        else if (filters.category === 'service') categoryMatch = review.categories?.service > 0;
        else if (filters.category === 'packaging') categoryMatch = review.categories?.packaging > 0;
        else if (filters.category === 'delivery') categoryMatch = review.categories?.delivery > 0;
        // categories like ambiance/value are not in API yet, so they will return false (no results)
      }

      const matchesCategory = categoryMatch;

      return matchesSearch && matchesStatus && matchesRating && matchesCategory;
    });
  }, [searchTerm, filters, allReviews]);

  const isFiltered = searchTerm !== '' ||
    filters.status !== 'all' ||
    filters.rating !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange !== 'all';

  const stats = {
    total: allReviews.length,
    approved: allReviews.filter(r => r.status === 'approved').length,
    pending: allReviews.filter(r => r.status === 'pending').length,
    rejected: allReviews.filter(r => r.status === 'rejected').length,
    avgRating: allReviews.length > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) : 0,
  };

  const statsData = [
    { title: 'Total Reviews', value: stats.total, icon: MessageSquare, color: 'blue' },
    { title: 'Approved', value: stats.approved, icon: CheckCircle, color: 'green' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
    { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'red' },
    { title: 'Avg Rating', value: stats.avgRating, icon: Star, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Review Management</h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Monitor and manage customer feedback</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {statsData.map(stat => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                className="bg-white dark:bg-gray-800"
              />
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="p-4 overflow-visible relative z-20">
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="flex-1">
                <InputField
                  type="text"
                  placeholder="Search reviews, customers, dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search className="w-5 h-5" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 items-center">
                <div className="w-full lg:w-40">
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'rejected', label: 'Rejected' },
                    ]}
                  />
                </div>
                <div className="w-full lg:w-40">
                  <Select
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                    options={[
                      { value: 'all', label: 'All Ratings' },
                      { value: '5', label: '5 Stars' },
                      { value: '4', label: '4+ Stars' },
                      { value: '3', label: '3+ Stars' },
                      { value: 'low', label: 'Below 3 Stars' },
                    ]}
                  />
                </div>
                <div className="w-full lg:w-40">
                  <Select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      { value: 'food', label: '🍽️ Food Quality' },
                      { value: 'service', label: '👨‍🍳 Service' },
                      { value: 'delivery', label: '🚚 Delivery' },
                      { value: 'packaging', label: '📦 Packaging' },
                      { value: 'ambiance', label: '🏠 Ambiance' },
                      { value: 'value', label: '💰 Value' },
                    ]}
                  />
                </div>
                <div className="w-full lg:w-40">
                  <Select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    options={[
                      { value: 'all', label: 'All Time' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' },
                    ]}
                  />
                </div>

                {/* Clear Filters Button */}
                {isFiltered && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 px-3 w-full sm:w-auto"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}

                {/* View Settings Dropdown */}
                <div className="relative flex justify-end sm:block col-span-1 sm:col-span-2 lg:col-span-1">
                  <Button
                    variant="outline"
                    onClick={() => setShowViewMenu(!showViewMenu)}
                    className="p-2"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>

                  {showViewMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-[999]">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">View Layout</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={viewMode === 'grid'}
                            onChange={() => {
                              setViewMode('grid');
                              setShowViewMenu(false);
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Grid View</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={viewMode === 'list'}
                            onChange={() => {
                              setViewMode('list');
                              setShowViewMenu(false);
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">List View</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredReviews.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{allReviews.length}</span> reviews
            </p>
          </div>

          {/* Reviews Grid/List */}
          {filteredReviews.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredReviews.map(review => (
                <ReviewCard key={review.id} review={review} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reviews Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or search terms</p>
              <Button variant="primary" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewsPage;