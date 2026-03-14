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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Revenue: <span className="font-bold text-blue-600 dark:text-blue-400">
                <FaIndianRupeeSign className="inline w-3 h-3 mr-0.5" />
                {payload[0]?.value?.toLocaleString() || 0}
              </span>
            </p>
            {payload[1] && (
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Orders: <span className="font-bold text-red-500 dark:text-red-400">{payload[1]?.value}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-primary rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <h3 className="text-xl font-bold text-primary mb-1">Total Revenue</h3>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1 text-3xl font-bold text-primary">
              <FaIndianRupeeSign className="text-2xl" />
              {totalRevenue.toLocaleString()}
            </p>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${revenueGrowth >= 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
              <TrendingUp className={`w-3.5 h-3.5 ${revenueGrowth < 0 ? 'rotate-180' : ''}`} />
              {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}%
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={["Last 6 Months", "Last 3 Months", "Last Month", "This Year"]}
            className="w-full sm:w-40"
          />
        </div>
      </div>

      <div className="h-64">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="h-full flex items-center justify-center text-red-500">
            Failed to load chart data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                label={{ value: 'Period', position: 'insideBottom', offset: -10, fill: axisColor, fontSize: 12 }}
              />
              {/* Left Y-Axis for Revenue */}
              <YAxis
                yAxisId="left"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: 0, fill: '#2563eb', fontSize: 12 }}
              />
              {/* Right Y-Axis for Orders */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                label={{ value: 'Orders', angle: 90, position: 'insideRight', offset: 0, fill: '#eb2528', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#eb2528"
                strokeWidth={3}
                dot={{ fill: '#eb2528', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2563eb]"></div>
          <span className="text-sm font-medium text-primary opacity-70">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#eb2528]"></div>
          <span className="text-sm font-medium text-primary opacity-70">Orders</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;