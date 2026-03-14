import React, { useState, useMemo } from 'react';
import {
  Eye,
  Trash2,
  Mail,
  Download,
  Printer,
  FileText,
  CheckCircle,
  Edit
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { User, Phone, ShoppingBag } from 'lucide-react';
import FilterBar from '../../components/ui/UserFilters';
import PaymentModal from '../../components/Payment/PaymentModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useGetInvoicesQuery, useDeleteInvoiceMutation } from '../../api/services/invoice';
import { showSuccessAlert, showErrorAlert } from '../../utils/toastAlert';

const Invoice = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Confirmation Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const [filterValues, setFilterValues] = useState({
    status: 'all',
    membership: 'all',
    method: 'all',
    search: ''
  });

  // API Hooks
  const { data: invoiceData, isLoading, error } = useGetInvoicesQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  // Determine the source list of invoices
  const rawInvoices = useMemo(() => {
  if (Array.isArray(invoiceData)) return invoiceData;
  if (Array.isArray(invoiceData?.data)) return invoiceData.data;
  return [];
}, [invoiceData]);


  // Derive filtered invoices using useMemo
  const filteredInvoices = useMemo(() => {
    let filtered = [...rawInvoices];

    // Filter by status (Payment Status)
    if (filterValues.status && filterValues.status !== 'all') {
      filtered = filtered.filter(inv => inv.payment?.status === filterValues.status);
    }

    // Filter by payment method
    if (filterValues.method && filterValues.method !== 'all') {
      filtered = filtered.filter(inv =>
        inv.payment?.method?.toLowerCase() === filterValues.method.toLowerCase()
      );
    }

    // Search by customer name or invoice ID
    if (filterValues.search) {
      const searchTerm = filterValues.search.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.customerDetails?.name?.toLowerCase().includes(searchTerm) ||
        inv.invoiceNumber?.toLowerCase().includes(searchTerm)
      );
    }
    return filtered;
  }, [rawInvoices, filterValues]);

  // Map invoice data to PaymentModal format
  const mapInvoiceToModalData = (inv) => ({
    id: inv._id,
    customerName: inv.customerDetails?.name || 'N/A',
    customerEmail: inv.customerDetails?.email || '',
    amount: inv.amount?.grandTotal || 0,
    currency: 'INR',
    paymentMethod: inv.payment?.method?.toLowerCase() || 'cash',
    status: inv.payment?.status?.toLowerCase() || 'pending',
    date: inv.invoiceDate ? new Date(inv.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: `Invoice #${inv.invoiceNumber}`,
    transactionId: inv.invoiceNumber
  });

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(mapInvoiceToModalData(invoice));
    setModalMode('view');
    setModalOpen(true);
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleModalSubmit = (data) => {
    console.log("Modal submit", data);
    setModalOpen(false);
  };

  const initiateDeleteInvoice = (id) => {
    setInvoiceToDelete(id);
    setConfirmModalOpen(true);
  };

  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete).unwrap();
      showSuccessAlert('Invoice deleted successfully');
      setConfirmModalOpen(false);
      setInvoiceToDelete(null);
    } catch (err) {
      showErrorAlert('Failed to delete invoice');
      console.error(err);
    }     
  };

  const handleSendInvoice = (invoice) => {
    alert(`Invoice ${invoice.invoiceNumber} sent`);
  };

  // Define actions for invoices table
  const invoiceActions = [
    {
      key: 'view',
      label: 'View Invoice',
      icon: Eye,
      onClick: (invoice) => {
        handleViewInvoice(invoice);
      },
      color: 'blue',
      show: true
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: Trash2,
      onClick: (invoice) => {
        initiateDeleteInvoice(invoice._id);
      },
      color: 'rose',
      show: true
    }
  ];

  const onFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({
      status: 'all',
      membership: 'all',
      method: 'all',
      search: ''
    });
  };

  // Calculate summary stats
  const totalAmount = filteredInvoices.reduce((sum, inv) => {
    return sum + (inv.amount?.grandTotal || 0);
  }, 0);

  if (isLoading) {
    return <div className="p-8 text-center">Loading invoices...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading invoices</div>;
  }

  return (
    <div className="min-h-screen page space-y-8">
      {/* Header */}
      <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div>
          <h1 className="highlight text-4xl font-extrabold tracking-tight">
            Payment Management
          </h1>
          <p className="text-primary opacity-70 mt-2 text-lg font-medium">
            Track and manage all restaurant payments
          </p>
        </div>
        <Button
          onClick={handleCreateInvoice}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Create New Invoice
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          search={{
            value: filterValues.search,
            placeholder: "Search by name, invoice ID...",
            onChange: (val) => onFilterChange('search', val)
          }}
          filters={[
            {
              key: 'status',
              value: filterValues.status,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'PAID', label: 'Paid' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'FAILED', label: 'Failed' }
              ]
            },
            {
              key: 'method',
              value: filterValues.method,
              options: [
                { value: 'all', label: 'All Methods' },
                { value: 'UPI', label: 'UPI' },
                { value: 'CASH', label: 'Cash' },
                { value: 'CARD', label: 'Card' }
              ]
            }
          ]}
          onFilterChange={onFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Invoices</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Showing {filteredInvoices.length} invoices • Total: ₹{totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="p-4">
          <Table
            data={filteredInvoices}
            columns={[
              {
                header: "Customer",
                key: "customer",
                render: (invoice) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg highlight-bg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{invoice.customerDetails?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Amount",
                key: "amount",
                render: (invoice) => (
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{invoice.amount?.grandTotal || 0}
                  </span>
                ),
              },
              {
                header: "Date",
                key: "date",
                render: (invoice) => (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                ),
              },
              {
                header: "Method",
                key: "method",
                render: (invoice) => <Badge>{invoice.payment?.method || 'N/A'}</Badge>,
              },
              {
                header: "Contact",
                key: "contact",
                render: (invoice) => (
                  <div className="space-y-1">
                    {invoice.customerDetails?.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-green-500" />
                        {invoice.customerDetails.phone}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                header: "Status",
                key: "status",
                render: (invoice) => <Badge>{invoice.payment?.status || 'PENDING'}</Badge>,
              },
            ]}
            actions={invoiceActions}
          />
        </div>
      </div>

      {/* Payment Modal for Invoices */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        paymentData={selectedInvoice}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeleteInvoice}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};

export default Invoice;