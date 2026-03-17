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
        <header className="premium-card p-10 group overflow-hidden relative">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23d32f2f' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '40px'
            }}
          />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
              {/* Dynamic Icon Container */}
              <div className="relative group/icon">
                 <div className="absolute inset-0 bg-bihar-red blur-2xl opacity-20 group-hover/icon:opacity-40 transition-opacity duration-500 rounded-full" />
                 <div className="relative w-24 h-24 rounded-[2rem] vibrant-gradient flex items-center justify-center shadow-bihari-lg transform group-hover/icon:rotate-[360deg] transition-transform duration-1000 ease-in-out">
                    <HiOutlineChartBar className="text-heading" size={40} />
                 </div>
              </div>

              {/* Text Strategy */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="h-0.5 w-12 bg-bihar-red/30 rounded-full" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-bihar-red/60 dark:text-gray-400">Station Overview</p>
                </div>
                <h1 className="text-5xl font-black text-heading font-display leading-none">
                  Dashboard<span className="text-bihar-mustard">.</span>
                </h1>
                <p className="text-sm font-bold text-bihar-maroon/60 dark:text-gray-400 uppercase tracking-widest">
                  Fulfillment Status & Logistics <span className="mx-3 opacity-20">|</span> Real-time Hub
                </p>
              </div>
            </div>

            {/* Dynamic Filter / Actions */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-3 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-inner">
               {['Orders', 'Sales', 'Guests'].map(tag => (
                  <button key={tag} className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-bihar-red hover:bg-white dark:hover:bg-white/5 transition-all duration-300">
                     {tag}
                  </button>
               ))}
               <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />
               <button className="vibrant-gradient px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-bihari-sm hover:scale-105 active:scale-95 transition-all">
                  Generate Report
               </button>
            </div>
          </div>

          {/* Abstract Glow Accents */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-bihar-red/5 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-bihar-mustard/5 rounded-full blur-[120px]" />
        </header>

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
