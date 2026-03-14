import React from "react";

const DeliveryPartnerStatusBadge = ({ status }) => {
  const colors = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
};

export default DeliveryPartnerStatusBadge;
