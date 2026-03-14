import React from "react";
import { Calendar, User, MessageSquare, Eye, Edit, Trash2 } from "lucide-react";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";
import Table from "../ui/Table";

const TicketsTable = ({ tickets = [], onView }) => {

  const tableActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      color: 'blue',
      onClick: (item) => console.log('View', item), // Placeholder
    },
    {
      key: 'edit',
      label: 'Edit Permissions',
      icon: Edit,
      color: 'purple',
      onClick: () => navigate('/sub-admin/assign'),
    },
    {
      key: 'delete',
      label: 'Delete Admin',
      icon: Trash2,
      color: 'rose',
      onClick: (item) => handleDelete(item.id),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No tickets found.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Total tickets in system: {tickets.length}
          </p>
        </div>
      ) : (
        <>
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Showing {tickets.length} of {tickets.length} tickets
          </div>

          <Table
            title="Support Tickets"
            data={tickets}
            columns={[
              {
                header: "Ticket ID",
                render: (ticket) => (
                  <span className="font-mono text-primary font-medium">
                    {ticket.ticketId}
                  </span>
                ),
              },
              {
                header: "Subject",
                render: (ticket) => (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {ticket.subject}
                    </span>
                  </div>
                ),
              },
              {
                header: "Customer",
                render: (ticket) => (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ticket.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.customerEmail}
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Priority",
                render: (ticket) => (
                  <TicketPriorityBadge priority={ticket.priority} />
                ),
              },
              {
                header: "Status",
                render: (ticket) => (
                  <TicketStatusBadge status={ticket.status} />
                ),
              },
              {
                header: "Created",
                render: (ticket) => (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                ),
              },
              {
                header: "Actions",
                key: "actions",
              },
            ]}
            actions={tableActions}
          />
        </>
      )}
    </div>
  );
};

export default TicketsTable;
