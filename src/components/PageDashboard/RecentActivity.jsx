import React from 'react';
import { Package, ShoppingCart, UserPlus, MoreHorizontal } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      icon: Package,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      user: 'Sylvester Quilt',
      role: 'Inventory Manager',
      action: 'updated inventory - 10 units of',
      item: '"Organic Chicken Breast"',
      time: '11:20 AM'
    },
    {
      id: 2,
      icon: ShoppingCart,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      user: 'Maria Kings',
      role: 'Kitchen Admin',
      action: 'marked order #ORD-786 as',
      item: 'completed',
      time: '11:00 AM'
    },
    {
      id: 3,
      icon: UserPlus,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      user: 'William Smith',
      role: 'Receptionist',
      action: 'added new reservation for 4',
      item: 'guests at 7:00 PM',
      time: '10:30 AM'
    }
  ];

  return (
    <div className="bg-primary rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary">Recent Activity</h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="group">
              <div className="flex items-start gap-4">
                <div className={`${activity.iconBg} dark:bg-opacity-20 p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-5 h-5 ${activity.iconColor} dark:text-opacity-90`} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1 gap-1">
                    <div>
                      <h4 className="font-bold text-primary text-sm flex flex-wrap items-center gap-2">
                        {activity.user}
                        <span className="text-xs font-medium text-primary opacity-60 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {activity.role}
                        </span>
                      </h4>
                    </div>
                    <span className="text-xs text-primary opacity-50 whitespace-nowrap">{activity.time}</span>
                  </div>

                  <p className="text-sm text-primary opacity-70">
                    {activity.action}{' '}
                    <span className="font-semibold text-primary">{activity.item}</span>
                  </p>
                </div>
              </div>

              {index < activities.length - 1 && (
                <div className="ml-10 mt-4 mb-4 border-l-2 border-dashed border-gray-200 dark:border-gray-700 h-4"></div>
              )}
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300">
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivity;