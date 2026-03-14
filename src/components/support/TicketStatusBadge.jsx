import React from 'react';

const TicketStatusBadge = ({ status }) => {
  const styles = {
    open: "badge-error",
    pending: "badge-warning",
    resolved: "badge-success",
    closed: "badge-ghost",
  };

  return (
    <span className={`badge ${styles[status] || 'badge-ghost'} capitalize`}>
      {status}
    </span>
  );
};

export default TicketStatusBadge;