// RestaurantDetailsModal.jsx
import React from 'react';
import { X, Store, MapPin, Phone, Mail } from 'lucide-react';

const RestaurantDetailsModal = ({ restaurant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className=" to-primary-hoverp-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Restaurant Details</h2>
              <p className=" text-sm">Branch Information</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Restaurant Name */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Restaurant Name</p>
              <p className="font-bold text-gray-800 dark:text-gray-100">{restaurant.name}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Address</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{restaurant.address}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contact Number</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{restaurant.phone}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{restaurant.email}</p>
            </div>
          </div>

          {/* Status */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Branch Status
                </span>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="w-full btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsModal;