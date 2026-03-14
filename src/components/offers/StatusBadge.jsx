import React from "react";

const StatusBadge = ({ status }) => {
  const map = {
    active: "badge-success",
    inactive: "badge-warning",
    expired: "badge-error"
  };

  return (
    <span className={`badge ${map[status]} capitalize`}>
      {status}
    </span>
  );
};

export default StatusBadge;
