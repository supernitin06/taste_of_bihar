import React, { useState, useEffect, useMemo } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useGetDeliveryPartnersQuery } from "../api/services/deliveryPartnerApi";
import DeliveryPartner from "../components/delivery-partner-management/DeliveryPartner";
import DeliveryPartnerDetailsModal from "../components/delivery-partner-management/DeliveryPartnerDetailsModal";
import DeliveryPartnerForm from "../components/delivery-partner-management/DeliveryPartnerForm";
import DeliveryPartnerSearchFilter from "../components/delivery-partner-management/DeliveryPartnerSearchFilter";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
// import { approvePartnerApi, rejectPartnerApi } from "../api/services/deliveryPartnerApprovalApi";

const DeliveryPartnerManagement = () => {
  const { data: apiResponse, isLoading, error } = useGetDeliveryPartnersQuery();
  const [partners, setPartners] = useState([]);

  const [filteredPartners, setFilteredPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("partnerViewMode") || "grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync API data to local state
  useEffect(() => {
    if (apiResponse?.success && apiResponse?.data) {
      setPartners(apiResponse.data);
    }
  }, [apiResponse]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem("partnerViewMode", viewMode);
  }, [viewMode]);

  // Filter partners based on search, status, and approval
  useEffect(() => {
    let filtered = partners.filter((p) =>
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((p) => {
        const isActive = p.isActive; // boolean
        const calculatedStatus = isActive ? "Active" : "Inactive";
        // If filter is "Active", we want isActive=true.
        return calculatedStatus === statusFilter;
      });
    }

    if (approvalFilter !== "All") {
      // Assuming isApproved is the flag. If not in raw data, check kyc.status?
      // Raw data provided has 'kyc.status'. JSON doesn't show explicit 'isApproved'.
      // Based on previous code: `approvalStatus: p.isApproved ? "Approved" : "Pending"`
      // If raw data lacks isApproved, this filter might break or need adjustment.
      // Let's assume isApproved exists or map from kyc.status.
      // JSON example: "kyc": { "status": "VERIFIED" }.
      // Let's use KYC status for approval filter if isApproved is missing.
      const approvalStatus = p.isApproved ? "Approved" : (p.kyc?.status === "VERIFIED" ? "Approved" : "Pending");
      return approvalStatus === approvalFilter;
    }

    setFilteredPartners(filtered);
    setCurrentPage(1);
  }, [partners, searchTerm, statusFilter, approvalFilter]);

  // Partner counts
  const partnerCounts = useMemo(() => ({
    all: partners.length,
    active: partners.filter((p) => p.isActive).length,
    inactive: partners.filter((p) => !p.isActive).length,
    pending: partners.filter((p) => !p.isApproved && p.kyc?.status !== "VERIFIED").length,
  }), [partners]);

  // Pagination
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const currentPartners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPartners.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPartners, currentPage, itemsPerPage]);

  // Modal Handlers
  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedPartner(null);
    setIsModalOpen(false);
  };

  // Form Handlers
  const handleAddPartner = () => {
    setEditingPartner(null);
    setIsFormOpen(true);
  };
  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };
  const closeForm = () => {
    setEditingPartner(null);
    setIsFormOpen(false);
  };

  // Update Partner in state
  const updatePartner = (updatedPartner) => {
    const updatedList = partners.map((p) =>
      (p._id || p.partnerId) === (updatedPartner._id || updatedPartner.partnerId) ? updatedPartner : p
    );
    setPartners(updatedList);
    setFilteredPartners(updatedList);
    if ((selectedPartner?._id || selectedPartner?.partnerId) === (updatedPartner._id || updatedPartner.partnerId)) {
      setSelectedPartner(updatedPartner);
    }
  };

  // Approve / Reject Partner
  const handleApprove = async (partner) => {
    try {
      const id = partner._id || partner.partnerId;
      const response = await approvePartnerApi(id);
      if (response.success) {
        updatePartner({
          ...partner,
          isActive: true,
          isApproved: true,
          kyc: { ...partner.kyc, status: "VERIFIED" }
        });
        toast.success("Partner approved successfully");
        closeModal();
      }
    } catch (err) {
      toast.error("Failed to approve partner");
    }
  };

  const handleReject = async (partner) => {
    try {
      const id = partner._id || partner.partnerId;
      const response = await rejectPartnerApi(id);
      if (response.success) {
        updatePartner({
          ...partner,
          isActive: false,
          isApproved: false,
          kyc: { ...partner.kyc, status: "REJECTED" }
        });
        toast.error("Partner rejected");
        closeModal();
      }
    } catch (err) {
      toast.error("Failed to reject partner");
    }
  };

  return (
    <div className="page page-background">
      {/* Header */}
      <div className="flex bg-primary flex-col mb-6 md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">
            Delivery Partner Management
          </h1>
          <p className="text-primary opacity-70 mt-2 text-lg font-medium">
            Manage delivery partners, assignments, and performance across your platform.
          </p>
        </div>
        <Button onClick={handleAddPartner} variant="primary" className="mt-4 md:mt-0">
          <UserPlus size={18} />
          Add Partner
        </Button>
      </div>

      {/* Search & Filters */}
      <DeliveryPartnerSearchFilter
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        approvalFilter={approvalFilter}
        onApprovalFilterChange={setApprovalFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={partnerCounts}
      />

      {/* Partner List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </div>
      ) : (
        <DeliveryPartner
          partners={currentPartners}
          onViewDetails={handleViewDetails}
          onEdit={handleEditPartner}
          updatePartner={updatePartner}
          viewMode={viewMode}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedPartner && (
        <DeliveryPartnerDetailsModal
          partner={selectedPartner}
          onClose={closeModal}
          updatePartner={updatePartner}
          onApprove={() => handleApprove(selectedPartner)}
          onReject={() => handleReject(selectedPartner)}
        />
      )}

      {/* Add / Edit Form */}
      {isFormOpen && (
        <DeliveryPartnerForm
          onClose={closeForm}
          partner={editingPartner}
        />
      )}
    </div>
  );
};

export default DeliveryPartnerManagement;
