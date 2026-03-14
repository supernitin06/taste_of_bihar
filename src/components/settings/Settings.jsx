import React from "react";
import { useSearchParams } from "react-router-dom";

import SettingsTabs from "./SettingsTabs";
import General from "./General";
import Profile from "./Profile";
import Menu from "./Menu";
import Orders from "./Orders";
import Payments from "./Payments";
import Delivery from "./Delivery";
import Tax from "./Tax";
import Users from "./Users";
import Notifications from "./Notifications";

// ✅ BANNER IMPORT
import Banners from "./Banners";

import Appearance from "./Appearance"; // ✅ NEW IMPORT

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "general";

  const changeTab = (key) => {
    setSearchParams({ tab: key });
  };

  return (
    <>
      <div className="bg-primary text-primary px-4 py-4 rounded-lg shadow-sm mb-4">
        <h1 className="text-lg font-bold">Settings</h1>
        <p className="text-xs text-primary">
          Manage restaurant and website settings here.
        </p>
      </div>

      <SettingsTabs activeTab={tab} setActiveTab={changeTab} />

      <div className="space-y-8 page">
        {tab === "general" && <General />}
        {tab === "profile" && <Profile />}
        {tab === "menu" && <Menu />}
        {tab === "orders" && <Orders />}
        {tab === "payments" && <Payments />}

        {/* ✅ BANNER TAB */}
        {tab === "banners" && <Banners />}

        {/* ✅ APPEARANCE TAB */}
        {tab === "appearance" && <Appearance />}

        {tab === "delivery" && <Delivery />}
        {tab === "tax" && <Tax />}
        {tab === "users" && <Users />}
        {tab === "notifications" && <Notifications />}
      </div>
    </>
  );
};

export default Settings; // ✅ THIS IS REQUIRED
