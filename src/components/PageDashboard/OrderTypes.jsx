import React, { useState } from "react";
import { Home, Bike, Clock, Package, Ban, Loader2 } from "lucide-react";
import { useGetAnalyticsQuery } from "../../api/services/dashboard";
import Select from "../ui/Select";

const OrderTypes = () => {
  const [filter, setFilter] = useState("month");

  const { data: analyticsData, isLoading, isFetching } = useGetAnalyticsQuery(
    { params: filter },
    { refetchOnMountOrArgChange: true }
  );

  const overview = analyticsData?.data?.ordersOverview || {};
  const total = overview.total || 0;

  const data = [
    { id: 1, type: "Delivered", orders: overview.delivered || 0, icon: Package, color: "var(--color-bihar-green)" },
    { id: 2, type: "Pending", orders: overview.pending || 0, icon: Clock, color: "var(--color-bihar-mustard)" },
    { id: 3, type: "Preparing", orders: overview.preparing || 0, icon: Home, color: "#3b82f6" },
    { id: 4, type: "On Road", orders: overview.outForDelivery || 0, icon: Bike, color: "#8b5cf6" },
    { id: 5, type: "Cancelled", orders: overview.cancelled || 0, icon: Ban, color: "var(--color-bihar-red)" },
  ].map(item => ({
    ...item,
    percentage: total ? Math.round((item.orders / total) * 100) : 0
  }));

  return (
    <div className="premium-card p-8 group overflow-hidden relative">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Real-time status</p>
          <h3 className="text-2xl font-black text-bihar-red dark:text-white font-display">Order Lifecyle</h3>
        </div>
        
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
          ]}
          className="w-full sm:w-40 bg-white/50 border-white/20"
        />
      </div>

      <div className="space-y-8">
        {data.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="group/item">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl group-hover/item:rotate-12 transition-all duration-500 shadow-sm">
                      <IconComponent className="w-5 h-5 text-bihar-red" />
                   </div>
                   <div>
                      <h4 className="font-black text-bihar-maroon dark:text-white uppercase text-xs tracking-wider">{item.type}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.percentage}% of total</p>
                   </div>
                </div>
                <span className="text-xl font-black text-bihar-red dark:text-white font-display">{item.orders}</span>
              </div>

              <div className="relative w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out animate-shimmer"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.id === 5 ? 'var(--color-bihar-red)' : item.id === 1 ? 'var(--color-bihar-green)' : item.id === 2 ? 'var(--color-bihar-mustard)' : item.color,
                    backgroundSize: '200% 100%'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
           <Loader2 className="w-8 h-8 animate-spin text-bihar-red" />
        </div>
      )}
    </div>
  );
};

export default OrderTypes;