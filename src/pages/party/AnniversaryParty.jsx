import React from "react";
import { Heart, Star, Music, Camera, Users, Calendar, Diamond } from "lucide-react";
import Button from "../../components/ui/Button";

const AnniversaryParty = () => {
  const partyFeatures = [
    { icon: Heart, label: "Romantic Decor", desc: "Flowers & candle light", color: "text-rose-600", bg: "bg-rose-100" },
    { icon: Diamond, label: "Luxury Setting", desc: "Premium table setup", color: "text-amber-500", bg: "bg-amber-100" },
    { icon: Camera, label: "Photo Booth", desc: "Professional photography", color: "text-blue-500", bg: "bg-blue-100" },
    { icon: Star, label: "Exclusive Menu", desc: "Chef's special tasting", color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <div className="app page">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex bg-gradient-to-r from-amber-600 to-amber-800 flex-col md:flex-row justify-between items-start md:items-center p-8 md:p-10 rounded-3xl shadow-xl border border-white/20 transition-all duration-300 backdrop-blur-md">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Diamond className="w-8 h-8 " />
                <h1 className="text-4xl font-black tracking-tight">Anniversary Parties</h1>
              </div>
              <p className="text-white/80 text-lg font-medium font-serif italic">
                Celebrate years of love with a royal dining experience.
              </p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="mt-4 md:mt-0 bg-white/10 border-white/30 text-white hover:bg-white hover:text-amber-700 font-bold px-8 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
                 Book Event
               </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {partyFeatures.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group cursor-default">
              <div className={`${f.bg} w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-opacity-80 transition-all`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{f.label}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                      <Star className="text-amber-500 fill-amber-500" /> Platinum Bookings
                   </h2>
                   <div className="flex gap-2">
                      <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-xs font-bold text-gray-500">Filters</span>
                   </div>
                </div>

                <div className="space-y-6">
                   {[1, 2].map((_, i) => (
                     <div key={i} className="group relative bg-gray-50 dark:bg-gray-700/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 hover:border-amber-300 transition-all overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                           <div className="w-full md:w-40 h-40 bg-gray-200 rounded-2xl overflow-hidden shadow-inner">
                              <img src={`https://res.cloudinary.com/dp8jfjx7c/image/upload/v1773641859/taste-of-bihar/categories/category-1773641858870.avif`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between mb-2">
                                 <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Platinum Series</span>
                                 <span className="text-xs font-bold text-gray-400">#ANN-2024-00{i+1}</span>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sharma's 25th Silver Jubilee</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">A grand celebration with 150 guests featuring a 5-course traditional Bihari thali and live Gazal music.</p>
                              <div className="flex flex-wrap gap-4 items-center">
                                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 text-xs font-bold">
                                    <Calendar size={14} className="text-amber-500" /> 22nd March
                                 </div>
                                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 text-xs font-bold">
                                    <Users size={14} className="text-amber-500" /> 150 Guests
                                 </div>
                                 <Button variant="primary" className="ml-auto bg-amber-600 hover:bg-amber-700 border-none px-6 text-xs transform hover:-translate-y-1 transition-all">Manage Event</Button>
                              </div>
                           </div>
                        </div>
                        {/* Decorative background logo */}
                        <Heart className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-rose-500 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000" />
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-800">
                   <Heart className="text-rose-500 fill-rose-500" />
                </div>
                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 uppercase">Silver & Gold</h3>
                <p className="text-sm text-gray-500 mb-6">Create memories that last a lifetime with our bespoke plans.</p>
                <div className="grid grid-cols-2 gap-2">
                   <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                      <span className="block text-xl font-black text-gray-800 dark:text-white">12</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Active</span>
                   </div>
                   <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                      <span className="block text-xl font-black text-gray-800 dark:text-white">08</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Drafts</span>
                   </div>
                </div>
             </div>

             <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-2">Premium Partner</h4>
                   <h3 className="text-2xl font-black mb-4 uppercase">Want to host?</h3>
                   <p className="text-white/60 text-sm mb-6">Our dedicated event manager will handle everything from decor to dining.</p>
                   <Button className="w-full bg-amber-500 text-black font-black py-4 border-none hover:bg-amber-400">Request Call</Button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                   <Star size={100} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryParty;
