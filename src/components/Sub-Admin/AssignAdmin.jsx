// components/Sub-Admin/AssignAdmin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/GlassCard";
import Input from "../ui/InputField";
import { useGetSubAdminsQuery } from "../../api/services/adminApi";

const AssignAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modifiedPermissions, setModifiedPermissions] = useState([]);

  const { data: subAdminsResponse, isLoading, isError } = useGetSubAdminsQuery();

  // Safely map API data
  const subAdmins = (subAdminsResponse?.data || []).map((admin) => ({
    id: admin._id,
    name: admin.name || "No Name",
    email: admin.email || "No Email",
    role: admin.role || "Sub-Admin",
    status: admin.isActive ? "active" : "inactive",
    permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
  }));

  // Filter admins based on search
  const filteredAdmins = subAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Permission groups
  const permissionGroups = [
    {
      category: "Orders Management",
      icon: ShoppingBag,
      color: "blue",
      permissions: [
        { id: "view_orders", label: "View Orders", description: "Can view all orders" },
        { id: "manage_orders", label: "Manage Orders", description: "Can edit and cancel orders" },
        { id: "assign_delivery", label: "Assign Delivery", description: "Can assign delivery partners" },
        { id: "mark_delivered", label: "Mark Delivered", description: "Can mark orders as delivered" },
      ],
    },
    {
      category: "User Management",
      icon: Users,
      color: "green",
      permissions: [
        { id: "view_users", label: "View Users", description: "Can view user details" },
        { id: "manage_users", label: "Manage Users", description: "Can edit and block users" },
        { id: "export_users", label: "Export Users", description: "Can export user data" },
      ],
    },
    {
      category: "Restaurant Management",
      icon: UtensilsCrossed,
      color: "orange",
      permissions: [
        { id: "view_restaurants", label: "View Restaurants", description: "Can view restaurant details" },
        { id: "manage_restaurants", label: "Manage Restaurants", description: "Can approve/suspend restaurants" },
        { id: "edit_commission", label: "Edit Commission", description: "Can modify commission rates" },
      ],
    },
    {
      category: "Financial Operations",
      icon: RefreshCw,
      color: "purple",
      permissions: [
        { id: "view_payments", label: "View Payments", description: "Can view payment details" },
        { id: "handle_refunds", label: "Handle Refunds", description: "Can process refund requests" },
        { id: "view_reports", label: "View Reports", description: "Can access financial reports" },
      ],
    },
  ];

  // Select admin
  const handleSelectAdmin = (admin) => {
    setSelectedAdmin({
      ...admin,
      currentPermissions: Array.isArray(admin.permissions) ? admin.permissions : [],
    });
    setModifiedPermissions(Array.isArray(admin.permissions) ? admin.permissions : []);
  };

  // Toggle single permission
  const togglePermission = (permissionId) => {
    setModifiedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Toggle all permissions in a category
  const toggleCategoryPermissions = (category) => {
    const categoryPerms =
      permissionGroups.find((g) => g.category === category)?.permissions.map((p) => p.id) || [];

    const allSelected = categoryPerms.every((id) => modifiedPermissions.includes(id));

    if (allSelected) {
      setModifiedPermissions((prev) => prev.filter((id) => !categoryPerms.includes(id)));
    } else {
      setModifiedPermissions((prev) => [...new Set([...prev, ...categoryPerms])]);
    }
  };

  const hasChanges = () => {
    if (!selectedAdmin) return false;
    const current = selectedAdmin.currentPermissions.sort().join(",");
    const modified = modifiedPermissions.sort().join(",");
    return current !== modified;
  };

  const handleSave = () => {
    if (!selectedAdmin || !hasChanges()) return;

    // TODO: call API to save modifiedPermissions
    console.log("Updated permissions for", selectedAdmin.name, ":", modifiedPermissions);
    alert("Permissions updated successfully!");
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) return <p>Loading sub-admins...</p>;
  if (isError) return <p>Error loading sub-admins.</p>;

  return (
    <div className="page">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <div>
              <h1 className="highlight text-4xl font-extrabold tracking-tight">Assign Permissions</h1>
              <p className="text-primary opacity-70 mt-2 text-lg font-medium">
                Modify permissions for existing sub-administrators
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Select Sub-Admin</h3>
              <Input
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="mb-4"
              />
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    onClick={() => handleSelectAdmin(admin)}
                    className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedAdmin?.id === admin.id
                        ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500"
                        : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {admin.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{admin.name}</p>
                        <p className="text-sm text-muted truncate">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-semibold">
                        {admin.role}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${admin.status === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className="text-xs text-muted">{admin.status}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted">{admin.permissions.length} permissions assigned</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedAdmin ? (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Select a Sub-Admin</h3>
                <p className="text-muted">Choose a sub-admin from the list to view and modify their permissions</p>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {selectedAdmin.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedAdmin.name}</h2>
                        <p className="text-muted">{selectedAdmin.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold">
                            {selectedAdmin.role}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${selectedAdmin.status === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                            <span className="text-sm text-muted capitalize">{selectedAdmin.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {hasChanges() && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg">
                        <RefreshCw size={16} />
                        <span className="text-sm font-semibold">Unsaved Changes</span>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-6">
                    {permissionGroups.map((group) => {
                      const Icon = group.icon;
                      const allSelected = group.permissions.every((p) => modifiedPermissions.includes(p.id));
                      const groupCount = group.permissions.filter((p) => modifiedPermissions.includes(p.id)).length;

                      return (
                        <div key={group.category} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg ${getColorClasses(group.color)} flex items-center justify-center`}>
                                <Icon size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-100">{group.category}</h4>
                                <p className="text-xs text-muted">{groupCount} of {group.permissions.length} selected</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleCategoryPermissions(group.category)}
                              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${allSelected
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {allSelected ? "Deselect All" : "Select All"}
                            </button>
                          </div>

                          <div className="space-y-2">
                            {group.permissions.map((permission) => {
                              const isSelected = modifiedPermissions.includes(permission.id);
                              const wasOriginal = selectedAdmin.currentPermissions.includes(permission.id);
                              const isChanged = isSelected !== wasOriginal;

                              return (
                                <label
                                  key={permission.id}
                                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${isSelected
                                    ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500"
                                    : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                  } ${isChanged ? "ring-2 ring-yellow-500" : ""}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => togglePermission(permission.id)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-gray-800 dark:text-gray-100">{permission.label}</p>
                                      {isChanged && (
                                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-bold">
                                          Modified
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted">{permission.description}</p>
                                  </div>
                                  {isSelected ? (
                                    <CheckCircle size={20} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                  ) : (
                                    <XCircle size={20} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={!hasChanges()}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Save size={18} /> Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setModifiedPermissions(selectedAdmin.currentPermissions)}
                      disabled={!hasChanges()}
                      className="flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={18} /> Reset
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAdmin;
