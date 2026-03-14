import React from "react";
import Button from "../../components/ui/Button";

const Menu = () => {
  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">🍽️</div>
        <div>
          <h2 className="highlight text-3xl font-bold">Menu Settings</h2>
          <p className="text-sm opacity-70">
            Customize how your menu appears to customers
          </p>
        </div>
      </div>

      {/* Setting Card */}
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="text-xl">👁️</div>
          <div>
            <p className="font-medium">Show Menu on Website</p>
            <p className="text-sm opacity-60">
              Make your full menu visible on the live site
            </p>
          </div>
        </div>
        <Button variant="active" size="sm">
          Enabled
        </Button>
      </div>

      <div className="opacity-20 border-t" />

      {/* Setting Card */}
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="text-xl">📦</div>
          <div>
            <p className="font-medium">Allow Out of Stock Items</p>
            <p className="text-sm opacity-60">
              Keep items visible even when unavailable
            </p>
          </div>
        </div>
        <Button variant="inactive" size="sm">
          Disabled
        </Button>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button variant="primary">
          💾 Save Menu Settings
        </Button>
      </div>
    </div>
  );
};

export default Menu;
