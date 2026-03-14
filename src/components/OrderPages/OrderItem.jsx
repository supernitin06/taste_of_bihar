// OrderItem.jsx
import React from 'react';

const OrderItem = ({ item }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-9 h-9 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center text-lg shadow-sm">
          {item.image}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-xs truncate">
            {item.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Qty: {item.quantity}
          </p>
        </div>
      </div>
      <span className="font-bold text-primary text-xs">
        Rs. {item.finalItemPrice || item.price || 0}
      </span>
    </div>
  );
};

export default OrderItem;