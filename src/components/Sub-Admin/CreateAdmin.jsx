// components/Sub-Admin/createAdmin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  RefreshCw,
  CheckCircle,
  Save,
  XCircle,
  AlertCircle,
  LayoutDashboard,
  Bike,
  CreditCard,
  ShieldCheck,
  Menu,
  Ticket,
  FileText,
  Headphones,
  Settings,
  ChevronDown,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/GlassCard";
import Input from "../ui/InputField";
import ConfirmationModal from "./ConfirmationModal";
import sidebarData from "../../assets/json/sidebar.json";
import Select from "../ui/Select";
import { useCreateSubAdminMutation, useUpdateAdminPermissionsMutation } from "../../api/services/adminApi";

const CreateAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createSubAdmin, { isLoading }] = useCreateSubAdminMutation();
  const [updateAdminPermissions] = useUpdateAdminPermissionsMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "MANAGER",
  });

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedSidebarItems, setSelectedSidebarItems] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [errors, setErrors] = useState({});
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const permissionGroups = [
    {
      category: "Orders Management",
      icon: ShoppingBag,
      color: "blue",
      bgClass: "bg-blue-50 dark:bg-blue-900/20",
      textClass: "text-blue-600 dark:text-blue-400",
      borderClass: "border-blue-200 dark:border-blue-800",
      permissions: [
        {
          id: "view_orders",
          label: "View Orders",
          description: "Can view all orders",
        },
        {
          id: "manage_orders",
          label: "Manage Orders",
          description: "Can edit and cancel orders",
        },
        {
          id: "assign_delivery",
          label: "Assign Delivery",
          description: "Can assign delivery partners",
        },
        {
          id: "mark_delivered",
          label: "Mark Delivered",
          description: "Can mark orders as delivered",
        },
      ],
    },
    {
      category: "User Management",
      icon: Users,
      color: "green",
      bgClass: "bg-green-50 dark:bg-green-900/20",
      textClass: "text-green-600 dark:text-green-400",
      borderClass: "border-green-200 dark:border-green-800",
      permissions: [
        {
          id: "view_users",
          label: "View Users",
          description: "Can view user details",
        },
        {
          id: "manage_users",
          label: "Manage Users",
          description: "Can edit and block users",
        },
        {
          id: "export_users",
          label: "Export Users",
          description: "Can export user data",
        },
      ],
    },
    {
      category: "Restaurant Management",
      icon: UtensilsCrossed,
      color: "orange",
      bgClass: "bg-orange-50 dark:bg-orange-900/20",
      textClass: "text-orange-600 dark:text-orange-400",
      borderClass: "border-orange-200 dark:border-orange-800",
      permissions: [
        {
          id: "view_restaurants",
          label: "View Restaurants",
          description: "Can view restaurant details",
        },
        {
          id: "manage_restaurants",
          label: "Manage Restaurants",
          description: "Can approve/suspend restaurants",
        },
        {
          id: "edit_commission",
          label: "Edit Commission",
          description: "Can modify commission rates",
        },
      ],
    },
    {
      category: "Financial Operations",
      icon: RefreshCw,
      color: "purple",
      bgClass: "bg-purple-50 dark:bg-purple-900/20",
      textClass: "text-purple-600 dark:text-purple-400",
      borderClass: "border-purple-200 dark:border-purple-800",
      permissions: [
        {
          id: "view_payments",
          label: "View Payments",
          description: "Can view payment details",
        },
        {
          id: "handle_refunds",
          label: "Handle Refunds",
          description: "Can process refund requests",
        },
        {
          id: "view_reports",
          label: "View Reports",
          description: "Can access financial reports",
        },
      ],
    },
  ];

  const iconMapping = {
    Dashboard: LayoutDashboard,
    Users: Users,
    Restaurants: UtensilsCrossed,
    "Delivery Partners": Bike,
    Orders: ShoppingBag,
    Payments: CreditCard,
    Coupons: Ticket,
    Reports: FileText,
    Support: Headphones,
    "Sub-Admins": ShieldCheck,
    Settings: Settings,
  };

  const sidebarOptions = sidebarData.map((item) => ({
    id: item.name.toLowerCase().replace(/\s+/g, "-"),
    label: item.name,
    icon: iconMapping[item.name] || Menu,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const toggleCategoryPermissions = (category) => {
    const group = permissionGroups.find((g) => g.category === category);
    const categoryPerms = group?.permissions.map((p) => p.id) || [];

    const allSelected = categoryPerms.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !categoryPerms.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...categoryPerms]),
      ]);
    }
  };

  const toggleSidebarItem = (itemId) => {
    setSelectedSidebarItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const toggleAllSidebarItems = () => {
    if (selectedSidebarItems.length === sidebarOptions.length) {
      setSelectedSidebarItems([]);
    } else {
      setSelectedSidebarItems(sidebarOptions.map((item) => item.id));
    }
  };

  const toggleGroup = (category) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (selectedPermissions.length === 0) {
      newErrors.permissions = "Please select at least one permission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setConfirmModalOpen(true);
    }
  };

  const handleConfirmCreate = async () => {
  const toastId = toast.loading("Creating sub-admin...");

  try {
    const formDataPayload = new FormData();

    formDataPayload.append("name", formData.name);
    formDataPayload.append("email", formData.email);
    formDataPayload.append("phone", formData.phone);
    formDataPayload.append("password", formData.password);
    formDataPayload.append("role", formData.role);
    formDataPayload.append("restaurantId", "695cde37e3a25484182d11a5");

    //  CREATE ADMIN
    const res = await createSubAdmin(formDataPayload).unwrap();
    const adminId = res.data._id;

    toast.loading("Assigning permissions...", { id: toastId });

    //  UPDATE PERMISSIONS
    await updateAdminPermissions({
      id: adminId,
      permissions: permissionPayload,
    }).unwrap();

    toast.success("Sub-admin created successfully 🎉", {
      id: toastId,
    });

    setConfirmModalOpen(false);
    navigate("/sub-admin");
  } catch (error) {
    console.error("Create admin failed", error);

    toast.error(
      error?.data?.message || "Failed to create sub-admin",
      { id: toastId }
    );
  }
};


  return (
    <div className="page">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <div>
              <h1 className="highlight text-4xl font-extrabold tracking-tight">
                Create New Sub-Admin
              </h1>
              <p className="text-primary opacity-70 mt-2 text-lg font-medium">
                Add a new administrator with custom permissions
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="overflow-hidden">
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center">
                      <User
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Basic Information
                      </h2>
                      <p className="text-sm text-muted">
                        Personal details of the sub-admin
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        icon={<User size={18} />}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="admin@swaad.com"
                        icon={<Mail size={18} />}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        icon={<Phone size={18} />}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className=" block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Role Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Shield
                          size={18}
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />

                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="input w-full"
                        >
                          <option value="">Select Role</option>
                          <option value="MANAGER">Support Admin</option>
                          <option value="RESTAURANT_ADMIN">
                            Restaurant Manager
                          </option>
                          <option value="SUPER_ADMIN">Order Manager</option>
                          <option value="KITCHEN_STAFF">Financial Admin</option>
                          <option value="DELIVERY_MANAGER">
                            Delivery Manager
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter password"
                          className="input w-full pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Re-enter password"
                          className="input w-full pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              {/* Sidebar Access Control */}
              <Card className="overflow-hidden">
                <div
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center">
                        <Menu
                          size={20}
                          className="text-orange-600 dark:text-orange-400"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          Sidebar Access
                        </h2>
                        <p className="text-sm text-muted">
                          Control which menu items are visible
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAllSidebarItems();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          selectedSidebarItems.length === sidebarOptions.length
                            ? "bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400"
                            : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-orange-600"
                        }`}
                      >
                        {selectedSidebarItems.length ===
                        sidebarOptions.length ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle size={14} />
                            All Visible
                          </span>
                        ) : (
                          "Select All"
                        )}
                      </button>
                      <ChevronDown
                        size={20}
                        className={`text-gray-500 transition-transform duration-300 ${isSidebarExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {isSidebarExpanded && (
                  <div className="p-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sidebarOptions.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedSidebarItems.includes(
                          item.id,
                        );

                        return (
                          <label
                            key={item.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                              isSelected
                                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <Input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSidebarItem(item.id)}
                              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-600 focus:ring-orange-500 cursor-pointer"
                            />
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                              <Icon
                                size={16}
                                className={
                                  isSelected
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-gray-500"
                                }
                              />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                              {item.label}
                            </span>
                            {isSelected && (
                              <CheckCircle
                                size={16}
                                className="text-orange-600 dark:text-orange-400 ml-auto"
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>

              {/* Permissions */}
              <Card className="overflow-hidden">
                <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center">
                        <Shield
                          size={20}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          Permissions & Access
                        </h2>
                        <p className="text-sm text-muted">
                          Select what this sub-admin can do
                        </p>
                      </div>
                    </div>
                    {selectedPermissions.length > 0 && (
                      <div className="px-3 py-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {selectedPermissions.length} Selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {errors.permissions && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                      <AlertCircle
                        size={18}
                        className="text-red-600 dark:text-red-400"
                      />
                      <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
                        {errors.permissions}
                      </p>
                    </div>
                  )}

                  <div className="space-y-5">
                    {permissionGroups.map((group) => {
                      const Icon = group.icon;
                      const allSelected = group.permissions.every((p) =>
                        selectedPermissions.includes(p.id),
                      );
                      const someSelected = group.permissions.some((p) =>
                        selectedPermissions.includes(p.id),
                      );
                      const selectedCount = group.permissions.filter((p) =>
                        selectedPermissions.includes(p.id),
                      ).length;
                      const isExpanded = expandedGroups[group.category];

                      return (
                        <div
                          key={group.category}
                          className={`border-2 ${
                            someSelected
                              ? group.borderClass
                              : "border-gray-200 dark:border-gray-700"
                          } rounded-xl overflow-hidden transition-all`}
                        >
                          <div
                            onClick={() => toggleGroup(group.category)}
                            className={`${group.bgClass} px-4 py-3 border-b cursor-pointer ${
                              someSelected
                                ? group.borderClass
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-lg bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center`}
                                >
                                  <Icon size={18} className={group.textClass} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                                    {group.category}
                                  </h3>
                                  <p className="text-xs text-muted">
                                    {selectedCount} of{" "}
                                    {group.permissions.length} selected
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCategoryPermissions(group.category);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                    allSelected
                                      ? "bg-white dark:bg-gray-900 " +
                                        group.textClass
                                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:" +
                                        group.textClass
                                  }`}
                                >
                                  {allSelected ? (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle size={14} />
                                      All Selected
                                    </span>
                                  ) : (
                                    "Select All"
                                  )}
                                </button>
                                <ChevronDown
                                  size={18}
                                  className={`text-gray-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                />
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                              {group.permissions.map((permission) => {
                                const isSelected = selectedPermissions.includes(
                                  permission.id,
                                );

                                return (
                                  <label
                                    key={permission.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                                      isSelected
                                        ? group.bgClass +
                                          " " +
                                          group.borderClass
                                        : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() =>
                                        togglePermission(permission.id)
                                      }
                                      className="mt-0.5 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                        {permission.label}
                                      </p>
                                      <p className="text-xs text-muted mt-0.5">
                                        {permission.description}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle
                                        size={18}
                                        className={
                                          group.textClass + " shrink-0"
                                        }
                                      />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              <div className="sticky top-6">
                <Card className="overflow-hidden">
                  <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      <CheckCircle
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                      Creation Summary
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">
                        Admin Name
                      </p>
                      <p className="font-bold text-gray-800 dark:text-gray-100">
                        {formData.name || (
                          <span className="text-gray-400 dark:text-gray-500 font-normal">
                            Not entered
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">
                        Role
                      </p>
                      <p className="font-bold text-purple-600 dark:text-purple-400">
                        {formData.role}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">
                        Selected Permissions
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {selectedPermissions.length}
                        </p>
                        <p className="text-sm text-muted">permissions</p>
                      </div>
                      {selectedPermissions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                          <div className="flex flex-wrap gap-1.5">
                            {permissionGroups.map((group) => {
                              const count = group.permissions.filter((p) =>
                                selectedPermissions.includes(p.id),
                              ).length;
                              if (count === 0) return null;
                              return (
                                <span
                                  key={group.category}
                                  className={`px-2 py-1 ${group.bgClass} ${group.textClass} rounded text-xs font-semibold`}
                                >
                                  {count} {group.category.split(" ")[0]}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                      <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">
                        Sidebar Access
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {selectedSidebarItems.length}
                        </p>
                        <p className="text-sm text-muted">menus visible</p>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2 py-3 text-base font-bold shadow-sm hover:shadow-md transition-all"
                      >
                        <Save size={18} />
                        Create Sub-Admin
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/sub-admin")}
                        className="w-full py-3"
                      >
                        <XCircle size={18} className="mr-2" />
                        Cancel
                      </Button>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>
                          Make sure to verify all information before creating
                          the sub-admin account.
                        </span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmCreate}
        title="Confirm Sub-Admin Creation"
        message="Are you sure you want to create this new sub-admin with the selected permissions?"
        confirmText="Create Admin"
      />
    </div>
  );
};

export default CreateAdmin;
