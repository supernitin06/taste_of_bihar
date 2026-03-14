import React, { useState, useEffect } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import SearchFilterBar from "../components/restaurant/SearchFilterBar";
import RestaurantStats from "../components/restaurant/RestaurantStats";
import RestaurantGrid from "../components/restaurant/RestaurantGrid";
import ViewDetailsModal from "../components/restaurant/ViewDetailsModal";
import EditRestaurantModal from "../components/restaurant/EditRestaurantModal";
import Table from "../components/ui/Table";
import Pagination from "../components/ui/Pagination";
import {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useToggleRestaurantStatusMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} from "../api/services/resturentsapi";

function RestaurantManagement() {
  // ===== State =====
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ===== RTK Query Hooks =====
  const { data, isLoading, isError, refetch } = useGetRestaurantsQuery();
  const { data: restaurantDetails } = useGetRestaurantByIdQuery(
    selectedRestaurantId,
    { skip: !selectedRestaurantId }
  );
  const [toggleStatus] = useToggleRestaurantStatusMutation();
  const [updateRestaurant] = useUpdateRestaurantMutation();
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  // ===== Prepare restaurants =====
  const restaurants = Array.isArray(data?.data) ? data.data : [];
  // ===== Filtered Restaurants =====
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === "Approved") {
      matchesStatus = r.isActive === true || r.isActive === "active";
    } else if (statusFilter === "Suspended") {
      matchesStatus = r.isActive === false || r.isActive === "suspended";
    }
    return matchesSearch && matchesStatus;
  });
  // ===== Reset page when search/status changes =====
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  // ===== Pagination =====
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // ===== Handlers =====
  const handleApprove = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };
  const handleSuspend = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Suspend failed", err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteRestaurant(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  const handleUpdate = async () => {
    if (!editRestaurant) return;
    try {
      await updateRestaurant({
        id: editRestaurant._id,
        body: {
          name: editRestaurant.name,
          brandName: editRestaurant.brandName,
          logo: editRestaurant.logo,
        },
      }).unwrap();
      setEditRestaurant(null);
      refetch();
    } catch (err) {
      console.error("Update failed", err);
    }
  };
  const handleEdit = (restaurant) => setEditRestaurant({ ...restaurant });
  const handleView = (restaurant) => setSelectedRestaurantId(restaurant._id);
  const handleCloseModal = () => setSelectedRestaurantId(null);
  const restaurantColumns = [
    { header: "Name", key: "name" },
    { header: "Rating", key: "ratingSummary" },
    {
      header: "Status",
      key: "isActive",
      render: (row) =>
        (row.isActive === true || row.isActive === "active")
          ? "Approved"
          : "Suspended",
    },
  ];
  const tableActions = [
    {
      key: "view",
      label: "View",
      icon: Eye,
      color: "blue",
      onClick: handleView,
    },
    {
      key: "edit",
      label: "Edit",
      icon: Edit,
      color: "purple",
      onClick: handleEdit,
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      color: "rose",
      onClick: (item) => handleDelete(item._id || item.id),
    },
  ];
  const getStatusColor = (isActive) =>
    isActive
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300";

  // ===== Render =====
  if (isLoading) return <div className="p-8">Loading restaurants...</div>;
  if (isError) return <div className="p-8 text-red-500">Error loading restaurants</div>;

  return (
    <div className="page page-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 mb-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">
            Restaurant Management
          </h1>
          <p className="text-primary opacity-70 mt-2 text-lg font-medium">
            Manage restaurant pricing, rules, and priorities across your platform.
          </p>
        </div>
      </div>

      {/* Stats */}
      <RestaurantStats restaurants={filteredRestaurants} />

      {/* Search & Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddNew={() => console.log("Add new clicked")}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Grid view */}
      {viewMode === "grid" && (
        <>
          <RestaurantGrid
            filteredRestaurants={paginatedRestaurants}
            onApprove={handleApprove}
            onSuspend={handleSuspend}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getStatusColor={getStatusColor}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <>
          <Table
            title="Restaurants"
            data={paginatedRestaurants}
            columns={restaurantColumns}
            actions={tableActions}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modals */}
      {selectedRestaurantId && (
        <ViewDetailsModal
          restaurant={restaurantDetails?.data}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onSuspend={handleSuspend}
        />
      )}

      {editRestaurant && (
        <EditRestaurantModal
          editRestaurant={editRestaurant}
          setEditRestaurant={setEditRestaurant}
          onCancel={() => setEditRestaurant(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

export default RestaurantManagement;
