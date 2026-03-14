import React, { useState } from 'react';
import supportData from '../assets/json/supportTickets.json';
import { normalizeTicket } from '../utils/normalizeTicket';
import SearchFilter from '../components/support/SearchFilter';
import TicketsTable from '../components/support/TicketsTable';
import TicketDetailModal from '../components/support/TicketDetailModal';
import { MessageSquare } from 'lucide-react';

const SupportManagement = () => {
  const [tickets, setTickets] = useState(supportData.supportTickets.ticketsList.map(normalizeTicket));

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    const searchMatch = [t.ticketId, t.subject, t.customerName, t.customerEmail]
      .join(' ').toLowerCase().includes(searchText.toLowerCase());
    const statusMatch = filterStatus ? t.status === filterStatus : true;
    const priorityMatch = filterPriority ? t.priority === filterPriority : true;
    return searchMatch && statusMatch && priorityMatch;
  });

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
  };

  const handleReply = (ticketId, message) => {
    setTickets(prev => prev.map(t => t.ticketId === ticketId ? {
      ...t,
      conversation: [...t.conversation, {
        id: t.conversation.length + 1,
        sender: 'admin',
        message,
        timestamp: new Date().toISOString(),
        attachments: []
      }]
    } : t));
  };

  const handleCloseTicket = (ticketId) => {
    setTickets(prev => prev.map(t => t.ticketId === ticketId ? { ...t, status: 'closed' } : t));
    closeModal();
  };

  return (
    <div className="page">
      <div className="flex bg-primary  flex-col mb-6 md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Support & Tickets
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage and respond to customer support tickets.</p>
        </div>
      </div>

      <SearchFilter
        searchText={searchText}
        setSearchText={setSearchText}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      <TicketsTable
        tickets={filteredTickets}
        onView={openModal}
        onReply={openModal}
        onClose={handleCloseTicket}
      />

      <TicketDetailModal
        isOpen={isModalOpen}
        ticket={selectedTicket}
        onClose={closeModal}
        onReply={handleReply}
        onCloseTicket={handleCloseTicket}
      />
    </div>
  );
};

export default SupportManagement;