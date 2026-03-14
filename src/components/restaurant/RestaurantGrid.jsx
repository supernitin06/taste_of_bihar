import React from "react";
import RestaurantCard from "./RestaurantCard";

const RestaurantGrid = ({
  filteredRestaurants,
  onApprove,
  onSuspend,
  onView,
  onEdit,
  onDelete,
  getStatusColor,
  formatCurrency,
}) =>
  
  
  {
  if (filteredRestaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 text-red-200">🍽️</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }
  console.log(filteredRestaurants);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredRestaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant._id}
          restaurant={restaurant}
          onApprove={onApprove}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          getStatusColor={getStatusColor}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
};

export default RestaurantGrid;