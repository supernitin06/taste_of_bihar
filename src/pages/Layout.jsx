import React, { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CookingLoader from "./Loader";

const Layout = () => {
  const navigation = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="app flex h-screen bg-orange-50/30 dark:bg-black/95 transition-colors duration-500 overflow-hidden relative">
      {/* Dynamic Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bihar-red/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-bihar-mustard/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full cultural-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
      </div>

      {/* LEFT SIDEBAR */}
      <div className="lg:sticky lg:top-0 h-full z-20">
        <Sidebar />
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* TOP NAVBAR */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto scroll-smooth animate-fade-in custom-scrollbar">
          {navigation.state === "loading" ? (
            <div className="h-full flex items-center justify-center">
              <CookingLoader />
            </div>
          ) : (
            <div className="max-w-8xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


export default Layout;
