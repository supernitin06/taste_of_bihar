import React, { useState, useEffect } from 'react';
import {
  X, Mail, Phone, MapPin, Calendar, Clock, Award,
  Heart, Trash2, Star, Users, Shield, User, 
  Smartphone, Home, Building, CheckCircle, Edit,
  Cake, Activity, Globe, Bell, Package, AlertCircle,
  BadgeCheck, Hash, Database, ExternalLink, Key,
  Check, Info, AlertTriangle
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: <Check className="w-5 h-5" />,
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      iconColor: 'text-amber-600 dark:text-amber-400'
    }
  };

  const config = typeConfig[type];

  return (
    <div className={`fixed top-4 right-4 z-[100] animate-slideIn`}>
      <div className={`${config.bg} ${config.border} border rounded-xl shadow-lg p-4 max-w-sm flex items-start gap-3`}>
        <div className={`${config.iconColor} flex-shrink-0`}>
          {config.icon}
        </div>
        <div className={`flex-1 ${config.text} text-sm`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`${config.text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );


};

const UserModal = ({ user, onClose, onEdit, onDelete, isLoading }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Format dates properly - handle different formats
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'not available') return 'N/A';
    
    try {
      let date;
      
      if (dateString.includes('GMT') || dateString.includes('AM') || dateString.includes('PM')) {
        date = new Date(dateString);
      } else if (dateString.includes('T')) {
        date = new Date(dateString);
      } else {
        const parts = dateString.split(' ');
        if (parts.length >= 5) {
          const dateStr = parts.slice(0, 5).join(' ');
          date = new Date(dateStr);
        } else {
          date = new Date(dateString);
        }
      }
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Extract user data
  const userData = user.data || user;
  
  const safeUser = {
    _id: userData._id || userData.id || 'N/A',
    name: userData.name || 'Unknown User',
    email: userData.email || 'No Email',
    mobile: userData.mobile || (userData.provider === 'google' ? 'Not Provided (Google User)' : 'Not Provided'),
    displayName: userData.displayName || userData.name || 'N/A',
    profile: userData.profile === 'not available' || !userData.profile || userData.profile === '' ? null : userData.profile,
    
    provider: userData.provider || 'local',
    providerId: userData.providerId || 'N/A',
    
    role: userData.role || 'USER',
    isBlocked: userData.isBlocked || false,
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    status: userData.isBlocked ? 'Blocked' : (userData.isActive ? 'Active' : 'Inactive'),
    
    isEmailVerified: userData.isEmailVerified || false,
    isMobileVerified: userData.isMobileVerified || false,
    
    otp: userData.otp || { verified: false, expiresAt: null },
    
    reviewStats: userData.reviewStats || {
      totalReviews: 0,
      averageRatingGiven: 0,
      helpfulVotes: 0,
      badges: []
    },
    
    reviewPreferences: userData.reviewPreferences || {
      autoReminders: true,
      receiveReplies: true
    },
    preferences: userData.preferences || {
      favCuisines: [],
      vegOnly: false
    },
    
    createdAt: formatDate(userData.createdAt),
    updatedAt: formatDate(userData.updatedAt),
    lastLogin: formatDate(userData.lastLogin),
    dob: userData.dob ? formatDate(userData.dob) : 'N/A',
    
    gender: userData.gender || 'Not Specified',
    
    addresses: Array.isArray(userData.addresses) ? userData.addresses : [],
    
    __v: userData.__v || 0,
    id: userData.id || userData._id || 'N/A'
  };

  const avgRating = safeUser.reviewStats.averageRatingGiven || 0;
  const hasProfileImage = safeUser.profile && 
                          safeUser.profile !== 'not available' && 
                          safeUser.profile.startsWith('http');

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(`${label} copied to clipboard!`, 'success');
      })
      .catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
  };

  const handleDelete = () => {
    const confirmMessage = `Are you sure you want to delete "${safeUser.name}"?\n\nEmail: ${safeUser.email}\nID: ${safeUser._id}\n\nThis action cannot be undone!`;
    
    if (window.confirm(confirmMessage)) {
      onDelete(safeUser._id);
      onClose();
      showToast(`User "${safeUser.name}" deleted successfully`, 'success');
    }
  };

  const handleViewOnMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    showToast('Opening location in Google Maps...', 'info');
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto ">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center z-[101] justify-center p-4">
        <div className="relative w-full max-w-5xl">
          {/* Modal Content with Gradient Border */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            
            {/* Top Gradient Border */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Profile Details</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {safeUser._id.substring(0, 12)}...</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-6">
                
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="relative">
                      {hasProfileImage ? (
                        <>
                          <img
                            src={safeUser.profile}
                            alt={safeUser.name}
                            className="w-28 h-28 rounded-xl object-cover border-4 border-white shadow-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                                  ${safeUser.name.charAt(0).toUpperCase()}
                                </div>
                              `;
                            }}
                          />
                          <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
                            safeUser.status === 'Active' 
                              ? 'bg-green-500' 
                              : safeUser.status === 'Blocked'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}></div>
                        </>
                      ) : (
                        <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                          {safeUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* Provider Badge */}
                    <div className={`absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      safeUser.provider === 'google' 
                        ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        : safeUser.provider === 'mobile'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                    }`}>
                      {safeUser.provider === 'google' ? 'Google' : 'Mobile'}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{safeUser.name}</h3>
                          {safeUser.displayName && safeUser.displayName !== safeUser.name && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              <span className="font-medium">Display Name:</span> {safeUser.displayName}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            safeUser.status === 'Active' 
                              ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                              : safeUser.status === 'Blocked'
                              ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                          }`}>
                            {safeUser.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            safeUser.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                              : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                          }`}>
                            {safeUser.role}
                          </span>
                          {safeUser.isEmailVerified && (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
                              Email Verified
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                          <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                            <div className="font-medium text-gray-900 dark:text-white truncate" title={safeUser.email}>
                              {safeUser.email}
                            </div>
                          </div>
                          {safeUser.isEmailVerified ? (
                            <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0" title="Email Verified" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" title="Email Not Verified" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                          <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Mobile</div>
                            <div className="font-medium text-gray-900 dark:text-white truncate" title={safeUser.mobile}>
                              {safeUser.mobile}
                            </div>
                          </div>
                          {safeUser.isMobileVerified ? (
                            <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0" title="Mobile Verified" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" title="Mobile Not Verified" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                          <Globe className="w-3 h-3" />
                          Provider
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm capitalize" title={safeUser.provider}>
                          {safeUser.provider}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate" title={safeUser.createdAt}>
                          {safeUser.createdAt.includes(',') ? safeUser.createdAt.split(',')[0] : safeUser.createdAt}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last Login
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate" title={safeUser.lastLogin}>
                          {safeUser.lastLogin.includes(',') ? safeUser.lastLogin.split(',')[0] : safeUser.lastLogin}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1">
                          <Users className="w-3 h-3" />
                          Gender
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm capitalize" title={safeUser.gender}>
                          {safeUser.gender}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { 
                      label: 'Total Reviews', 
                      value: safeUser.reviewStats.totalReviews, 
                      icon: Star,
                      color: 'text-blue-600 dark:text-blue-400',
                      bg: 'bg-blue-50 dark:bg-blue-900/20',
                      description: 'Reviews given by user'
                    },
                    { 
                      label: 'Avg Rating', 
                      value: avgRating > 0 ? avgRating.toFixed(1) : '0.0', 
                      icon: Heart,
                      color: 'text-rose-600 dark:text-rose-400',
                      bg: 'bg-rose-50 dark:bg-rose-900/20',
                      description: 'Average rating given'
                    },
                    { 
                      label: 'Helpful Votes', 
                      value: safeUser.reviewStats.helpfulVotes, 
                      icon: Award,
                      color: 'text-emerald-600 dark:text-emerald-400',
                      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                      description: 'Helpful votes received'
                    },
                    { 
                      label: 'Addresses', 
                      value: safeUser.addresses.length, 
                      icon: MapPin,
                      color: 'text-purple-600 dark:text-purple-400',
                      bg: 'bg-purple-50 dark:bg-purple-900/20',
                      description: 'Saved addresses'
                    }
                  ].map((stat, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${stat.bg} hover:shadow-md transition-shadow group`}
                      title={stat.description}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-900/40')} group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.description}</div>
                    </div>
                  ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Addresses Card */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Addresses ({safeUser.addresses.length})
                        </h4>
                        {safeUser.addresses.length > 0 && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Click coordinates to view on map</span>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {safeUser.addresses.length > 0 ? (
                          safeUser.addresses.map((addr, idx) => {
                            const hasCoordinates = addr.coordinates && 
                                                   (addr.coordinates.lat !== 0 || addr.coordinates.lng !== 0) &&
                                                   addr.coordinates.lat !== null && addr.coordinates.lng !== null;
                            
                            return (
                              <div 
                                key={addr._id || idx} 
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    {addr.type === 'home' ? (
                                      <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    ) : addr.type === 'work' ? (
                                      <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    ) : (
                                      <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-gray-900 dark:text-white font-medium capitalize">
                                        {addr.type || 'Address'} {idx + 1}
                                      </span>
                                      {hasCoordinates && (
                                        <button
                                          onClick={() => handleViewOnMap(addr.coordinates.lat, addr.coordinates.lng)}
                                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          View on Map
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{addr.street || 'No street address specified'}</p>
                                    {hasCoordinates && (
                                      <div className="flex items-center gap-4 mt-2 text-xs">
                                        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                             onClick={() => handleCopy(addr.coordinates.lat?.toFixed(6), 'Latitude')}>
                                          <span className="text-gray-600 dark:text-gray-400">Lat: </span>
                                          <span className="font-mono text-gray-800 dark:text-gray-200">
                                            {addr.coordinates.lat?.toFixed(6) || 'N/A'}
                                          </span>
                                        </div>
                                        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                             onClick={() => handleCopy(addr.coordinates.lng?.toFixed(6), 'Longitude')}>
                                          <span className="text-gray-600 dark:text-gray-400">Lng: </span>
                                          <span className="font-mono text-gray-800 dark:text-gray-200">
                                            {addr.coordinates.lng?.toFixed(6) || 'N/A'}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                            <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No addresses saved</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">User hasn't added any addresses yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Account Security Card */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        Account Security
                      </h4>
                      
                      <div className="space-y-3">
                        {[
                          { 
                            label: 'Account Status', 
                            value: safeUser.status, 
                            icon: Activity, 
                            status: safeUser.status === 'Active',
                            description: 'User account status'
                          },
                          { 
                            label: 'Blocked Status', 
                            value: safeUser.isBlocked ? 'Blocked' : 'Not Blocked', 
                            icon: Shield,
                            status: !safeUser.isBlocked,
                            description: 'Account blocking status'
                          },
                          { 
                            label: 'OTP Verification', 
                            value: safeUser.otp?.verified ? 'Verified' : 'Not Verified', 
                            icon: Key,
                            status: safeUser.otp?.verified,
                            description: 'One Time Password verification'
                          }
                        ].map((detail, i) => (
                          <div 
                            key={i} 
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            title={detail.description}
                          >
                            <div className="flex items-center gap-3">
                              
                              <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${
                                detail.status === true 
                                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : detail.status === false 
                                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                <detail.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{detail.label}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{detail.description}</div>
                              </div>
                            </div>
                            <span className={`font-medium text-sm px-3 py-1 rounded-full ${
                              detail.status === true 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : detail.status === false 
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {detail.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Account Details Card */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Account Details
                      </h4>
                      
                      <div className="space-y-3">
                        {[
                          { 
                            label: 'Date of Birth', 
                            value: safeUser.dob, 
                            icon: Cake,
                            description: 'User date of birth'
                          },
                          { 
                            label: 'Provider ID', 
                            value: safeUser.providerId, 
                            icon: Hash,
                            description: safeUser.provider === 'google' ? 'Google Account ID' : 'Mobile Provider ID',
                            copyable: true
                          },
                          { 
                            label: 'Database Version', 
                            value: `v${safeUser.__v}`, 
                            icon: Database,
                            description: 'Mongoose document version'
                          },
                          { 
                            label: 'Last Updated', 
                            value: safeUser.updatedAt, 
                            icon: Calendar,
                            description: 'Last account update'
                          }
                        ].map((detail, i) => (
                          <div 
                            key={i} 
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            title={detail.description}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform">
                                <detail.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{detail.label}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{detail.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-900 dark:text-white max-w-[150px] truncate" title={detail.value}>
                                {detail.value}
                              </span>
                              {detail.copyable && (
                                <button
                                  onClick={() => handleCopy(detail.value, detail.label)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 transition-colors"
                                  title={`Copy ${detail.label}`}
                                >
                                  <Hash className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preferences Card */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Preferences & Settings
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Review Preferences */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            Review Preferences
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { 
                                label: 'Auto Reminders', 
                                value: safeUser.reviewPreferences.autoReminders,
                                description: 'Automatic review reminders'
                              },
                              { 
                                label: 'Receive Replies', 
                                value: safeUser.reviewPreferences.receiveReplies,
                                description: 'Receive replies to reviews'
                              }
                            ].map((pref, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div>
                                  <span className="text-gray-700 dark:text-gray-200 text-sm">{pref.label}</span>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{pref.description}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  pref.value 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                                    : 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                                }`}>
                                  {pref.value ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Favorite Cuisines */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-500" />
                            Favorite Cuisines ({safeUser.preferences.favCuisines.length})
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {safeUser.preferences.favCuisines && safeUser.preferences.favCuisines.length > 0 ? (
                              safeUser.preferences.favCuisines.map((cuisine, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium hover:scale-105 transition-transform cursor-default"
                                  title={cuisine}
                                >
                                  {cuisine}
                                </span>
                              ))
                            ) : (
                              <div className="text-center py-2 w-full">
                                <p className="text-gray-500 dark:text-gray-400 italic text-sm">No favorite cuisines selected</p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs">User hasn't added any favorite cuisines</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* OTP Expiry */}
                        {safeUser.otp?.expiresAt && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                              <Key className="w-4 h-4 text-blue-500" />
                              OTP Information
                            </h5>
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-gray-700 dark:text-gray-200 text-sm">Expires At</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">OTP expiration time</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                                    {formatDate(safeUser.otp.expiresAt)}
                                  </div>
                                  <div className={`text-xs ${new Date(safeUser.otp.expiresAt) > new Date() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {new Date(safeUser.otp.expiresAt) > new Date() ? 'Active' : 'Expired'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User ID Section */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        User Identification
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Unique identifiers for this user account</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          MongoDB ID
                        </div>
                        <div className="font-mono text-sm text-gray-900 dark:text-white truncate max-w-xs" title={safeUser._id}>
                          {safeUser._id}
                        </div>
                      </div>
                      {safeUser.id && safeUser.id !== safeUser._id && (
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Alternate ID
                          </div>
                          <div className="font-mono text-sm text-gray-900 dark:text-white truncate max-w-xs" title={safeUser.id}>
                            {safeUser.id}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(safeUser._id, 'User ID')}
                        className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap"
                      >
                        Copy ID
                      </button>
                      <button
                        onClick={() => {
                          const text = `User: ${safeUser.name}\nEmail: ${safeUser.email}\nID: ${safeUser._id}`;
                          handleCopy(text, 'User Details');
                        }}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                      >
                        Copy Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                >
                  Close
                </button>
                
                {onEdit && (
                  <button
                    onClick={() => onEdit(user)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;