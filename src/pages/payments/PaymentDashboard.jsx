import React, { useState } from 'react';
import { useGetPaymentsstatsQuery, useGetRefundPaymentsQuery, useGetRecentPaymentsQuery } from '../../api/services/payments';
import { DollarSign, CreditCard, Activity, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PaymentDashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useGetPaymentsstatsQuery();
  const { data: recentPaymentsData, isLoading: recentPaymentsLoading } = useGetRecentPaymentsQuery();

  const summary = statsData?.data?.summary || {};
  const methodBreakdown = statsData?.data?.methodBreakdown || [];

  // Create derived stats from API data
  const stats = [
    {
      title: 'Total Collected',
      value: `₹${summary.totalCollected?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      trend: 'up',
      trendValue: 'Collected',
      color: 'green'
    },
    {
      title: 'Pending Amount',
      value: `₹${summary.totalPending?.toFixed(2) || '0.00'}`,
      icon: Clock,
      trend: 'down',
      trendValue: 'Pending',
      color: 'orange'
    },
    {
      title: 'Total Failed',
      value: summary.totalFailed || '0',
      icon: AlertCircle,
      trend: 'down',
      trendValue: 'Failed',
      color: 'red'
    },
    {
      title: 'Transactions',
      value: methodBreakdown.reduce((acc, curr) => acc + curr.count, 0).toString(),
      icon: Activity,
      trend: 'up',
      trendValue: 'Total',
      color: 'blue'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: {payload[0].value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount: ₹{payload[0].payload.amount?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading payment analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page space-y-8">
      {/* Header */}
      <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">
            Payment Management
          </h1>
          <p className="text-primary opacity-70 mt-2 text-lg font-medium">
            Track and manage all restaurant payments
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={stat.color}
          />
        ))}
      </div>

      {/* Transaction Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Transactions Card */}
        <div className="card shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                View All →
              </button>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {recentPaymentsLoading ? (
                <div className="text-center text-gray-400 py-8">Loading transactions...</div>
              ) : recentPaymentsData?.data?.length > 0 ? (
                recentPaymentsData.data.slice(0, 5).map(transaction => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group/item border border-gray-100 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {transaction.status === 'COMPLETED' ? <Activity className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.userId?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.method} • {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{transaction.amount?.payable?.toFixed(2) || '0.00'}
                      </p>
                      <p className={`text-xs font-medium ${transaction.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' :
                        transaction.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No recent transactions found</div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="card shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer">
          <div className="p-6 h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Methods</h2>

            {methodBreakdown.length > 0 ? (
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="method"
                    >
                      {methodBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                No payment method data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;