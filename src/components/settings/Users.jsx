import React from "react";
import Button from "../../components/ui/Button";

const Users = () => {
  return (
    <div className="card space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">👥</div>
        <div>
          <h2 className="highlight text-3xl font-bold">Admin Users</h2>
          <p className="text-sm opacity-70">
            Manage administrators and access control
          </p>
        </div>
      </div>

      {/* User Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🛡️</div>
          <div>
            <p className="font-medium">Admin</p>
            <p className="text-sm opacity-60">admin@company.com</p>
          </div>
        </div>
        <Button variant="danger" size="sm">
          Remove
        </Button>
      </div>

      <div className="opacity-20 border-t" />

      {/* Fake User Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-2xl">👤</div>
          <div>
            <p className="font-medium">Manager</p>
            <p className="text-sm opacity-60">manager@company.com</p>
          </div>
        </div>
        <Button variant="danger" size="sm">
          Remove
        </Button>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button variant="primary">
          ➕ Add New User
        </Button>
      </div>
    </div>
  );
};

export default Users;
