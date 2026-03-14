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

  // 🔹 Backend response
  const overview = analyticsData?.data?.ordersOverview || {};

  const total = overview.total || 0;

  // 🔹 Convert backend object → UI array
  const data = [
    {
      id: 1,
      type: "Delivered",
      orders: overview.delivered || 0,
      percentage: total ? Math.round((overview.delivered / total) * 100) : 0,
      icon: Package,
      color: "#22c55e",
      bgColor: "bg-green-100",
    },
    {
      id: 2,
      type: "Pending",
      orders: overview.pending || 0,
      percentage: total ? Math.round((overview.pending / total) * 100) : 0,
      icon: Clock,
      color: "#facc15",
      bgColor: "bg-yellow-100",
    },
    {
      id: 3,
      type: "Preparing",
      orders: overview.preparing || 0,
      percentage: total ? Math.round((overview.preparing / total) * 100) : 0,
      icon: Home,
      color: "#3b82f6",
      bgColor: "bg-blue-100",
    },
    {
      id: 4,
      type: "Out for Delivery",
      orders: overview.outForDelivery || 0,
      percentage: total
        ? Math.round((overview.outForDelivery / total) * 100)
        : 0,
      icon: Bike,
      color: "#8b5cf6",
      bgColor: "bg-purple-100",
    },
    {
      id: 5,
      type: "Cancelled",
      orders: overview.cancelled || 0,
      percentage: total ? Math.round((overview.cancelled / total) * 100) : 0,
      icon: Ban,
      color: "#ef4444",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="bg-primary max-h-[400px] overflow-y-auto rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-primary">Order Status</h3>
          {(isLoading || isFetching) && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>

        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
          ]}
          className="w-full sm:w-32"
          selectClassName="py-1 px-3 text-xs"
        />
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const IconComponent = item.icon;

          return (
            <div key={item.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`${item.bgColor} p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: item.color }}
                    />
                  </div>

                  <span className="font-semibold text-primary">
                    {item.type}
                  </span>
                </div>

                <p className="text-sm font-bold text-primary">
                  {item.orders}
                </p>
              </div>

              <div className="relative w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <div className="flex justify-end mt-1">
                <span className="text-xs font-medium text-primary opacity-60">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTypes;