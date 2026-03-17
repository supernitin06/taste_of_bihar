import React from "react";
import { Users, Coffee, Music, Heart, Star, Calendar } from "lucide-react";
import Button from "../../components/ui/Button";

const KittyParty = () => {
  const partyFeatures = [
    { icon: Coffee, label: "Tea & Snacks", desc: "Traditional Bihari snacks", color: "text-teal-500", bg: "bg-teal-100" },
    { icon: Music, label: "Entertainment", desc: "Games & activities", color: "text-orange-500", bg: "bg-orange-100" },
    { icon: Star, label: "VIP Service", desc: "Dedicated staff", color: "text-emerald-500", bg: "bg-emerald-100" },
    { icon: Heart, label: "Aesthetic Decor", desc: "Perfect for photos", color: "text-pink-500", bg: "bg-pink-100" },
  ];

  return (
    <div className="app page">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex bg-gradient-to-r from-teal-500 to-emerald-600 flex-col md:flex-row justify-between items-start md:items-center p-8 md:p-10 rounded-3xl shadow-xl border border-white/20 transition-all duration-300 backdrop-blur-md">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 animate-pulse" />
                <h1 className="text-4xl font-black tracking-tight">Kitty Parties</h1>
              </div>
              <p className="text-white/80 text-lg font-medium">
                Elegant gatherings for the ladies, filled with laughter and taste.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 bg-white/10 border-white/30 text-white hover:bg-white hover:text-teal-600 font-bold px-8 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
              Schedule Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {partyFeatures.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className={`${f.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{f.label}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Active Kitty Groups</h2>
                  <Button variant="ghost" className="text-teal-600 font-bold hover:bg-teal-50">View All</Button>
               </div>
               <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl flex-shrink-0">
                           <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover rounded-2xl" alt="" />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-800 dark:text-white">The Emerald Sisters</h4>
                           <p className="text-xs text-gray-500 dark:text-gray-400">12 Members • Last Hosted: 5 Mar</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="block font-black text-teal-600">₹12,400</span>
                         <span className="text-[10px] uppercase font-bold text-gray-400">Avg. Spend</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
               <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6 uppercase tracking-tight">Today's Special Menu</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800">
                     <span className="font-bold text-teal-800 dark:text-teal-400">Paneer Tikka Platter</span>
                     <span className="font-black">₹499</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                     <span className="font-bold text-orange-800 dark:text-orange-400">Assorted Mocktails</span>
                     <span className="font-black">₹299</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
               <Calendar className="w-10 h-10 mb-4 opacity-50" />
               <h3 className="text-2xl font-black mb-2 uppercase italic">Next Kitty Slot</h3>
               <p className="text-emerald-100 font-medium mb-6">Sunday, 17th March at 1:00 PM is currently open for booking.</p>
               <Button className="w-full bg-white text-emerald-600 font-black rounded-2xl py-4 hover:shadow-xl transition-all">Quick Book</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KittyParty;
