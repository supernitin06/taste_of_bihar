import React from 'react';

const TicketPriorityBadge = ({ priority }) => {
  const styles = {
    urgent: "badge-error",
    high: "badge-warning",
    medium: "badge-info",
    low: "badge-ghost",
  };

  return (
    <span className={`badge ${styles[priority] || 'badge-ghost'} badge-sm capitalize`}>
      {priority}
    </span>
  );
};

export default TicketPriorityBadge;