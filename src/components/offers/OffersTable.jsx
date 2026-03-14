import React from "react";
import { Tag, Percent, DollarSign, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import Table from "../ui/Table";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useUpdateOfferStatusMutation } from "../../api/services/offer";
import toast from "react-hot-toast";

const OffersTable = ({ offers = [], onView, onEdit, onDelete , isLoading}) => {
  const [updateOfferStatus , isLoadingUpdate] = useUpdateOfferStatusMutation({ refetchOnMountOrArgChange: true }) ;

  const tableActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      color: 'blue',
      onClick: (item) => onView(item),
    },
    {
      key: 'edit',
      label: 'Edit Offer',
      icon: Edit,
      color: 'purple',
      onClick: (item) => onEdit(item),
    },
    {
      key: 'delete',
      label: 'Delete Offer',
      icon: Trash2,
      color: 'rose',
      onClick: (item) => onDelete(item.offerId),
    },
  ];

  const onToggleStatus = async (coupon) => {
    try {
      const newStatus = coupon.status === 'active' ? 'inactive' : 'active'
      const isActive = newStatus === 'active';

      await updateOfferStatus({
        id: coupon.id || coupon._id || coupon.offerId, // Handle various ID fields
        body: { isActive }
      }).unwrap();
      toast.success("Offer status updated successfully"); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to update offer status"); 
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 cursor-pointer">
      {offers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No offers found.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Total offers in system: {offers.length}
          </p>
        </div>
      ) : (
        <>
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Showing {offers.length} of {offers.length} offers
          </div>
          {isLoading && <p>Loading...</p>}
          <Table
            data={offers}
            columns={[
              { header: "Offer ID", key: "offerId", render: (offer) => <span className="font-mono text-primary">{offer.offerId}</span> },
              {
                header: "Offer", key: "title", render: (offer) => (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      {offer.code && (
                        <p className="text-xs text-gray-500">{offer.code}</p>
                      )}
                    </div>
                  </div>
                )
              },
              {
                header: "Discount", key: "discountValue", render: (offer) => (
                  <div className="flex items-center gap-2">
                    {offer.discountType === "percentage" ? (
                      <Percent className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="font-medium">
                      {offer.discountType === "percentage"
                        ? `${offer.discountValue}%`
                        : `₹${offer.discountValue}`}
                    </span>
                  </div>
                )
              },
              {
                header: "Min Order", key: "minOrderValue", render: (offer) => (
                  <span className="text-sm text-gray-400">
                    {offer.minOrderValue
                      ? `₹${offer.minOrderValue}`
                      : "No minimum"}
                  </span>
                )
              },
              {
                header: "Status", key: "status", render: (coupon) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      onToggleStatus(coupon);
                    }}
                    className="hover:scale-105 transition-transform"
                    title="Toggle Status"
                  >
                    <Badge type={coupon.status || 'inactive'}>
                      
                      {(coupon.status || 'inactive').charAt(0).toUpperCase() +
                        (coupon.status || 'inactive').slice(1)}
                    </Badge>
                  </button>
                )
              },
              {
                header: "Validity", key: "validity", render: (offer) => (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(offer.validity?.startDate).toLocaleDateString()} –{" "}
                    {new Date(offer.validity?.endDate).toLocaleDateString()}
                  </div>
                )
              },
            ]}
            actions={tableActions}
            title="Offers"
          />
        </>
      )}
    </div>
  );
};

export default OffersTable;
