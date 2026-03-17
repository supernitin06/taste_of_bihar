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
    <div className="premium-card p-8 group">
      <div className="flex items-center justify-between mb-8 overflow-hidden relative">
        <h3 className="text-2xl font-black text-bihar-red dark:text-white font-display">Recent Activity</h3>
        <button className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-bihar-red/10 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="group/item relative">
              <div className="flex items-start gap-5">
                <div className={`${activity.iconBg} dark:bg-opacity-20 p-4 rounded-2xl shadow-sm transform group-hover/item:rotate-12 transition-transform duration-500`}>
                  <IconComponent className={`w-6 h-6 ${activity.iconColor}`} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-bihar-maroon dark:text-white text-base">
                        {activity.user}
                      </h4>
                      <span className="text-[10px] font-black text-bihar-red bg-bihar-red/5 px-2 py-1 rounded-lg uppercase tracking-wider">
                        {activity.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activity.time}</span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-hindi">
                    {activity.action}{' '}
                    <span className="text-bihar-maroon dark:text-bihar-mustard font-bold">{activity.item}</span>
                  </p>
                </div>
              </div>

              {index < activities.length - 1 && (
                <div className="ml-[27px] mt-4 mb-4 border-l-2 border-dashed border-gray-100 dark:border-white/5 h-6"></div>
              )}
            </div>
          );
        })}
      </div>

      <button className="w-full mt-10 py-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 text-xs font-black text-gray-400 uppercase tracking-widest hover:border-bihar-red hover:text-bihar-red hover:bg-bihar-red/5 transition-all duration-500">
        View Full System Logs
      </button>
    </div>
  );
};

export default RecentActivity;