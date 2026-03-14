import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Bike,
  Loader2,
} from "lucide-react";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import {
  useGetNewDeliveryPartnersQuery,
  useApproveDeliveryPartnerMutation,
  useRejectDeliveryPartnerMutation,
} from "../api/services/deliveryPartnerApi";


const PendingDeliveryPartners = () => {
  const navigate = useNavigate();
  const { data: partnersData, isLoading, isError } = useGetNewDeliveryPartnersQuery();
  const [approvePartner, { isLoading: isApproving }] = useApproveDeliveryPartnerMutation();
  const [rejectPartner, { isLoading: isRejecting }] = useRejectDeliveryPartnerMutation();

  const partners = useMemo(() => {
    if (!partnersData?.success) return [];
    return partnersData.data;
  }, [partnersData]);

  const handleApprove = async (partner) => {
    try {
      await approvePartner(partner._id).unwrap();
      toast.success(`${partner.name} approved successfully!`);
      navigate('/delivery-partners');
    } catch (err) {
      toast.error(err?.data?.message || `Failed to approve ${partner.name}.`);
    }
  };

  const handleReject = async (partner) => {
    try {
      await rejectPartner(partner._id).unwrap();
      toast.success(`${partner.name} rejected successfully.`);
    } catch (err) {
      toast.error(err?.data?.message || `Failed to reject ${partner.name}.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <p className="text-lg font-medium mt-4">Pending partners load ho rahe hain...</p>
      </div>
    );
  }

  if (isError || !partners.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <p className="text-lg font-medium">No pending delivery partners</p>
        <p className="text-sm">All requests are processed 🎉</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">
        Pending Delivery Partners
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {partners.map((partner) => (
          <div
            key={partner._id}
            className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* TOP GRADIENT BAR */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6 flex flex-col h-full">
              {/* HEADER */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <img
                    src={partner.image}
                    alt={partner.name || 'Partner'}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow bg-gray-200"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full" />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-bold leading-tight">
                    {partner.name}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Bike size={14} />
                    {partner.vehicleType}
                  </p>
                </div>

                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </div>

              {/* INFO */}
              <div className="grid grid-cols-1 gap-3 text-sm mb-6">
                <Info icon={Phone} value={partner.phone} />
                <Info icon={Mail} value={partner.email} />
                <Info icon={MapPin} value={partner.cityArea || 'N/A'} />
                <Info icon={ShieldCheck} value={`KYC ${partner.kyc?.status || 'PENDING'}`} />
                <Info icon={CalendarDays} value={`Joined on ${new Date(partner.createdAt).toLocaleDateString()}`} />
              </div>

              {/* ACTIONS */}
              <div className="mt-auto grid grid-cols-2 gap-3">
                <Button
                  variant="success"
                  loading={isApproving}
                  onClick={() => handleApprove(partner)}
                >
                  Approve
                </Button>

                <Button
                  loading={isRejecting}
                  variant="danger"
                  onClick={() => handleReject(partner)}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Info = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl">
    <Icon size={15} className="text-indigo-500 shrink-0" />
    <span className="text-gray-700 dark:text-gray-300">
      {value || "N/A"}
    </span>
  </div>
);

export default PendingDeliveryPartners;
