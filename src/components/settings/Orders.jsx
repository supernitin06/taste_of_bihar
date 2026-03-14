import React from "react";
import Button from "../../components/ui/Button";

const Orders = () => {
  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">🧾</div>
        <div>
          <h2 className="highlight text-3xl font-bold">Order Settings</h2>
          <p className="text-sm opacity-70">
            Manage how orders are received and processed
          </p>
        </div>
      </div>

      {/* Setting */}
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="text-xl">🛒</div>
          <div>
            <p className="font-medium">Accept Online Orders</p>
            <p className="text-sm opacity-60">
              Allow customers to place orders online
            </p>
          </div>
        </div>
        <Button variant="active" size="sm">
          Yes
        </Button>
      </div>

      <div className="opacity-20 border-t" />

      {/* Setting */}
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="text-xl">⚡</div>
          <div>
            <p className="font-medium">Auto Accept Orders</p>
            <p className="text-sm opacity-60">
              Automatically confirm incoming orders
            </p>
          </div>
        </div>
        <Button variant="inactive" size="sm">
          No
        </Button>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button variant="primary">
          💾 Save Order Settings
        </Button>
      </div>
    </div>
  );
};

export default Orders;
