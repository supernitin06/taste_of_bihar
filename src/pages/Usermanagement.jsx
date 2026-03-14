import React, { useState, useMemo } from "react";
import { showPromiseToast } from "../utils/toastAlert";
import FiltersBar from "../components/ui/UserFilters";
import UserModal from "../components/users/UserModal";
import UserOrdersModal from "../components/users/UserOrdersModal";
import UserCard from "../components/users/UserCard";
import {
  useGetUserDetailsQuery,
  useGetUsersQuery,
  useUpdateUserBlockMutation,
} from "../api/services/userapi";
import {
  TrendingUp,
  TrendingDown,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import GradientButton from "../components/ui/GradientButton";
import StatCard from "../components/ui/StatCard";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "../components/ui/ConfirmationModal";
import toast from "react-hot-toast";

const UserManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State for Orders Modal
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [activeOrdersUserId, setActiveOrdersUserId] = useState(null);

  const {
    data: userDetail,
    isLoading: userDetailLoading,
    isError: userDetailError,
  } = useGetUserDetailsQuery(selectedUser, { skip: !selectedUser });

  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  console.log("data of user", userDetail);
  // -------------------- Hooks (always called) --------------------
  const { data, isLoading, isError } = useGetUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const [updateUserBlock] = useUpdateUserBlockMutation();
  //  Action
  const tableActions = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      color: "blue",
      onClick: (item) => {
        setSelectedUser(item._id);
        setShowModal(true);
      },
    },
    // {
    //   key: 'orders',
    //   label: 'View Orders',
    //   icon: ShoppingBag,
    //   color: 'amber',
    //   onClick: (item) => {
    //     setActiveOrdersUserId(item._id);
    //     setShowOrdersModal(true);
    //   },
    // },
  ];

  // -------------------- Data processing --------------------
  const users = data?.data || [];
  const totalUsers = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (filters.status === "active")
      filtered = filtered.filter((u) => !u.isBlocked);
    if (filters.status === "inactive")
      filtered = filtered.filter((u) => u.isBlocked);

    if (searchTerm)
      filtered = filtered.filter((u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    return filtered;
  }, [users, searchTerm, filters]);

  const activeUsers = users.filter((u) => !u.isBlocked).length;
  const inactiveUsers = users.filter((u) => u.isBlocked).length;

  // -------------------- Handlers --------------------
  // -------------------- Handlers --------------------
  const handleBlockToggle = async (user) => {
    try {
      await updateUserBlock({
        id: user._id,
        body: { isBlocked: !user.isBlocked },
      }).unwrap();
      toast.success(
        `User ${!user.isBlocked ? "blocked" : "unblocked"} successfully!`,
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // TODO: Wire up useDeleteUserMutation when available
      console.log("Deleting user (placeholder):", userToDelete);
      toast.success("User deleted successfully (Placeholder)");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleActiveToggle = (user) => {
    updateUserBlock({
      id: user._id,
      body: { isActive: !user.isActive },
    });
  };

  // -------------------- Columns for Table --------------------
  // -------------------- Columns for Table --------------------
  const columns = [
    {
      header: "Profile",
      key: "profile",
      render: (user) => {
        const userName = user.displayName || user.name || "U";
        return (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            {user.profile && user.profile !== "not available" ? (
              <img
                src={user.profile}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Name",
      key: "name",
      render: (user) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {user.displayName || user.name}
        </div>
      ),
    },
    {
      header: "Contact Info",
      key: "email",
      render: (user) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-700 dark:text-gray-200">
            {user.email}
          </span>
          <span className="text-xs text-gray-500">{user.mobile}</span>
        </div>
      ),
    },
    {
      header: "DOB",
      key: "dob",
      render: (user) => {
        if (!user.dob) return <span className="text-gray-400">-</span>;
        return new Date(user.dob).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      header: "Joined Date", // Renamed from createdAt for better UX
      key: "createdAt",
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: "Block Status",
      key: "isBlocked",
      render: (user) => (
        <Badge
          type={user.isBlocked ? "inactive" : "active"}
          onClick={() => handleBlockToggle(user)}
          className="cursor-pointer"
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </Badge>
      ),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: "all" });
    setSearchTerm("");
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // -------------------- Render --------------------
  return (
    <div className="page px-6 py-8 relative">
      <div className="flex flex-col mb-6 md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="highlight text-4xl font-extrabold">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Manage users and their profiles.
          </p>
        </div>
      </div>

      {showModal && (
        <UserModal
          user={userDetail?.data}
          isLoading={userDetailLoading}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Orders Modal */}
      {showOrdersModal && activeOrdersUserId && (
        <UserOrdersModal
          userId={activeOrdersUserId}
          onClose={() => {
            setShowOrdersModal(false);
            setActiveOrdersUserId(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User?"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />

      <div className="relative z-50">
        {isLoading && <div>Loading users...</div>}
        {isError && <div>Error fetching users</div>}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total Users"
                value={totalUsers}
                icon={TrendingUp}
                color="blue"
              />
              <StatCard
                title="Active Users"
                value={activeUsers}
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                title="Inactive Users"
                value={inactiveUsers}
                icon={TrendingDown}
                color="red"
              />
              <StatCard
                title="Current Page Users"
                value={users.length}
                icon={TrendingUp}
                color="purple"
              />
            </div>

            <FiltersBar
              search={{
                value: searchTerm,
                placeholder: "Search by name...",
                onChange: setSearchTerm,
              }}
              filters={[
                {
                  key: "status",
                  value: filters.status,
                  options: [
                    { label: "All", value: "all" },
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ],
                  placeholder: "Status",
                },
              ]}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            >
              <div className="flex gap-1">
                <GradientButton onClick={() => setViewMode("grid")}>
                  <Grid size={16} />
                </GradientButton>
                <GradientButton onClick={() => setViewMode("table")}>
                  <List size={16} />
                </GradientButton>
              </div>
            </FiltersBar>

            {viewMode === "grid" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      onViewDetails={() => {
                        console.log("Opening modal for:", user.name);
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      onDelete={handleDelete} 
                    />

                    
                  ))}
                </div>

                {showModal && selectedUser && (
                  <UserModal
                    user={selectedUser}
                    onClose={() => {
                      console.log("Closing modal");
                      setShowModal(false);
                      setSelectedUser(null);
                    }}
                  />
                )}
              </>
            )}

            {viewMode === "table" && (
              <Table
                data={filteredUsers}
                columns={columns}
                title="Users"
                actions={tableActions}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
