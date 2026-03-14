import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Download,
  RefreshCw,
  Mail,
  Trash2,
  User,
  Phone,
} from 'lucide-react';
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import PaymentModal from "../../components/Payment/PaymentModal";
import { useGetRecentPaymentsQuery } from "../../api/services/payments";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";

const Transactions = () => {
  const { data: transactionsResponse, isLoading, isError } = useGetRecentPaymentsQuery();

  const rawTransactions = useMemo(() => transactionsResponse?.data || [], [transactionsResponse]);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    status: 'all',
    method: 'all',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterValues]);

  const paymentActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (transaction) => {
        // Map API data to flat structure expected by PaymentModal
        setSelectedTransaction({
          ...transaction,
          id: transaction.paymentId || transaction._id,
          customerName: transaction.userId?.name || transaction.orderId?.customer?.name || 'N/A',
          customerEmail: transaction.userId?.email || 'N/A',
          customerPhone: transaction.userId?.mobile || transaction.orderId?.customer?.phone || 'N/A',
          amount: transaction.amount?.payable || transaction.amount?.total || 0,
          date: transaction.createdAt,
          invoice: transaction.orderId?.orderId || transaction.orderId,
          paymentMethod: (transaction.type && transaction.method && transaction.type !== transaction.method) ? `${transaction.type} - ${transaction.method}` : (transaction.type || transaction.method || transaction.payment?.type || transaction.payment?.method || 'N/A'),
          currency: transaction.currency,
          status: transaction.status,
          description: `Order #${transaction.orderId?.orderId || transaction.orderId || 'N/A'}`
        });
        setIsModalOpen(true);
      },
      color: 'blue',
      show: true
    },

    {
      key: 'download',
      label: 'Download Invoice',
      icon: Download,
      onClick: (transaction) => {
        const orderId = transaction.orderId?.orderId || transaction.orderId || 'N/A';
        alert(`Download Invoice for Order #${orderId} coming soon`);
      },
      color: 'emerald',
      show: true
    },
    {
      key: 'refund',
      label: 'Process Refund',
      icon: RefreshCw,
      onClick: (transaction) => {
        const paymentId = transaction.paymentId || transaction._id || 'N/A';
        const amount = transaction.amount?.payable || transaction.amount?.total || 0;
        alert(`Refunding ₹${amount} for Payment ID: ${paymentId} coming soon`);
      },
      color: 'amber',
      disabled: (transaction) => transaction.status !== 'COMPLETED',
      show: true
    },
    // {
    //   key: 'send-receipt',
    //   label: 'Send Receipt',
    //   icon: Mail,
    //   onClick: (transaction) => {
    //     alert(`Sending receipt to ${transaction.userId?.email || 'N/A'}`);
    //   },
    //   color: 'purple',
    //   show: true
    // },
    // {
    //   key: 'delete',
    //   label: 'Delete',
    //   icon: Trash2,
    //   onClick: (transaction) => {
    //     alert(`Deleting ${transaction.paymentId} coming soon`);
    //   },
    //   color: 'rose',
    //   show: true
    // }
  ];

  // Handle filter changes
  const filteredTransactions = useMemo(() => {
    let filtered = [...rawTransactions];

    // Filter by status
    if (filterValues.status && filterValues.status !== 'all') {
      filtered = filtered.filter(t => t.status?.toUpperCase() === filterValues.status.toUpperCase());
    }

    // Filter by payment method
    if (filterValues.method && filterValues.method !== 'all') {
      filtered = filtered.filter(t => {
        const method = t.type || t.method || t.payment?.type || t.payment?.method || '';
        return method.toLowerCase() === filterValues.method.toLowerCase();
      });
    }

    // Search by customer name or email
    if (filterValues.search) {
      const searchTerm = filterValues.search.toLowerCase();
      filtered = filtered.filter(t =>
        (t.userId?.name || '').toLowerCase().includes(searchTerm) ||
        (t.paymentId || '').toLowerCase().includes(searchTerm) ||
        (t.orderId?.orderId || t.orderId || '').toLowerCase().includes(searchTerm) ||
        (t.method || '').toLowerCase().includes(searchTerm) ||
        (t.type || '').toLowerCase().includes(searchTerm)
      );
    }
    return filtered;
  }, [rawTransactions, filterValues]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  return (
    <div className="min-h-screen page  space-y-8">
      {/* Header */}
      <div className="flex flex-col bg-primary md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">
            Payment Management
          </h1>
          <p className="text-primary opacity-70 mt-2 text-lg font-medium">
            Track and manage all restaurant payments
          </p>
        </div>
        <Button variant="secondary">Export Data</Button>
      </div>

      {/* TODO: Add FilterBar component here if needed */}

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        {isLoading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">Failed to load transactions.</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Total transactions in system: {rawTransactions.length}
            </p>
          </div>
        ) : (
          <>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Showing {filteredTransactions.length} of {rawTransactions.length} transactions
            </div>
            <Table
              data={paginatedTransactions}
              columns={[
                {
                  header: "Customer",
                  key: "customer",
                  render: (transaction) => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg highlight-bg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.userId?.name || transaction.orderId?.customer?.name || 'N/A'}
                        </p>
                        {transaction.paymentId && (
                          <p className="text-xs text-gray-500">#{transaction.paymentId}</p>
                        )}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Amount",
                  key: "amount",
                  render: (transaction) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{Number(transaction.amount?.payable || transaction.amount?.total || 0).toFixed(2)}
                    </span>
                  ),
                },
                {
                  header: "Date",
                  key: "date",
                  render: (transaction) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  ),
                },
                {
                  header: "Method",
                  key: "method",
                  render: (transaction) => {
                    const type = transaction.type || transaction.payment?.type;
                    const method = transaction.method || transaction.payment?.method;
                    const display = (type && method && type !== method) ? `${type} - ${method}` : (type || method || 'N/A');
                    return <Badge>{display}</Badge>;
                  },
                },
                // {
                //   header: "Contact",
                //   key: "contact",
                //   render: (transaction) => (
                //     <div className="space-y-1">
                //       <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                //         <Mail className="w-4 h-4 text-blue-500" />
                //         {transaction.userId?.email || 'N/A'}
                //       </div>
                //       {(transaction.userId?.mobile || transaction.orderId?.customer?.phone) && (
                //         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                //           <Phone className="w-4 h-4 text-green-500" />
                //           {transaction.userId?.mobile || transaction.orderId?.customer?.phone}
                //         </div>
                //       )}
                //     </div>
                //   ),
                // },
                {
                  header: "Status",
                  key: "status",
                  render: (transaction) => (
                    <Badge variant={
                      transaction.status === 'COMPLETED' ? 'success' :
                        transaction.status === 'PENDING' ? 'warning' : 'danger'
                    }>{transaction.status || 'N/A'}</Badge>
                  ),
                },
              ]}
              actions={paymentActions}
              title="Transactions"
            />
            {filteredTransactions.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentData={selectedTransaction}
        mode="view"
      />
    </div>
  );
};

export default Transactions;