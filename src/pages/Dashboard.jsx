import React from "react";
import { ShoppingBag, Users, Star, DollarSign, Clock, CheckCircle } from "lucide-react";
import Select from "../components/ui/Select";
import { HiOutlineChartBar } from "react-icons/hi";
import StatCard from "../components/ui/StatCard";
import RevenueChart from "../components/PageDashboard/RevenueChart";
import TopCategories from "../components/PageDashboard/TopCategories";
import OrdersOverview from "../components/PageDashboard/OrdersOverview";
import OrderTypes from "../components/PageDashboard/OrderTypes";
import CustomerReviews from "../components/PageDashboard/CustomerReviews";
import RecentActivity from "../components/PageDashboard/RecentActivity";
import Footer from "../components/PageDashboard/Footer";
import UpcomingOrders from "../components/PageDashboard/UpcomingOrders";
import ConfirmedOrders from "../components/PageDashboard/ConfirmedOrders";
import { useGetOrdersQuery } from "../api/services/orderApi";
import { useGetdashboardStatsQuery } from "../api/services/dashboard";

const Dashboard = () => {
  const [filterType, setFilterType] = React.useState('Month');

  const getPeriodParams = (type) => {
    switch (type) {
      case 'Week': return 'week';
      case 'Month': return 'month';
      case 'Year': return 'year';
      default: return 'month';
    }
  };



  // Fetch Real Data
  const { data: placedData } = useGetOrdersQuery({ status: "PLACED" }, { pollingInterval: 30000 });
  const { data: acceptedData } = useGetOrdersQuery({ status: "ACCEPTED" }, { pollingInterval: 30000 });
  const { data: readyData } = useGetOrdersQuery({ status: "READY" }, { pollingInterval: 30000 });
  const { data: recentData, isLoading: recentLoading } = useGetOrdersQuery({ page: 1, limit: 5 }, { pollingInterval: 30000 });
  const { data: statsData } = useGetdashboardStatsQuery({ pollingInterval: 30000 });


  const transformOrder = (order) => ({
    id: order.orderId || order.customOrderId || order._id, // Visual ID "ORD-..."
    orderId: order._id, // API ID
    customer: order.customer?.name || "Guest",
    amount: order.price?.grandTotal || 0,
    time: order.createdAt || "Just Now",
    status: order.status,
    items: (order.items || []).map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.finalItemPrice || item.basePrice || 0
    })),
    deliveryBoy: order.deliveryPartner || null // If populated in future
  });

  const upcomingOrders = (placedData?.data || []).map(transformOrder);
  const recentOrders = (recentData?.data || []).map(transformOrder);

  // Combine Accepted and Ready for the "Confirmed/In-Progress" view
  const confirmedOrders = [
    ...(acceptedData?.data || []),
  ].map(transformOrder);

  // Delivery Boys (Mock for now, or fetch if API exists)
  const deliveryBoys = [
    { id: 'DB01', name: 'Ravi Kumar' },
    { id: 'DB02', name: 'Sunil Verma' },
    { id: 'DB03', name: 'Ankit Patel' },
  ];

  return (
    <div className="min-h-screen page">
      {/* Page Container */}
      <div className=" mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
   <div className="flex items-center gap-4">
  {/* Icon */}
  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30">
    <HiOutlineChartBar
      className="text-red-600 dark:text-red-400"
      size={22}
    />
  </div>

  {/* Text */}
  <div className="flex flex-col gap-1">
    <h1 className="text-heading font-bold tracking-tight text-red-500 dark:text-white">
      Dashboard
    </h1>

    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
      Welcome back. Here’s an overview of today’s activity.
    </p>

    <div className="mt-1 h-[2px] w-16 rounded-full bg-red-500/70"></div>
  </div>
</div>

          {/* <div className="mt-4 md:mt-0">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'Week', label: 'Last Week' },
                { value: 'Month', label: 'Last Month' },
                { value: 'Year', label: 'Last Year' }
              ]}
              className="w-40"
            />
          </div> */}

        </div>

        {/* ================= STATS ================= */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Orders"
              value={statsData?.data?.totalOrders || 0}
              icon={ShoppingBag}
              trend="up"
              trendValue="+14%"
              color="orange"
            />
            <StatCard
              title="Total Customers"
              value={statsData?.data?.totalCustomers || 0}
              icon={Users}
              trend="up"
              trendValue="+8.5%"
              color="blue"
            />
            <StatCard
              title="Total Cancelled"
              value={statsData?.data?.totalCancelled || 0}
              icon={Star}
              trend="down"
              trendValue="-2.5%"
              color="yellow"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${statsData?.data?.totalRevenue || 0}`}
              icon={DollarSign}
              trend="up"
              trendValue="+12.5%"
              color="green"
            />
          </div>
        </section>

        {/* ================= UPCOMING & CONFIRMED ORDERS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingOrders
            title="Upcoming Orders"
            orders={upcomingOrders}
            icon={Clock}
            color="orange"
            type="upcoming"
          />
          <ConfirmedOrders
            title="Confirmed Orders"
            orders={confirmedOrders}
            icon={CheckCircle}
            color="blue"
            type="confirmed"
            deliveryBoys={deliveryBoys}
          />
        </section>

        {/* ================= REVENUE + CATEGORIES ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <TopCategories />
        </section>

        {/* ================= ORDERS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrdersOverview />
          </div>
          <OrderTypes />
        </section>

        {/* ================= RECENT ORDERS ================= */}


        {/* ================= REVIEWS & ACTIVITY ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerReviews />
          </div>
          <RecentActivity />
        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Dashboard;
