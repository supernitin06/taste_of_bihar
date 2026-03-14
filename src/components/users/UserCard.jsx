import React from "react";
import { Mail, Phone, User, Shield, Calendar, Star } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const UserCard = ({ user, onDelete, onViewDetails }) => {
  if (!user) return null;

  // Extract basic info from user
  const {
    _id,
    name = "Unknown User",
    email = "-",
    mobile,
    profile,
    role = "USER",
    isActive = true,
    isBlocked = false,
    isEmailVerified = false,
    provider = "local",
    reviewStats = {},
    createdAt,
  } = user;

  // Format data
  const phoneNumber = mobile || (provider === 'google' ? 'Google User' : 'Not provided');
  const profileImage = profile && profile !== 'not available' && profile.startsWith('http') 
    ? profile 
    : null;

  const totalReviews = reviewStats?.totalReviews || 0;
  const status = isBlocked ? 'Blocked' : (isActive ? 'Active' : 'Inactive');
  const providerLabel = provider === 'google' ? 'Google' : 'Mobile';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Get initials for avatar
  const getInitials = (userName) => {
    if (!userName || typeof userName !== 'string') return 'U';
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="group relative" onClick={() => onViewDetails && onViewDetails(user)}>
      <GlassCard
        className="rounded-2xl p-[2px]
                   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   shadow-lg transition-all duration-300 cursor-pointer"
      >
        {/* ===== CARD CONTENT ===== */}
        <div className="relative rounded-[18px] p-5
                        bg-white dark:bg-gray-900
                        border border-gray-200 dark:border-gray-700
                        transition-colors duration-300">

          {/* ===== STATUS INDICATOR ===== */}
          <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-[18px]
            ${isBlocked 
              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
              : isActive 
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500'}`}
          />

         
        

          {/* ===== USER PROFILE ===== */}
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full
                              bg-gradient-to-r from-indigo-500/30 to-purple-500/30 
                              blur-md group-hover:blur-lg transition-all duration-500" />
              
              <div className="relative w-14 h-14 rounded-full
                              bg-gradient-to-br from-indigo-500 to-purple-600
                              p-[2px] shadow-lg">
                <div className="w-full h-full rounded-full
                                bg-white dark:bg-gray-800
                                flex items-center justify-center
                                overflow-hidden border-2 border-white dark:border-gray-700">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`${profileImage ? 'hidden' : 'flex'} w-full h-full items-center justify-center
                                text-xl font-bold bg-gradient-to-br from-indigo-500 to-purple-500 
                                text-white`}
                  >
                    {getInitials(name)}
                  </div>
                </div>
              </div>

              {/* Provider Badge */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800
                              flex items-center justify-center text-[10px] font-bold
                              ${provider === 'google' 
                                ? 'bg-red-500 text-white' 
                                : 'bg-blue-500 text-white'}`}
                   title={providerLabel}>
                {provider === 'google' ? 'G' : 'M'}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate"
                  title={name}>
                {name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Role Badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                ${role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                  {role}
                </span>

                {/* Status Badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                ${status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  : status === 'Blocked'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                  {status}
                </span>

                {/* Email Verified Badge */}
                {isEmailVerified && (
                  <Shield className="w-3 h-3 text-emerald-500" title="Email Verified" />
                )}
              </div>
            </div>
          </div>

          {/* ===== QUICK INFO ===== */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 p-2 rounded-lg
                            bg-gray-50 dark:bg-gray-800/50
                            border border-gray-200 dark:border-gray-700">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                     title={email}>
                  {email}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-2 rounded-lg
                            bg-gray-50 dark:bg-gray-800/50
                            border border-gray-200 dark:border-gray-700">
              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                     title={phoneNumber}>
                  {phoneNumber}
                </div>
              </div>
            </div>
          </div>

          {/* ===== FOOTER STATS ===== */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Joined {formatDate(createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-amber-500" />
                <span>{totalReviews} reviews</span>
              </div>
            </div>

            {/* View Details Hint */}
            <div className="mt-2 text-center">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Click card to view full details
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default UserCard;