import React, { useMemo } from 'react';
import { List, Check, Star } from 'lucide-react';
import StatCard from '../ui/StatCard';

const MenuStats = ({ menus = [] }) => {
  const stats = useMemo(() => {
    let totalItems = 0;
    let availableItems = 0;
    let bestsellers = 0;

    menus.forEach(menu => {
      menu.categories.forEach(cat => {
        cat.subCategories.forEach(sub => {
          totalItems += sub.items.length;
          availableItems += sub.items.filter(item => item.available).length;
          bestsellers += sub.items.filter(item => item.bestseller).length;
        });
      });
    });

    return { totalItems, availableItems, bestsellers };
  }, [menus]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
      <StatCard
        title="Total Items"
        value={stats.totalItems}
        icon={List}
        color="blue"
      />
      <StatCard
        title="Available Now"
        value={stats.availableItems}
        icon={Check}
        color="green"
      />
      <StatCard
        title="Bestsellers"
        value={stats.bestsellers}
        icon={Star}
        color="yellow"
      />
    </div>
  );
};

export default MenuStats;