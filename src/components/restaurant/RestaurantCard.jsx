import React, { useState } from "react";
import { Edit, Trash2, Eye, MapPin, MoreVertical, CheckCircle, XCircle, Star } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";

const RestaurantCard = ({
  restaurant,
  onApprove,
  onView,
  onEdit,
  onDelete,
  getStatusColor,
}) => {
  if (!restaurant) return null;

  const isActive = Boolean(restaurant.isActive);
  const restaurantId = restaurant._id;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper to construct image URL
  const getImageUrl = (logo) => {
    if (!logo) return "https://placehold.co/600x400?text=No+Logo";
    if (logo.startsWith("https")) return logo;
    // Serve from the production 'uploads' directory
    return `${import.meta.env.VITE_SOCKET_URL}/uploads/${logo}`;
  };

  return (
    <>
      <GlassCard className="group relative h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-white/60 dark:bg-gray-800/60">

        {/* IMAGE SECTION */}
        <div className="relative h-48 shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-900">
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* STATUS BADGE */}
          <div className="absolute top-3 left-3 z-20">
            <div className={`
                    flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border shadow-sm
                    ${isActive
                ? 'bg-green-500/20 border-green-400/30 text-green-100'
                : 'bg-red-500/20 border-red-400/30 text-red-100'}
                 `}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* FLOATING ACTION BUTTONS (Top Right) */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(restaurant); }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all hover:scale-110"
              title="Edit"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
              className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md border border-red-500/30 text-red-200 hover:text-white shadow-lg transition-all hover:scale-110"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* BRAND INFO OVERLAY */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300">
            <h2 className="text-xl font-bold text-white mb-0.5 drop-shadow-md truncate">
              {restaurant.name || "Unnamed"}
            </h2>

            <div className="flex flex-col gap-1">
              {/* Address/Location */}
              {(restaurant.address || restaurant.location) && (
                <div className="flex items-center gap-1 text-gray-300 text-xs">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">
                    {restaurant.address?.street || restaurant.address?.city ||
                      (restaurant.location?.coordinates ? "Location Coordinates Set" : "Location N/A")}
                  </span>
                </div>
              )}

              {/* Ratings */}
              {restaurant.ratings && (
                <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                  <Star size={12} className="fill-yellow-400" />
                  <span>{restaurant.ratings.average || 0}</span>
                  <span className="text-gray-400 font-normal">({restaurant.ratings.totalReviews || 0} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT & ACTIONS */}
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onView(restaurant)}
              variant="ghost"
              className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              size="sm"
            >
              <Eye size={14} className="mr-2" />
              Details
            </Button>

            <Button
              onClick={() => onApprove(restaurantId)}
              size="sm"
              className={`w-full border-none shadow-md text-white transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/25"
                : "bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-500/25"}
                `}
            >
              {isActive ? "Active" : "Inactive"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">

            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4 text-red-500 ring-8 ring-red-50 dark:ring-red-900/10">
              <Trash2 size={32} />
            </div>

            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Delete Restaurant?</h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{restaurant.name}</span>? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onDelete(restaurantId);
                  setShowDeleteModal(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Delete
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantCard;
