import React, { useState, useMemo } from 'react';
import {
  Eye,
  RefreshCw,
  Download,
  User,
  Check,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import PaymentModal from '../../components/Payment/PaymentModal';
import { useNavigate } from 'react-router-dom';
import { useGetRefundPaymentsQuery } from '../../api/services/payments';
import { useGetRefundRequestQuery, useRefundAprrovedMutation } from '../../api/services/payments';

const Refunds = () => {
  const navigate = useNavigate();
  const { data: refundResponse, isLoading: refundLoading } = useGetRefundPaymentsQuery();
  const { data: refundRequestResponse, isLoading: refundRequestLoading } = useGetRefundRequestQuery();
  const [refundApproved, { isLoading: isUpdating }] = useRefundAprrovedMutation();

  // Memoize raw data
  const rawRefunds = useMemo(() => refundResponse?.data || [], [refundResponse]);
  const rawRefundRequests = useMemo(() => refundRequestResponse?.data || [], [refundRequestResponse]);

  const [activeTab, setActiveTab] = useState('requests');

  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    data: null
  });

  const [filterValues, setFilterValues] = useState({
    status: 'all',
    membership: 'all',
    method: 'all',
    search: ''
  });

  const handleCreateRefund = () => {
    setSelectedRefund(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    console.log("Submit", data);
    setIsModalOpen(false);
  };

  const handleRefundAction = (refund, type) => {
    setConfirmModal({
      isOpen: true,
      type,
      data: refund
    });
  };

  const confirmRefundAction = async () => {
    if (!confirmModal.data || !confirmModal.type) return;

    try {
      const status = confirmModal.type === 'approve' ? 'APPROVE' : 'REJECT';
      // Use paymentId from the root of request object
      await refundApproved({
        paymentId: confirmModal.data.paymentId || confirmModal.data._id,
        status,
        orderId: confirmModal.data.orderId // Pass orderId as requested
      }).unwrap();

      setConfirmModal({ isOpen: false, type: null, data: null });
    } catch (error) {
      console.error("Failed to update refund status", error);
    }
  };

  // Derive filtered refunds (for Refunded Payments tab)
  const filteredRefunds = useMemo(() => {
    let filtered = [...rawRefunds];

    // Filter by status
    if (filterValues.status && filterValues.status !== 'all') {
      filtered = filtered.filter(r => r.status?.toUpperCase() === filterValues.status.toUpperCase());
    }

    // Filter by refund method
    if (filterValues.method && filterValues.method !== 'all') {
      filtered = filtered.filter(r =>
        (r.refundMethod || r.method || '').toLowerCase().includes(filterValues.method.toLowerCase())
      );
    }

    // Search
    if (filterValues.search) {
      const searchTerm = filterValues.search.toLowerCase();
      filtered = filtered.filter(r =>
        (r.userId?.name || r.name || '').toLowerCase().includes(searchTerm) ||
        (r.reason || '').toLowerCase().includes(searchTerm) ||
        (r._id || '').toLowerCase().includes(searchTerm)
      );
    }
    return filtered;
  }, [rawRefunds, filterValues]);

  // Define actions for refunds table
  const refundActions = [
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (refund) => {
        setSelectedRefund({
          ...refund,
          customerName: refund.userId?.name || refund.name,
          amount: refund.amount?.payable || refund.amount,
        });
        setModalMode('view');
        setIsModalOpen(true);
      },
      color: 'blue',
      show: true
    },
    {
      key: 'download',
      label: 'Download Details',
      icon: Download,
      onClick: () => alert('Download feature coming soon'),
      color: 'emerald',
      show: true
    }
  ];

  // Actions for "Refund Requests" tab
  const refundRequestActions = [
    {
      key: 'approve',
      label: 'Approve',
      icon: Check,
      color: 'green',
      onClick: (refund) => handleRefundAction(refund, 'approve'),
      show: true
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: XCircle,
      color: 'red',
      onClick: (refund) => handleRefundAction(refund, 'reject'),
      show: true
    },
    {
      key: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (refund) => {
        const amount = refund.amount?.payable || refund.amount?.total || refund.amount || 0;
        const date = refund.request?.requestedAt || refund.createdAt;

        setSelectedRefund({
          ...refund,
          customerName: refund.user?.name || refund.userId?.name || 'N/A',
          amount: amount,
          date: date,
          transactionId: refund.paymentId || refund._id,
          status: refund.request?.status || refund.status || 'PENDING',
          description: `Refund Request for Order ${refund.orderId?.orderId || refund.orderId || 'N/A'}. Reason: ${refund.reason || refund.request?.reason || 'N/A'}`
        });
        setModalMode('view');
        setIsModalOpen(true);
      },
      color: 'blue',
      show: true
    }
  ];

  // Calculate stats for Refunded tab
  const totalAmount = filteredRefunds.reduce((sum, r) => {
    const val = typeof r.amount === 'object' ? (r.amount.payable || r.amount.total || 0) : (r.amount || 0);
    return sum + Number(val);
  }, 0);

  if (refundLoading || (activeTab === 'requests' && refundRequestLoading)) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen page space-y-8">
      {/* Header */}
      <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">
            Refunds Management
          </h1>
          <p className="text-primary opacity-70 mt-2 text-lg font-medium">
            Process and manage all refund requests.
          </p>
        </div>
        <Button
          onClick={handleCreateRefund}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Process New Refund
        </Button>
      </div>

      {/* Filter Navigation Tab */}
      <div className="flex space-x-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'requests'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
          Refund Requests
        </button>
        <button
          onClick={() => setActiveTab('refunded')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'refunded'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
          Refunded Payments
        </button>
      </div>

      {/* Refunds Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 cursor-pointer">

        {activeTab === 'refunded' && (
          <>
            {filteredRefunds.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No refunds found.</p>
              </div>
            ) : (
              <>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Showing {filteredRefunds.length} refunds
                </div>
                <Table
                  data={filteredRefunds}
                  columns={[
                    {
                      header: "Customer",
                      key: "customer",
                      render: (refund) => (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg highlight-bg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {refund.user?.name || refund.userId?.name || 'N/A'}
                            </p>
                            {refund.orderId && (
                              <p className="text-xs text-gray-500">Ord: {refund.orderId}</p>
                            )}
                          </div>
                        </div>
                      ),
                    },
                    {
                      header: "Refund Amount",
                      key: "amount",
                      render: (refund) => {
                        // Check if there's a refunds array (new structure) or direct amount
                        const amount = refund.refunds?.[0]?.amount || refund.amount?.payable || refund.amount || 0;
                        return (
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ₹{Number(amount).toFixed(2)}
                          </span>
                        );
                      }
                    },
                    {
                      header: "Refund Date",
                      key: "date",
                      render: (refund) => {
                        const dateStr = refund.refunds?.[0]?.completedAt || refund.refunds?.[0]?.initiatedAt || refund.initiatedAt || refund.createdAt;
                        return (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'}
                          </span>
                        );
                      }
                    },
                    {
                      header: "Status",
                      key: "status",
                      render: (refund) => (
                        <Badge variant="success">
                          {refund.status || 'REFUNDED'}
                        </Badge>
                      ),
                    },
                  ]}
                  actions={refundActions}
                  title="Refunded History"
                />
              </>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {rawRefundRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No refund requests found.</p>
              </div>
            ) : (
              <Table
                data={rawRefundRequests}
                columns={[
                  {
                    header: "Customer",
                    key: "customer",
                    render: (req) => (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {req.user?.name || req.userId?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">{req.user?.mobile || req.userId?.phone || ''}</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Order ID",
                    key: "orderId",
                    render: (req) => (
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {req.orderId?.orderId || req.orderId || ''}
                      </span>
                    ),
                  },
                  {
                    header: "Amount",
                    key: "amount",
                    render: (req) => (
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{typeof req.amount === 'object' ? (req.amount.payable || req.amount.total || 0).toFixed(2) : Number(req.amount || 0).toFixed(2)}
                      </span>
                    ),
                  },
                  {
                    header: "Reason",
                    key: "reason",
                    render: (req) => (
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] block" title={req.reason}>
                        {req.reason || '-'}
                      </span>
                    )
                  },
                  {
                    header: "Status",
                    key: "status",
                    render: (req) => (
                      <Badge variant="warning">
                        {req.request?.isRequested ? (req.request.status || 'REQUESTED') : (req.status || 'PENDING')}
                      </Badge>
                    ),
                  },
                  {
                    header: "Requested At",
                    key: "date",
                    render: (req) => (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(req.request?.requestedAt || req.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs opacity-75">
                          {new Date(req.request?.requestedAt || req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    ),
                  },
                ]}
                actions={refundRequestActions}
                title="New Refund Requests"
              />
            )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        paymentData={selectedRefund}
        mode={modalMode}
      />

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
              {confirmModal.type === 'approve' ? <Check size={24} /> : <AlertTriangle size={24} />}
            </div>

            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
              {confirmModal.type === 'approve' ? 'Approve Refund?' : 'Reject Refund?'}
            </h3>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to <strong>{confirmModal.type}</strong> the refund request?
              {confirmModal.data && (
                <span className="block mt-1 font-semibold">
                  {confirmModal.data.userId?.name || confirmModal.data.user?.name}
                  {confirmModal.data.amount && ` (₹${typeof confirmModal.data.amount === 'object' ? confirmModal.data.amount.payable : confirmModal.data.amount})`}
                </span>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmModal({ isOpen: false, type: null, data: null })}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                className={`border-none ${confirmModal.type === 'approve'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                onClick={confirmRefundAction}
                disabled={isUpdating}
              >
                {isUpdating ? 'Processing...' : (confirmModal.type === 'approve' ? 'Approve' : 'Reject')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Refunds;