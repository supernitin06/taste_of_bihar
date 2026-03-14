import React, { useState } from "react";

const SettingsTabs = ({ activeTab, setActiveTab }) => {
  const [search, setSearch] = useState("");

  // All settings tabs
  const tabs = [
    { key: "general", label: "General" },
    { key: "profile", label: "Profile" },
    // { key: "menu", label: "Menu" },
    // { key: "orders", label: "Orders" },
    { key: "payments", label: "Payments" },

    // ✅ NEW BANNER TAB
    { key: "banners", label: "Banners" },
    { key: "appearance", label: "Appearance" }, // ✅ NEW APPEARANCE TAB

    // { key: "delivery", label: "Delivery" },
    { key: "tax", label: "Tax" },
    // { key: "users", label: "Users" },
    { key: "notifications", label: "Notifications" },
  ];

  // Filter tabs based on search input
  const filteredTabs = tabs.filter((tab) =>
    tab.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search settings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full mb-4"
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {filteredTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn ${activeTab === tab.key ? "btn-primary" : "btn-ghost"
              }`}
          >
            {tab.label}
          </button>
        ))}

        {/* No tabs found */}
        {filteredTabs.length === 0 && (
          <p className="text-muted text-sm mt-2">No settings found</p>
        )}
      </div>
    </div>
  );
};

export default SettingsTabs;
