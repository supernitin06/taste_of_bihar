import React from 'react';

const ToggleSwitch = ({ isLogin, onToggle }) => {
  return (
    <div className="flex bg-gray-100 rounded-full p-1 mb-8 shadow-inner">
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-3 px-6 rounded-full font-semibold text-lg transition-all duration-300 ${isLogin
            ? 'bg-white text-purple-600 shadow-sm transform scale-[1.02]'
            : 'text-gray-600 hover:text-gray-800'
          }`}
      >
        Login
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-3 px-6 rounded-full font-semibold text-lg transition-all duration-300 ${!isLogin
            ? 'bg-white text-purple-600 shadow-sm transform scale-[1.02]'
            : 'text-gray-600 hover:text-gray-800'
          }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default ToggleSwitch;