// Orders.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Loader2, Eye, Trash2, CheckCircle, XCircle, Clock, Bike, CreditCard } from 'lucide-react';
import AllOrderCards from '../components/OrderPages/OderCards';
import OrderFormModal from '../components/OrderPages/OrderForm';
import OrderFilters from '../components/OrderPages/OrderFilters';
import OrderDetailsModal from '../components/OrderPages/OrderDetailsModal';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { useGetOrdersQuery } from '../api/services/orderApi';

const Orders = () => {
  const { authToken } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    status: 'all',
  });
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('ordersViewMode') || 'grid');
  const [showAddForm, setShowAddForm] = useState(false);
  // const [editingOrder, setEditingOrder] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('ordersViewMode', viewMode);
  }, [viewMode]);

  // Fetch data from API
  const { data, isLoading, isError, error } = useGetOrdersQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery,
      status: filters.status === "all" ? undefined : (filters.status === "rejected" ? "REJECTED" : filters.status.toUpperCase()),
    },
    {
      skip: !authToken, // Do not run query if user is not logged in
    }
  );
  const apiResponse = data;

  console.log("API Response:", apiResponse, "Error:", error);
  const [orders, setOrders] = useState([]);

  // Normalize API data to match UI structure
  const normalizeOrder = (apiOrder) => {
    const address = apiOrder.deliveryAddress;
    let formattedAddress = 'N/A';
    if (address) {
      if (typeof address === 'string') formattedAddress = address;
      else if (typeof address === 'object') {
        formattedAddress = `${address.addressLine || ''}, ${address.city || ''} ${address.pincode || ''}`;
      }
    }

    return {
      id: apiOrder._id,
      date: new Date(apiOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(apiOrder.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),

      customer: apiOrder.customer?.name || 'Unknown',
      customerPhone: apiOrder.customer?.phone || 'N/A',
      customerAddress: formattedAddress,

      orderId: apiOrder.orderId ? (apiOrder.orderId.startsWith('ORD') ? `#${apiOrder.orderId.split('-')[1]}` : apiOrder.orderId) : `#${apiOrder._id.slice(-6).toUpperCase()}`,
      fullOrderId: apiOrder.orderId,
      status: apiOrder.status || 'PENDING',
      type: apiOrder.source === 'web' ? 'Delivery' : 'Dine-in',

      paymentMethod: apiOrder.payment?.method || 'N/A',
      paymentStatus: apiOrder.payment?.status || 'PENDING',

      restaurant: {
        id: apiOrder.restaurant,
        branch: apiOrder.branch
      },

      deliveryPartner: apiOrder.delivery?.partner ? {
        id: apiOrder.delivery.partner._id,
        name: apiOrder.delivery.partner.name,
        phone: apiOrder.delivery.partner.phone,
        assignedAt: apiOrder.delivery.assignedAt
      } : null,

      items: (apiOrder.items || []).map((item, idx) => ({
        id: item.itemId || idx,
        name: item.name,
        quantity: item.quantity,
        price: item.finalItemPrice || 0,
        addons: item.addons || []
      })),

      timeline: apiOrder.timeline || [], // Pass timeline for the visualization

      // Price details
      price: apiOrder.price || {},
      // Price details
      itemsTotal: apiOrder.price?.itemsTotal || 0,
      deliveryFee: apiOrder.price?.deliveryFee || 0,
      discount: apiOrder.price?.discount || 0,
      grandTotal: apiOrder.price?.grandTotal || 0,
      tax: apiOrder.price?.tax || 0,
      total: apiOrder.price?.grandTotal || 0
    };
  };

  // Sync API data to local state when fetched
  useEffect(() => {
    if (apiResponse?.data) {
      const normalized = apiResponse.data.map(normalizeOrder);
      setOrders(normalized);
    }
  }, [apiResponse]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all' });
    setSearchQuery('');
    setCurrentPage(1);
  };


  const filteredOrders = orders;

  const totalPages = apiResponse?.meta?.total
    ? Math.ceil(apiResponse.meta.total / itemsPerPage)
    : 1;

  // If using server-side pagination, currentOrders is just the fetched orders
  const currentOrders = orders;

  // Add new order
  const handleAddOrder = (newOrder) => {
    // Note: This only updates local state. You should implement a mutation for real backend update.
    const orderWithId = {
      ...newOrder,
      id: orders.length + 1,
      orderId: `#ORDER${orders.length + 24}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      restaurant: orders[0]?.restaurant || { name: 'Default' },
      subtotal: newOrder.total,
      deliveryFee: newOrder.type === 'Delivery' ? 5.00 : 0,
      tax: newOrder.total * 0.08,
      total: newOrder.total + (newOrder.type === 'Delivery' ? 5.00 : 0) + (newOrder.total * 0.08)
    };
    setOrders([...orders, orderWithId]);
    setShowAddForm(false);
  };

  // Update order
  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setEditingOrder(null);
  };

  // Delete order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  // Update order status
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Helper for status colors in Table
  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'ON-PROCESS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PREPARING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      CONFIRMED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      PLACED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      ACCEPTED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      ASSIGNED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      PICKED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      READY: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    const style = styles[status] || styles['ON-PROCESS'];
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${style}`}>
        {status}
      </span>
    );
  };

  // Table Columns Definition
  const columns = [
    {
      header: 'Order Info',
      render: (order) => (
        <div>
          <span className="font-bold text-primary">{order.orderId}</span>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Clock size={12} /> {order.date} • {order.time}
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      render: (order) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{order.customer}</div>
          <div className="text-xs text-gray-500">{order.customerPhone}</div>
        </div>
      )
    },

    {
      header: 'Items',
      render: (order) => (
        <div className="flex flex-col gap-1 min-w-[120px]">
          {order.items.slice(0, 2).map((item, idx) => (
            <span key={idx} className="text-gray-700 dark:text-gray-300 text-xs truncate" title={item.name}>
              {item.name}
            </span>
          ))}
          {order.items.length > 2 && (
            <span
              className="text-xs text-primary font-medium cursor-pointer hover:underline"
              onClick={() => setViewingOrder(order)}
            >
              +{order.items.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Quantity',
      render: (order) => (
        <div className="flex flex-col gap-1 min-w-[60px]">
          {order.items.slice(0, 2).map((item, idx) => (
            <span key={idx} className="text-gray-800 dark:text-gray-200 text-xs">
              {item.quantity}
            </span>
          ))}
          {order.items.length > 2 && <span className="text-xs text-gray-500">{/* placeholder */}</span>}
        </div>
      ),
    },
    {
      header: 'Details',
      render: (order) => (
        <div className="flex flex-col gap-1.5">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold inline-flex">
            {order.type}
          </span>
          {order.table && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold inline-flex">
              {order.table}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      render: (order) => getStatusBadge(order.status)
    },
    {
      header: 'Payment',
      render: (order) => (
        <div className="text-xs">
          {/* Total Amount */}
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 dark:text-gray-200">
            ${order.total.toFixed(2)}
          </div>

          {/* Payment Method */}
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
            <CreditCard size={13} className="text-green-500" />
            {order.paymentMethod}
          </div>
        </div>
      )
    },
    {
      header: 'Delivery Partner',
      render: (order) => (
        <div className="text-xs">
          {order.deliveryPartner ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Bike size={13} className="text-purple-500" />
                <span className="font-medium">{order.deliveryPartner.name}</span>
              </div>
              <div className="flex items-center gap-2 ml-5">
                <span className="text-gray-400">📞 {order.deliveryPartner.phone}</span>
                <span className="text-gray-400">
                  🕒 Assigned: {new Date(order.deliveryPartner.assignedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-500">
              <Bike size={13} className="text-purple-500" />
              Not Assigned
            </div>
          )}
        </div>
      )
    },


    {
      header: 'Actions',
      render: (order) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setViewingOrder(order)} className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors" title="View">
            <Eye size={16} />
          </button>
          {/* <button onClick={() => setEditingOrder(order)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors" title="Edit">
            <Edit size={16} />
          </button> */}
          {['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'ON-PROCESS'].includes(order.status) && (
            <>
              <button onClick={() => handleUpdateStatus(order.id, 'COMPLETED')} className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 transition-colors" title="Complete">
                <CheckCircle size={16} />
              </button>
              <button onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors" title="Cancel">
                <XCircle size={16} />
              </button>
            </>
          )}
          <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="app page">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
            <div>
              <h1 className="highlight text-4xl font-extrabold tracking-tight">
                Orders Management
              </h1>
              <p className="text-primary opacity-70 mt-2 text-lg font-medium">
                Track and manage all restaurant orders
              </p>
            </div>

            {/* <Button
              onClick={() => setShowAddForm(true)}
              variant="primary"
            >
              <Plus size={20} />
              Add New Order
            </Button> */}
          </div>
        </div>

        {/* Filters */}
        <OrderFilters
          searchTerm={searchQuery}
          onSearch={setSearchQuery} // Changed from onSearch
          filters={filters} // Pass filters object
          onFilterChange={handleFilterChange} // Pass handler
          onClearFilters={handleClearFilters} // Pass handler
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Orders Grid/List */}
        {!authToken ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 font-semibold">Access Denied</p>
            <p className="text-gray-500 mt-2">Please log in to view orders.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-2xl text-red-500 font-semibold">Unable to load orders</p>
            <p className="text-gray-500 mt-2">
              {error?.status === 401 ? "Unauthorized: Please log in again." : (error?.data?.message || "An error occurred.")}
            </p>
          </div>
        ) : (
          viewMode === 'list' ? (
            <div className="mt-8">
              <Table columns={columns} data={currentOrders} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {currentOrders.map(order => (
                <AllOrderCards
                  key={order.id}
                  order={order}
                  onDelete={handleDeleteOrder}
                  // onEdit={() => setEditingOrder(order)}
                  onUpdateStatus={handleUpdateStatus}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )
        )}

        {authToken && !isLoading && !isError && currentOrders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 font-semibold">No orders found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or add a new order</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Add/Edit Order Modal */}
        {/* {(showAddForm || editingOrder) && (
          <OrderFormModal
            order={editingOrder}
            onClose={() => {
              setShowAddForm(false);
              setEditingOrder(null);
            }}
            onSubmit={editingOrder ? handleUpdateOrder : handleAddOrder}
          />
        )} */}

        {/* View Details Modal */}
        {viewingOrder && (
          <OrderDetailsModal
            order={viewingOrder}
            onClose={() => setViewingOrder(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;