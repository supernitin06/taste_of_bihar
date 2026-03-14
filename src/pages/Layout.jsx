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
    <div className="app flex h-screen ">
      {/* LEFT SIDEBAR */}
      <div className="lg:sticky lg:top-0">
        <Sidebar />
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* TOP NAVBAR */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 overflow-auto">
          {navigation.state === "loading" ? <CookingLoader /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};


export default Layout;
