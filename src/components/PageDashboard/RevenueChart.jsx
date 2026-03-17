import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Select from '../../components/ui/Select';
import { useGetRevenueChartQuery } from '../../api/services/dashboardApi';
import { FaIndianRupeeSign } from "react-icons/fa6";

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last Month');
  const { theme } = useTheme();

  // Map dropdown labels to API period parameters
  const periodMapping = {
    "Last 6 Months": "6_months",
    "Last 3 Months": "3_months",
    "Last Month": "monthly",
    "This Year": "yearly"
  };

  // Fetch data from API
  const { data: apiData, isLoading, isError } = useGetRevenueChartQuery(
    periodMapping[selectedPeriod] || "monthly"
  );

  // Transform API data: map 'period' to 'name'
  const chartData = (apiData?.data || []).map(item => ({
    name: item.period,
    revenue: item.revenue,
    orders: item.orders
  }));

  // Calculate total revenue from data if not provided by API root
  const totalRevenue = apiData?.totalRevenue ?? chartData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
  const revenueGrowth = apiData?.growth || 0;

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-3xl shadow-2xl border border-white/20 animate-scaleIn">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-2">
            <p className="text-sm font-black text-bihar-maroon dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
              Revenue: <span className="text-blue-600 text-lg ml-auto">₹{payload[0]?.value?.toLocaleString() || 0}</span>
            </p>
            {payload[1] && (
              <p className="text-sm font-black text-bihar-maroon dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                Orders: <span className="text-red-500 ml-auto">{payload[1]?.value}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="premium-card p-8 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <div className="w-full sm:w-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Revenue Analytics</p>
          <div className="flex items-center gap-4">
             <h3 className="text-4xl font-black text-bihar-red dark:text-white font-display">
                ₹{totalRevenue.toLocaleString()}
             </h3>
             <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${revenueGrowth >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth)}%
             </div>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={["Last 6 Months", "Last 3 Months", "Last Month", "This Year"]}
            className="w-full sm:w-48 bg-white/50 border-white/20"
          />
        </div>
      </div>

      <div className="h-72">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-bihar-red" />
          </div>
        ) : isError ? (
          <div className="h-full flex items-center justify-center text-red-500 font-bold">
            Data loading failed
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="5 5" stroke={gridColor} vertical={false} strokeOpacity={0.2} />
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: axisColor, fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val/1000}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                hide={true}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: axisColor, strokeWidth: 1, strokeDasharray: '5 5' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={4}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }}
                animationDuration={2000}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#ef4444"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-10 mt-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-1.5 rounded-full bg-[#2563eb]"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Revenue</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-1.5 rounded-full bg-[#ef4444] opacity-50"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Volume</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;