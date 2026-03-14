import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Truck,
  Bike,
  Shield,
  Calendar,
  FileText,
} from "lucide-react";
import Button from "../ui/Button";
import DeliveryPartnerStatusBadge from "./DeliveryPartnerStatusBadge";

const DeliveryPartnerDetailsModal = ({
  partner,
  onClose,
  updatePartner,
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);

  if (!partner) return null;

  /* CORRECT DESTRUCTURING (NORMALIZED DATA ONLY) */
  const {
    partnerId,
    registrationData = {},
    listView = {},
    orderHistory = [],
    documents = [],
  } = partner;

  const {
    name,
    mobileNumber,
    email,
    cityArea,
    image,
    createdAt,
    vehicleType: regVehicleType,
  } = registrationData;

  const {
    status,
    kycStatus,
    vehicleType,
    vehicleNumber,
    fullAddress,
  } = listView;

  const toggleStatus = () => {
    const isActive = partner.isActive ?? listView.isAccountActive;
    const newIsActive = !isActive;
    const newStatus = newIsActive ? "Active" : "Inactive";

    updatePartner({
      ...partner,
      isActive: newIsActive,
      listView: { ...listView, status: newStatus, isAccountActive: newIsActive },
    });
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center p-5 border-b bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <img
                src={
                  image ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerId}`
                }
                className="w-12 h-12 rounded-xl border"
                alt="avatar"
              />
              <div>
                <h2 className="font-bold text-lg">
                  {name || "N/A"}
                </h2>
                <p className="text-xs text-gray-500">
                  Partner ID: {partnerId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DeliveryPartnerStatusBadge status={status} />
              <button onClick={onClose}>
                <X />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

            {/* BASIC DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail
                icon={Phone}
                label="Phone"
                value={mobileNumber}
              />

              <Detail
                icon={Mail}
                label="Email"
                value={email}
              />

              <Detail
                icon={MapPin}
                label="Address"
                value={fullAddress || cityArea}
              />

              <Detail
                icon={vehicleType === "BIKE" ? Bike : Truck}
                label="Vehicle"
                value={`${vehicleType || regVehicleType || "N/A"} ${vehicleNumber ? `(${vehicleNumber})` : ""
                  }`}
              />

              <Detail
                icon={Shield}
                label="KYC Status"
                value={kycStatus}
              />

              {/* <Detail
                icon={Calendar}
                label="Joined On"
                value={
                  createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "N/A"
                }
              /> */}
            </div>

            {/* DOCUMENTS */}
            <div>
              <h3 className="font-bold mb-3">Documents</h3>

              {documents.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.type}
                      className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-700"
                    >
                      <div
                        className="h-32 flex items-center justify-center bg-white dark:bg-gray-800 rounded cursor-pointer"
                        onClick={() => setSelectedDoc(doc.url)}
                      >
                        {doc.url?.endsWith(".pdf") ? (
                          <FileText size={36} />
                        ) : (
                          <img
                            src={doc.url}
                            alt={doc.type}
                            className="h-full object-contain"
                          />
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="font-semibold capitalize">
                          {doc.type?.replace("_", " ")}
                        </p>

                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${doc.status === "VERIFIED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {doc.status}
                        </span>

                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-xs text-blue-500 mt-1"
                        >
                          View / Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No documents uploaded
                </p>
              )}
            </div>

            {/* ORDER HISTORY */}
            <div>
              <h3 className="font-bold mb-2">Order History</h3>

              {orderHistory.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No orders assigned yet
                </p>
              ) : (
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(orderHistory[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order, idx) => (
                      <tr key={idx} className="border-t">
                        {Object.values(order).map((val, i) => (
                          <td key={i} className="px-3 py-2">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 dark:bg-gray-900">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              variant={status === "Active" ? "danger" : "success"}
              onClick={toggleStatus}
            >
              {status === "Active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setSelectedDoc(null)}
        >
          <img
            src={selectedDoc}
            className="max-h-[90vh] max-w-[90vw] rounded"
            alt="doc"
          />
        </div>
      )}
    </>
  );
};

/* SMALL DETAIL COMPONENT */
const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold break-words">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default DeliveryPartnerDetailsModal;
