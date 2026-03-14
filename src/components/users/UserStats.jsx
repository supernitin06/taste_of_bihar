import React from "react";
import StatCard from "../ui/StatCard";
import { Users, CheckCircle, Star, CreditCard } from "lucide-react";

const UserStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Customers",
      value: stats.total,
      icon: Users,
      color: "blue", // mapped from previous cyan/blue
      progress: 75, // Simulated progress
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Active Users",
      value: stats.active,
      icon: CheckCircle,
      color: "green", // mapped from emerald/teal
      progress: 60,
      trend: "up",
      trendValue: "+5%",
    },
    {
      title: "Premium Members",
      value: stats.premium,
      icon: Star,
      color: "yellow", // mapped from yellow/amber
      progress: 45,
      trend: "up",
      trendValue: "+18%",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: CreditCard,
      color: "purple", // mapped from purple/pink
      progress: 88,
      trend: "up",
      trendValue: "+23%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          progress={stat.progress} // Using progress bar as per original design
          trend={stat.trend}
          trendValue={stat.trendValue}
        />
      ))}
    </div>
  );
};

export default UserStats;
