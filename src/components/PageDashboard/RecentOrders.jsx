import React, { useState } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';

const RecentOrders = ({ data = [], loading = false }) => {
  // const [filter, setFilter] = useState('This Week'); // Controlled by parent Dashboard
  if (loading) {
    return (
      <div className="bg-primary p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex items-center justify-center">
        <p>Loading recent orders...</p>
      </div>
    )
  }

  const orders = data; // Use passed data directly

  return (
    <div className="bg-primary p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-0">
        <h3 className="text-xl font-bold text-primary">Recent Orders</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search or filter..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all w-64"
            />
          </div>
          {/* Filter moved to Dashboard Header */}
          <Button variant="primary" className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-[#2563eb] hover:bg-opacity-90 transition-all">
            See All Orders
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photo</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Menu</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group"
              >
                <td className="py-4 px-4">
                  <span className="font-semibold text-primary text-sm">{order.id}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 dark:from-orange-900/40 to-orange-50 dark:to-orange-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🍽️
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    {/* Display first item or summary since dashboard typically shows 1 line per order */}
                    <p className="font-semibold text-primary text-sm">{order.items?.[0]?.name || 'Unknown Item'}</p>
                    {order.items?.length > 1 && <p className="text-xs text-primary opacity-60">+{order.items.length - 1} more</p>}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-primary opacity-80">{order.items?.[0]?.quantity || 1}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-bold text-primary">{order.amount}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-primary opacity-80">{order.customer || 'Guest'}</span>
                </td>
                <td className="py-4 px-4 ">
                  <span className={`px-3 py-1.5 rounded-full text-xs w-20 text-nowrap font-semibold inline-block 
                    ${order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'bg-green-500' :
                      order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-orange-500'} text-white`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors bg-transparent shadow-none w-auto">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;