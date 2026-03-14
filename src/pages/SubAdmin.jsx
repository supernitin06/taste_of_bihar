// pages/SubAdmin.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";

import {
  UserPlus,
  Shield,
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/GlassCard';
import Input from '../components/ui/InputField';
// import PageHeader from '../components/ui/PageHeader';
import ActionButtons from '../components/ui/UserAction';
import Select from '../components/ui/Select';
import Table from '../components/ui/Table';
import {
  useGetSubAdminsQuery,
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
  useCreateSubAdminMutation,
} from "../api/services/adminApi";


const SubAdmin = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data, isLoading, isError, refetch } = useGetSubAdminsQuery();


  // Optimize: Normalize data from API
  const subAdmins = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((admin) => {
      // Transform permissions object to array for display
      const permissionsList = [];
      if (admin.permissions) {
        Object.entries(admin.permissions).forEach(([key, value]) => {
          // If value is boolean true (e.g. dashboard: true)
          if (value === true) {
            permissionsList.push(key.charAt(0).toUpperCase() + key.slice(1));
          } 
          // If value is object (e.g. orders: { view: true })
          else if (typeof value === 'object' && value !== null) {
            if (Object.values(value).some((v) => v === true)) {
              permissionsList.push(key.charAt(0).toUpperCase() + key.slice(1));
            }
          }
        });
      }

      return {
        id: admin._id,
        name: admin.name || "Unknown",
        email: admin.email || "No Email",
        phone: admin.phone || "N/A",
        role: admin.role ? admin.role.replace(/_/g, " ") : "Sub-Admin",
        status: admin.isActive ? "active" : "inactive",
        isActive: admin.isActive,
        permissions: permissionsList,
        createdAt: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A",
        lastActive: admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never",
        image: admin.image,
      };
    });
  }, [data]);

  const stats = useMemo(() => [
    {
      title: 'Total Sub-Admins',
      value: subAdmins.length,
      icon: Users,
      trendValue: 'Total Registered',
      color: 'blue'
    },
    {
      title: 'Active Admins',
      value: subAdmins.filter(a => a.status === 'active').length,
      icon: CheckCircle,
      trendValue: 'Currently Active',
      color: 'green'
    },
    {
      title: 'Inactive Admins',
      value: subAdmins.filter(a => a.status === 'inactive').length,
      icon: XCircle,
      trendValue: 'Suspended/Inactive',
      color: 'red'
    }
  ], [subAdmins]);

  const filteredAdmins = useMemo(() => {
    return subAdmins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || admin.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [subAdmins, searchTerm, filterStatus]);

const [toggleStatus] = useToggleAdminStatusMutation();

// const handleStatusToggle = async (id) => {
//   try {
//     await toggleStatus({ id }).unwrap();

//   } catch (err) {
//     console.error(err);
//   }
// };
const handleStatusToggle = async (id) => {
  const toastId = toast.loading("Updating status...");

  try {
    await toggleStatus({ id }).unwrap();

    toast.success("Status updated successfully", {
      id: toastId,
    });

    // THIS IS IMPORTANT
    refetch();

  } catch (err) {
    console.error(err);

    toast.error(
      err?.data?.message || "Failed to update status",
      { id: toastId }
    );
  }
};





const [deleteAdmin] = useDeleteAdminMutation();

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await deleteAdmin(id).unwrap();
  } catch (err) {
    console.error(err);
  }
};


  const tableActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      color: 'blue',
      onClick: (item) => console.log('View', item), // Placeholder
    },
    {
      key: 'edit',
      label: 'Edit Permissions',
      icon: Edit,
      color: 'purple',
      onClick: () => navigate('/sub-admin/assign'),
    },
    {
      key: 'toggle',
      label: (item) => (item.status === 'active' ? 'Deactivate' : 'Activate'),
      icon: (item) => (item.status === 'active' ? Lock : Unlock),
      color: (item) => (item.status === 'active' ? 'amber' : 'emerald'),
      onClick: (item) => handleStatusToggle(item.id),
    },
    {
      key: 'delete',
      label: 'Delete Admin',
      icon: Trash2,
      color: 'rose',
      onClick: (item) => handleDelete(item.id),
    },
  ];
const columns = [
  {
    header: "Customer",
    render: (admin) => (
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {admin.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-gray-100">
            {admin.name}
          </p>
          <p className="text-sm text-muted">{admin.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Contact",
    key: "phone",
  },
  {
    header: "Membership",
    render: (admin) => (
      <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5">
        <Shield size={14} />
        {admin.role}
      </span>
    ),
  },
  {
    header: "Stats",
    render: (admin) => (
      <div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {admin.lastActive}
          </span>
        </div>
        <p className="text-xs text-muted mt-1">
          Joined {admin.createdAt}
        </p>
      </div>
    ),
  },
  {
    header: "Status",
    render: (admin) => (
      <div className="flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            admin.status === "active"
              ? "bg-green-500 animate-pulse"
              : "bg-red-500"
          }`}
        />
        <span
          className={`text-sm font-bold ${
            admin.status === "active"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {admin.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },
  {
    header: "Actions",
    key: "actions",
  },
];


  return (

    
    <div className="page">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex bg-primary flex-col mb-6 md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          <div className="w-full md:w-auto">
            <h1 className="highlight text-4xl font-extrabold tracking-tight">
              Sub-Admin Management
            </h1>
            <p className="text-primary opacity-70 mt-2 text-lg font-medium">
              Manage administrators and control their access levels
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <Button
              onClick={() => navigate('/sub-admin/create')}
              className="btn-primary w-auto px-4 py-2 flex items-center gap-2"
              fullWidth={false}
            >
              <UserPlus size={18} />
              Create Sub-Admin
            </Button>
            <Button
              onClick={() => navigate('/sub-admin/assign')}
              className="bg-white text-primary hover:bg-gray-50 w-auto px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors justify-center"
              fullWidth={false}
            >
              <Shield size={18} />
              Manage Permissions
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trendValue={stat.trendValue}
              color={stat.color}
            />
          ))}
        </div>

        {/* Filters & Search */}
        <Card className="p-4 lg:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<Search size={18} />}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  className="w-full sm:w-48"
                />
              </div>
              <Button
                variant="secondary"
                className="flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Apply Filter</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Sub-Admins List */}
        {filteredAdmins.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No Sub-Admins Found
            </h3>
            <p className="text-muted mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first sub-admin'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button
                onClick={() => navigate('/sub-admin/create')}
                className="btn-primary mx-auto"
              >
                <UserPlus size={18} className="mr-2" />
                Create First Sub-Admin
              </Button>
            )}
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">

              <Card className="overflow-hidden">
                <Table
                  columns={columns}
                  data={filteredAdmins}
                  actions={tableActions}
                  title='Sub Admin'
                />
              </Card>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {filteredAdmins.map((admin) => (
                <Card key={admin.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{admin.name}</p>
                          <p className="text-sm text-muted truncate">{admin.email}</p>
                        </div>
                      </div>
                      <div className="relative shrink-0">
                        <ActionButtons 
                          item={admin}
                          actions={tableActions}
                          maxVisible={0}
                          size="md"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">Role</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5">
                        <Shield size={12} />
                        {admin.role}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-muted font-medium block mb-2">Permissions</span>
                      <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(admin.permissions) &&
  admin.permissions.slice(0, 2).map((perm, idx) => (
    <span
      key={idx}
      className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-semibold"
    >
      {perm}
    </span>
))}

                        {admin.permissions.length > 2 && (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-semibold">
                            +{admin.permissions.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${admin.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-bold ${admin.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {admin.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock size={12} />
                        {admin.lastActive}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubAdmin;