
import StatCard from "../ui/StatCard";
import { Users, CheckCircle, Slash } from "lucide-react";

const RestaurantStats = ({ restaurants }) => {
  const total = restaurants.length;


  const active = restaurants.filter(
    (r) => r.isActive === true || r.isActive === "active"
  ).length;

  const inactive = restaurants.filter(
    (r) => r.isActive === false || r.isActive === "suspended"
  ).length;

  const stats = [
    {
      title: "Total Restaurants",
      value: total,
      icon: Users,
      color: "blue",
    },
    {
      title: "Active",
      value: active,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Inactive",
      value: inactive,
      icon: Slash,
      color: "red",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default RestaurantStats;
