import React, { useState } from "react";
import offersData from "../assets/json/offers.json";
import { normalizeCoupon, normalizeOffer } from "../utils/normalizeCoupon";

import SearchFilter from "../components/offers/SearchFilter";
import OffersTable from "../components/offers/OffersTable";
import CouponsTable from "../components/offers/CouponsTable";
import OfferModal from "../components/offers/OfferModal";
import CouponModal from "../components/offers/CouponModal";
import Button from "../components/ui/Button";
import {
  useGetOffersQuery,
  usePostOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} from "../api/services/offer";
import {
  useGetCouponsQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponStatusMutation,
} from "../api/services/coupon";

import ConfirmationModal from "../components/ui/ConfirmationModal";
import toast from "react-hot-toast";

const OffersManagement = () => {
  // \u091f\u0948\u092b \u0938\u094d\u091f\u0947\u091f
  const [activeTab, setActiveTab] = useState("offers"); // "offers" or "coupons"

  // API Hooks
  const { data: offersDataApi, isLoading: isLoadingOffers, isError: isErrorOffers } = useGetOffersQuery();
  const [createOffer] = usePostOfferMutation({ refetchOnMountOrArgChange: true });
  const [updateOffer] = useUpdateOfferMutation({ refetchOnMountOrArgChange: true });
  const [deleteOfferApi] = useDeleteOfferMutation({ refetchOnMountOrArgChange: true });

  const { data: couponsDataApi, isLoading: isLoadingCoupons, isError: isErrorCoupons } = useGetCouponsQuery();
  const [addCoupon] = useAddCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [updateCouponStatus] = useUpdateCouponStatusMutation();
  const couponsData = couponsDataApi?.data;

  // API likely returns docs based on pagination param in query

  // Transform API Data
  const transformOffer = (apiOffer) => ({
    offerId: apiOffer._id,
    title: apiOffer.title,
    code: apiOffer.code || '',
    description: apiOffer.description,
    discountType: apiOffer.offerType?.toLowerCase() || 'percentage',
    discountValue: apiOffer.discountValue,
    minOrderValue: apiOffer.minOrderValue,
    status: apiOffer.isActive ? 'active' : 'inactive',
    validity: { startDate: apiOffer.validFrom, endDate: apiOffer.validUntil },
    image: apiOffer.image,
  });

  const offers = offersDataApi?.data?.map(transformOffer) || [];

  const coupons = couponsData || [];

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: null });

  const filteredOffers = offers.filter((o) => {
    const matchSearch = o.title?.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus ? o.status === filterStatus.toLowerCase() : true;
    return matchSearch && matchStatus;
  });

  const filteredCoupons = coupons.filter((c) => {
    const matchSearch = c.code?.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus ? c.status === filterStatus.toLowerCase() : true;
    return matchSearch && matchStatus;
  });

  const openModal = (item, mode) => {
    setSelectedItem(item);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalMode("");
    setIsModalOpen(false);
  };

  const saveOffer = async (data) => {
    // Transform Modal Data to API Payload if needed
    // Assuming Modal returns clean data matching API expectation or close enough
    const payload = {
      title: data.title,
      description: data.description,
      offerType: data.discountType?.toUpperCase() || "PERCENTAGE",
      discountValue: Number(data.discountValue),
      minOrderValue: Number(data.minOrderValue),
      validFrom: data.validity?.startDate,
      validUntil: data.validity?.endDate,
      isActive: data.status === 'active',
      image: data.image
    };

    try {
      if (modalMode === "add") {
        await createOffer(payload).unwrap();
        toast.success("Offer added successfully");
      } else {
        await updateOffer({ id: data.offerId, ...payload }).unwrap();
        toast.success("Offer updated successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save offer:", error);
      toast.error("Failed to save offer");
    }
  };

  const deleteOffer = (id) => {
    setItemToDelete({ id, type: 'offer' });
    setIsDeleteModalOpen(true);
  };




  const confirmDelete = async () => {
    try {
      if (itemToDelete.type === 'offer') {
        await deleteOfferApi(itemToDelete.id).unwrap();
        toast.success("Offer deleted successfully");
      } else if (itemToDelete.type === 'coupon') {
        await deleteCouponApi(itemToDelete.id).unwrap();
        toast.success("Coupon deleted successfully");
      }
    } catch (error) {
      console.error(`Failed to delete ${itemToDelete.type}:`, error);
      toast.error(`Failed to delete ${itemToDelete.type}`);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete({ id: null, type: null });
    }
  };

  const saveCoupon = async (data) => {
    try {
      const payload = {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        value: Number(data.discountValue), // Backend expects 'value', not 'discountValue'
        minOrderValue: Number(data.minOrderAmount), // Backend expects 'minOrderValue'
        maxDiscountLimit: Number(data.maxDiscountLimit),
        startDate: data.startDate,
        expiryDate: data.expiryDate,
        usageLimit: Number(data.usageLimit),
        usageLimitPerUser: Number(data.usageLimitPerUser),
        isActive: data.status === "active",
      };

      if (modalMode === "add") {
        await addCoupon(payload).unwrap();
        toast.success("Coupon added successfully");
      } else {
        await updateCoupon({ id: data.id, body: payload }).unwrap();
        toast.success("Coupon updated successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save coupon:", error);
      toast.error("Failed to save coupon");
    }
  };

  const handleToggleCouponStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? false : true;
      await updateCouponStatus({ id, body: { isActive: newStatus } }).unwrap();
      toast.success("Coupon status updated successfully");
    } catch (error) {
      console.error("Failed to update coupon status:", error);
      toast.error("Failed to update coupon status");
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="flex bg-primary flex-col mb-6 md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">Offers & Coupons Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
            Manage offers, coupons, and promotions across your platform.
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={() => openModal(null, "add")}
          >
            + Add {activeTab === "offers" ? "Offer" : "Coupon"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            setActiveTab("offers");
            setSearchText("");
            setFilterStatus("");
          }}
          className={`pb-3 px-1 font-medium text-lg border-b-4 transition-colors ${activeTab === "offers"
            ? "border-highlight rounded-sm highlight text-blue-500"
            : "border-none text-gray-500"
            }`}
        >
          Offers
        </button>
        <button
          onClick={() => {
            setActiveTab("coupons");
            setSearchText("");
            setFilterStatus("");
          }}
          className={`pb-3 px-1 font-medium text-lg border-b-4 transition-colors ${activeTab === "coupons"
            ? "border-highlight rounded-sm highlight text-blue-500"
            : "border-none text-gray-500"
            }`}
        >
          Coupons
        </button>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchText={searchText}
        setSearchText={setSearchText}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Conditional Table */}
      {activeTab === "offers" ? (
        <>
          <OffersTable
            offers={filteredOffers}
            onView={(o) => openModal(o, "view")}
            onEdit={(o) => openModal(o, "edit")}
            onDelete={deleteOffer}
          />
          <OfferModal
            isOpen={isModalOpen}
            mode={modalMode}
            offer={selectedItem}
            isLoading={isLoadingOffers}
            onClose={closeModal}
            onSave={saveOffer}
          />
        </>
      ) : (
        <>
          <CouponsTable
            coupons={filteredCoupons}
            onView={(c) => openModal(c, "view")}
            onEdit={(c) => openModal(c, "edit")}
            isLoading={isLoadingCoupons}
            onToggleStatus={(id) => {
              const coupon = coupons.find(c => c.id === id || c._id === id);
              if (coupon) handleToggleCouponStatus(coupon.id || coupon._id, coupon.status);
            }}
          />
          <CouponModal
            isOpen={isModalOpen}
            mode={modalMode}
            coupon={selectedItem}
            onClose={closeModal}
            onSave={saveCoupon}
          />
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${itemToDelete.type === 'offer' ? 'Offer' : 'Coupon'}?`}
        message={`Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default OffersManagement;