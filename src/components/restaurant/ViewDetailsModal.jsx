import React from "react";
import Button from "../ui/Button";
import {
  X,
  MapPin,
  Calendar,
  Star,
  Building,
  Navigation,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ViewDetailsModal = ({ restaurant, onClose, onApprove, onSuspend }) => {
  if (!restaurant) return null;

  const { _id, name, brandName, logo, isActive, createdAt, updatedAt } =
    restaurant;

  const handleApprove = () => onApprove && onApprove(_id);
  const handleSuspend = () => onSuspend && onSuspend(_id);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header - Light Gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 p-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                {logo ? (
                  <img
                    src={logo}
                    alt={name}
                    className="w-14 h-14 rounded-xl border-2 border-white dark:border-gray-700 shadow-soft object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl border-2 border-white dark:border-gray-700 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 shadow-soft flex items-center justify-center">
                    <Building size={22} className="text-blue-400" />
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}
                >
                  {isActive ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {brandName}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"}`}
                  >
                    {isActive ? "Active" : "Suspended"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all hover:scale-105"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 bg-gray-50 dark:bg-gray-800/50">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Address Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-5 border border-blue-100 dark:border-gray-700 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <MapPin size={18} className="text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Address Details
                </h3>
              </div>
              {restaurant.address ? (
                <div className="space-y-3">
                  {[
                    {
                      label: "Street",
                      value: restaurant.address.street,
                      color: "text-gray-800 dark:text-gray-200",
                    },
                    {
                      label: "City",
                      value: restaurant.address.city,
                      color: "text-gray-800 dark:text-gray-200",
                    },
                    {
                      label: "State",
                      value: restaurant.address.state,
                      color: "text-gray-800 dark:text-gray-200",
                    },
                    {
                      label: "ZIP Code",
                      value: restaurant.address.zipCode,
                      color: "text-gray-800 dark:text-gray-200",
                    },
                    {
                      label: "Country",
                      value: restaurant.address.country,
                      color: "text-gray-800 dark:text-gray-200",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {item.label}
                      </span>
                      <span className={`text-sm font-medium ${item.color}`}>
                        {item.value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 dark:text-gray-500 font-medium">
                    No address provided
                  </p>
                </div>
              )}
            </div>

            {/* Ratings Card */}
            <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-5 border border-amber-100 dark:border-gray-700 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Star size={18} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Customer Ratings
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {restaurant.ratings?.average || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      / 5
                    </span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < (restaurant.ratings?.average || 0) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Reviews
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {restaurant.ratings?.totalReviews || 0}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Verified Customers
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-5 border border-purple-100 dark:border-gray-700 shadow-soft lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Navigation size={18} className="text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Geographic Location
                </h3>
              </div>
              {restaurant.location?.coordinates ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-100 dark:border-gray-700 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {restaurant.location.coordinates[1]}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Latitude
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-100 dark:border-gray-700 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {restaurant.location.coordinates[0]}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Longitude
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Coordinates for map integration
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Navigation
                    size={32}
                    className="mx-auto text-gray-300 mb-3"
                  />
                  <p className="text-gray-400 dark:text-gray-500 font-medium">
                    Location not set
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Update Info */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <div className="flex gap-3">
              <Button
                variant="active"
                className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-200 overflow-hidden group ${
                  isActive
                    ? "opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30"
                }`}
                onClick={handleApprove}
                disabled={isActive}
              >
                {isActive ? (
                  <>
                    <span className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-emerald-500" />
                      Approved
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      <CheckCircle size={18} />
                      Approve
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  </>
                )}
              </Button>

              <Button
                variant="inactive"
                className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-200 overflow-hidden group ${
                  !isActive
                    ? "opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
                    : "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:shadow-rose-200/50 dark:hover:shadow-rose-900/30"
                }`}
                onClick={handleSuspend}
                disabled={!isActive}
              >
                {!isActive ? (
                  <>
                    <span className="flex items-center gap-2">
                      <AlertCircle size={18} className="text-rose-500" />
                      Suspended
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      <AlertCircle size={18} />
                      Suspend
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  </>
                )}
              </Button>
            </div>

            <Button
              className="relative px-5 py-2.5 rounded-xl font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 group overflow-hidden"
              onClick={onClose}
            >
              <span className="relative z-10 flex items-center gap-2">
                <X size={18} />
                Close
              </span>
              <span className="absolute inset-0 bg-gray-50 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
