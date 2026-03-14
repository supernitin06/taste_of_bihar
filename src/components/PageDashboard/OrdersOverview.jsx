import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { useTheme } from '../../context/ThemeContext';
import { useGetOrderChartQuery } from '../../api/services/dashboardApi';

const OrdersOverview = () => {
  const [selectedView, setSelectedView] = useState('This Month');
  const [activeTab, setActiveTab] = useState('Monthly');
  const { theme } = useTheme();

  // Fetch data from API based on activeTab (weekly/monthly)
  const { data: apiData, isLoading, isError, error } = useGetOrderChartQuery(activeTab.toLowerCase());

  const chartData = (apiData?.data || []).map(item => ({
    name: item.period, // Map 'period' to 'name' for XAxis
    delivered: item.delivered,
    pending: item.pending,
    cancelled: item.cancelled,
    total: item.total
  }));

  useEffect(() => {
    if (isError) {
      console.error("OrdersOverview API Error:", error);
    }
  }, [isError, error]);

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const tooltipCursorColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(37, 99, 235, 0.05)';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-xs text-green-600 dark:text-green-400 flex justify-between w-32">
              <span>Delivered:</span> <span className="font-bold">{payload[0]?.payload.delivered || 0}</span>
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 flex justify-between w-32">
              <span>Pending:</span> <span className="font-bold">{payload[0]?.payload.pending || 0}</span>
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 flex justify-between w-32">
              <span>Cancelled:</span> <span className="font-bold">{payload[0]?.payload.cancelled || 0}</span>
            </p>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
            <p className="text-xs text-gray-600 dark:text-gray-400 flex justify-between w-32">
              <span>Total:</span> <span className="font-bold">{payload[0]?.payload.total || 0}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-primary rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-primary">Orders Overview</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={activeTab === 'Weekly' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('Weekly')}
            className="text-sm"
          >
            Weekly
          </Button>
          <Button
            variant={activeTab === 'Monthly' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('Monthly')}
            className="text-sm"
          >
            Monthly
          </Button>
          <Select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            options={[
              { value: 'This Week', label: 'This Week' },
              { value: 'Last Week', label: 'Last Week' },
              { value: 'This Month', label: 'This Month' },
            ]}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="h-72 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                label={{ value: 'Period', position: 'insideBottom', offset: -10, fill: axisColor, fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
                label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: 10, fill: axisColor, fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: tooltipCursorColor }} />
              <Bar dataKey="delivered" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={60} />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" maxBarSize={60} />
              <Bar dataKey="cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OrdersOverview;