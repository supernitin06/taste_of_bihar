import React from "react";
import { Cake, Gift, Music, Sparkles, Users, Calendar } from "lucide-react";
import Button from "../../components/ui/Button";

const BirthdayParty = () => {
  const partyFeatures = [
    { icon: Cake, label: "Custom Cake", desc: "Premium tiered cakes", color: "text-pink-500", bg: "bg-pink-100" },
    { icon: Gift, label: "Decorations", desc: "Balloons & banners", color: "text-blue-500", bg: "bg-blue-100" },
    { icon: Music, label: "Live Music", desc: "DJ or acoustic sets", color: "text-purple-500", bg: "bg-purple-100" },
    { icon: Sparkles, label: "Premium Menu", desc: "Special birthday buffet", color: "text-amber-500", bg: "bg-amber-100" },
  ];

  return (
    <div className="app page">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex bg-gradient-to-r from-pink-500 to-rose-500 flex-col md:flex-row justify-between items-start md:items-center p-8 md:p-10 rounded-3xl shadow-xl border border-white/20 transition-all duration-300 backdrop-blur-md">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <Cake className="w-8 h-8 animate-bounce" />
                <h1 className="text-4xl font-black tracking-tight">Birthday Parties</h1>
              </div>
              <p className="text-white/80 text-lg font-medium">
                Celebrate life's milestones with a dash of Bihar's hospitality.
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 bg-white/10 border-white/30 text-white hover:bg-white hover:text-rose-500 font-bold px-8 py-3 rounded-2xl shadow-lg backdrop-blur-sm">
              Book a Party
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {partyFeatures.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-default">
              <div className={`${f.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{f.label}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="text-rose-500" /> Upcoming Bookings
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-500/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-bold text-rose-500 shadow-sm border border-rose-100 dark:border-rose-900/30">
                        {15 + i} MAR
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-rose-500 transition-colors">Aarav's 5th Birthday</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">25 Guests • 7:00 PM</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Users className="text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2 italic uppercase tracking-wider">Party Analytics</h3>
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1 opacity-80">
                      <span>Monthly Goal</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <span className="block text-2xl font-black">24</span>
                      <span className="text-[10px] uppercase font-bold opacity-60">Total Parties</span>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <span className="block text-2xl font-black">₹4.2L</span>
                      <span className="text-[10px] uppercase font-bold opacity-60">Revenue</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-10px] left-[-10px] w-20 h-20 bg-accent/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayParty;
