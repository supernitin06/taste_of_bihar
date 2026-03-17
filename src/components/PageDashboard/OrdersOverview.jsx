import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { useTheme } from '../../context/ThemeContext';
import { useGetOrderChartQuery } from '../../api/services/dashboardApi';

const OrdersOverview = () => {
  const [activeTab, setActiveTab] = useState('Monthly');
  const { theme } = useTheme();

  const { data: apiData, isLoading, isError } = useGetOrderChartQuery(activeTab.toLowerCase());

  const chartData = (apiData?.data || []).map(item => ({
    name: item.period,
    delivered: item.delivered,
    pending: item.pending,
    cancelled: item.cancelled,
    total: item.total
  }));

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-5 rounded-[2rem] shadow-2xl border border-white/20 animate-scaleIn">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">{data.name}</p>
          <div className="space-y-3">
             {[
               { label: 'Delivered', val: data.delivered, color: 'bg-green-500', text: 'text-green-500' },
               { label: 'Pending', val: data.pending, color: 'bg-orange-500', text: 'text-orange-500' },
               { label: 'Cancelled', val: data.cancelled, color: 'bg-red-500', text: 'text-red-500' },
             ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-6">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}></div>
                      <span className="text-xs font-black text-bihar-maroon dark:text-white uppercase tracking-wider">{item.label}</span>
                   </div>
                   <span className={`text-sm font-black ${item.text}`}>{item.val}</span>
                </div>
             ))}
             <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase">Total</span>
                <span className="text-sm font-black text-bihar-red dark:text-white">{data.total}</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="premium-card p-8 group overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Fulfillment Metrics</p>
           <h3 className="text-2xl font-black text-bihar-red dark:text-white font-display text-vibrant">Orders Flow</h3>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl">
          {['Weekly', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab ? 'vibrant-gradient text-white shadow-lg scale-105' : 'text-gray-400 hover:text-bihar-red'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-bihar-red" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="5 5" stroke={gridColor} vertical={false} strokeOpacity={0.2} />
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(211, 47, 47, 0.05)' }} />
              <Bar dataKey="delivered" stackId="a" fill="var(--color-bihar-green)" radius={[0, 0, 8, 8]} barSize={40} />
              <Bar dataKey="pending" stackId="a" fill="var(--color-bihar-mustard)" barSize={40} />
              <Bar dataKey="cancelled" stackId="a" fill="var(--color-bihar-red)" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-10 mt-10">
         {[
            { label: 'Delivered', color: 'bg-bihar-green' },
            { label: 'Pending', color: 'bg-bihar-mustard' },
            { label: 'Cancelled', color: 'bg-bihar-red' }
         ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
               <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg shadow-black/5`}></div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
         ))}
      </div>
    </div>
  );
};

export default OrdersOverview;