import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import Select from '../ui/Select';
import { useTheme } from '../../context/ThemeContext';
import { useGetCategorySalesQuery } from '../../api/services/dashboardApi';

const COLORS = ['var(--color-bihar-red)', 'var(--color-bihar-maroon)', 'var(--color-bihar-mustard)', '#3b82f6', '#10b981', '#8b5cf6'];

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

  const chartData = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data.map((item, index) => ({
      name: item.category || item.name || item._id || "Unknown",
      value: item.totalSales || item.sales || item.count || item.value || 0,
      color: COLORS[index % COLORS.length]
    }));
  }, [apiData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-3xl shadow-2xl border border-white/20 animate-scaleIn">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{payload[0].name}</p>
          <p className="text-sm font-black text-bihar-red dark:text-white">Sales: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-4 mt-8 pb-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 group cursor-pointer">
            <div
              className="w-3 h-3 rounded-full transition-all group-hover:scale-150 shadow-sm"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-bihar-red transition-colors">
              {entry.payload?.name || entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="premium-card p-8 group relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Category Split</p>
           <h3 className="text-2xl font-black text-bihar-red dark:text-white font-display">Popular Flavors</h3>
        </div>
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          options={["This Week", "This Month", "This Year"]}
          className="w-full sm:w-40 bg-white/50 border-white/20"
        />
      </div>

      <div className="h-72">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-bihar-red" />
          </div>
        ) : isError || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-400 font-bold uppercase tracking-widest">
            {isError ? "Sync Failure" : "No Flavor Data"}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer transform hover:scale-105 duration-300"
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