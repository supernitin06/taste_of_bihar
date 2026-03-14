// src/components/auth/AuthLayout.jsx
import React from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar, FaShareAlt, FaGlobe, FaUtensils } from 'react-icons/fa';
import InputField from '../ui/InputField';

const AuthLayout = ({ children, activeTab = 'login', onTabChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bihar-cream to-bihar-mustard/20 flex items-center justify-center p-4 font-display">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-bihari-lg overflow-hidden border border-bihar-maroon/5">
        <div className="md:flex">
          {/* Left Side - Bihar Branding */}
          <div className="md:w-1/2 bg-gradient-to-br from-bihar-maroon to-bihar-red text-white p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-bihar-mustard/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="h-full flex flex-col justify-center relative z-10">
              {/* Header */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                      <FaUtensils className="text-bihar-mustard" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase italic">Taste of Bihar</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onTabChange?.('login')}
                      className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'login'
                        ? 'bg-white text-bihar-maroon shadow-lg scale-105'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                        }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => onTabChange?.('signup')}
                      className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'signup'
                        ? 'bg-white text-bihar-maroon shadow-lg scale-105'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                        }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Main Heading */}
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.9] tracking-tighter">
                  Experience <br />
                  <span className="text-bihar-mustard italic">Authenticity</span>
                </h2>
                <p className="text-xl md:text-2xl mb-12 text-white/70 font-heading">
                  Join the elite network of traditional Bihari culinary experts.
                </p>

                {/* Features */}
                <div className="space-y-10">
                  <div className="flex items-center space-x-5 group">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 group-hover:bg-bihar-mustard group-hover:text-bihar-maroon transition-all duration-300">
                      <FaUtensils className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-1 uppercase tracking-tight">Authentic Recipes</h3>
                      <p className="text-white/60 text-sm font-medium">Preserving the soul of Mithila & Magadh</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 group">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 group-hover:bg-bihar-mustard group-hover:text-bihar-maroon transition-all duration-300">
                      <FaStar className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-1 uppercase tracking-tight">Royal Service</h3>
                      <p className="text-white/60 text-sm font-medium">Manage your restaurant with Bihari hospitality</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5 group">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10 group-hover:bg-bihar-mustard group-hover:text-bihar-maroon transition-all duration-300">
                      <FaGlobe className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-1 uppercase tracking-tight">Global Reach</h3>
                      <p className="text-white/60 text-sm font-medium">Sharing the taste of Bihar with the world</p>
                    </div>
                  </div>
                </div>

                {/* Explore Link */}
                <div className="mt-16 flex items-center gap-4 text-bihar-mustard font-black tracking-widest text-sm cursor-pointer hover:gap-6 transition-all">
                  LEARN OUR TRADITION <span>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Area */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-[#fffdf5]">
            <div className="max-w-md mx-auto h-full flex flex-col justify-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;