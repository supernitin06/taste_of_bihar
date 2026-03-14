import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import Select from '../ui/Select';
import { useTheme } from '../../context/ThemeContext';
import { useGetCategorySalesQuery } from '../../api/services/dashboardApi';

const TopCategories = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const periodMapping = {
    "This Week": "weekly",
    "This Month": "monthly",
    "This Year": "yearly"
  };

  const { data: apiData, isLoading, isError } = useGetCategorySalesQuery(
    periodMapping[selectedPeriod] || "monthly"
  );

  const COLORS = ['#2563eb', '#eb2528', '#fbbf24', '#10b981', '#8b5cf6', '#ec4899'];

  const chartData = useMemo(() => {
    console.log("Category Sales Data:", apiData);
    if (!apiData?.data) return [];
    // Assuming API returns array of objects with { category: "Name", sales: 100 } or similar
    // Adjust 'category' and 'sales' keys based on your actual API response
    return apiData.data.map((item, index) => ({
      name: item.category || item.name || item._id || "Unknown",
      value: item.totalSales || item.sales || item.count || item.value || 0,
      color: COLORS[index % COLORS.length]
    }));
  }, [apiData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary p-3 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-semibold text-primary">{payload[0].name}</p>
          <p className="text-sm text-primary opacity-70">Sales: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 group cursor-pointer">
            <div
              className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm font-medium text-primary opacity-80 group-hover:text-primary flex gap-1">
              {entry.payload?.name || entry.value} <span className="text-primary opacity-60"></span>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-primary rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-primary">Top Categories</h3>
        <div className="w-full sm:w-auto">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            options={["This Week", "This Month", "This Year"]}
            className="w-full sm:w-32"
          />
        </div>
      </div>

      <div className="h-64">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-primary opacity-60">
            {isError ? "Failed to load data" : "No category data"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke={theme === 'dark' ? '#1f2937' : '#fff'}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopCategories;