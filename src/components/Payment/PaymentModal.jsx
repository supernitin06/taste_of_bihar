
import React, { useState, useEffect } from 'react';
import InputField from '../ui/InputField';
import {
  FaUser,
  FaEnvelope,
  FaDollarSign,
  FaCreditCard,
  FaCalendarAlt,
  FaIdBadge,
  FaInfoCircle,
  FaGlobe,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUndo,
  FaBan
} from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';
import { SiBitcoin, SiPaypal, SiRazorpay } from 'react-icons/si';

const PaymentModal = ({ isOpen, onClose, onSubmit, paymentData, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    id: paymentData?.id || '',
    customerName: paymentData?.customerName || '',
    customerEmail: paymentData?.customerEmail || '',
    amount: paymentData?.amount || '',
    currency: paymentData?.currency || 'INR',
    paymentMethod: 'credit_card',
    status: 'pending',
    date: paymentData?.date || new Date().toISOString().split('T')[0],
    description: paymentData?.description || '',
    transactionId: paymentData?.transactionId || `TXN${Date.now()}`
  });

  const [errors, setErrors] = useState({});

  // Update form data when paymentData changes
  useEffect(() => {
    if (isOpen) {
      const rawMethod = (paymentData?.paymentMethod || 'upi').toLowerCase();
      const finalMethod = rawMethod === 'cod' ? 'cash' : rawMethod;

      setFormData({
        id: paymentData?.id || '',
        customerName: paymentData?.customerName || '',
        customerEmail: paymentData?.customerEmail || '',
        amount: paymentData?.amount || '',
        currency: paymentData?.currency || 'INR',
        paymentMethod: finalMethod,
        status: paymentData?.status ? paymentData.status.toLowerCase() : 'pending',
        date: (() => {
          try {
            if (!paymentData?.date) return new Date().toISOString().split('T')[0];
            const d = new Date(paymentData.date);
            return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
          } catch (e) {
            return new Date().toISOString().split('T')[0];
          }
        })(),
        description: paymentData?.description || '',
        transactionId: paymentData?.transactionId || paymentData?.paymentId || `TXN${Date.now()}`
      });
    }
  }, [paymentData, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
      setErrors({});
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'failed': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
      case 'refunded': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="inline mr-2" />;
      case 'pending': return <FaClock className="inline mr-2" />;
      case 'failed': return <FaTimesCircle className="inline mr-2" />;
      case 'refunded': return <FaUndo className="inline mr-2" />;
      case 'cancelled': return <FaBan className="inline mr-2" />;
      default: return null;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <FaCreditCard className="text-lg" />;
      case 'paypal': return <SiPaypal className="text-lg text-blue-600" />;
      case 'bank_transfer': return <BsBank className="text-lg" />;
      case 'crypto': return <SiBitcoin className="text-lg text-orange-500" />;
      case 'upi': return <SiRazorpay className="text-lg text-blue-500" />;
      case 'cash': return <FaDollarSign className="text-lg" />;
      default: return <FaCreditCard className="text-lg" />;
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'JPY': return '¥';
      default: return '₹';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 cursor-pointer">

              {/* Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-800 bg-primary">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mode === 'edit' ? 'Edit Payment' : mode === 'create' ? 'Create New Payment' : 'Payment Details'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {mode === 'view' ? 'View payment information' : mode === 'edit' ? 'Update payment details' : 'Add a new payment record'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:rotate-90 active:scale-95"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {mode === 'view' && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(formData.status)}`}>
                      {getStatusIcon(formData.status)}
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      {getPaymentMethodIcon(formData.paymentMethod)}
                      <span className="text-sm">
                        {formData.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Name */}
                      <InputField
                        label="Customer Name"
                        name="customerName"
                        type="text"
                        placeholder="Enter customer name"
                        value={formData.customerName}
                        onChange={handleChange}
                        error={errors.customerName}
                        required={mode !== 'view'}
                        disabled={mode === 'view'}
                        startIcon={<FaUser className="text-gray-400" />}
                        className="md:col-span-2"
                      />

                      {/* Customer Email */}
                      {/* <InputField
                        label="Customer Email"
                        name="customerEmail"
                        type="email"
                        placeholder="customer@example.com"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        error={errors.customerEmail}
                        required={mode !== 'view'}
                        disabled={mode === 'view'}
                        startIcon={<FaEnvelope className="text-gray-400" />}
                      /> */}

                      {/* Amount */}
                      <InputField
                        label="Amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                        error={errors.amount}
                        required={mode !== 'view'}
                        disabled={mode === 'view'}
                        startIcon={<FaDollarSign className="text-gray-400" />}
                        endIcon={
                          <span className="text-sm text-gray-500">
                            {getCurrencySymbol(formData.currency)}
                          </span>
                        }
                        min="0"
                        step="0.01"
                      />

                      {/* Currency */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                          Currency
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <FaGlobe className="text-gray-400" />
                          </div>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 ease-in-out outline-none text-sm font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900 appearance-none"
                          >
                            <option value="INR">🇮🇳 INR (₹)</option>
                            <option value="USD">🇺🇸 USD ($)</option>
                            <option value="EUR">🇪🇺 EUR (€)</option>
                            <option value="GBP">🇬🇧 GBP (£)</option>
                            <option value="JPY">🇯🇵 JPY (¥)</option>
                          </select>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                          Payment Method
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            {getPaymentMethodIcon(formData.paymentMethod)}
                          </div>
                          <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 ease-in-out outline-none text-sm font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900 appearance-none"
                          >
                            <option value="upi">UPI</option>
                            <option value="cash">Cash (COD)</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="crypto">Cryptocurrency</option>
                          </select>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          disabled={mode === 'view'}
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ease-in-out text-sm font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${getStatusColor(formData.status)} focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 appearance-none`}
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="completed">🟢 Completed</option>
                          <option value="failed">🔴 Failed</option>
                          <option value="refunded">🔵 Refunded</option>
                          <option value="cancelled">⚫ Cancelled</option>
                        </select>
                      </div>

                      {/* Transaction ID */}
                      <InputField
                        label="Transaction ID"
                        name="transactionId"
                        type="text"
                        placeholder="Auto-generated"
                        value={formData.transactionId}
                        onChange={handleChange}
                        disabled={mode === 'view' || mode === 'edit'}
                        startIcon={<FaIdBadge className="text-gray-400" />}
                        helperText="Auto-generated for new payments"
                      />

                      {/* Date */}
                      <InputField
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        startIcon={<FaCalendarAlt className="text-gray-400" />}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                        Description
                      </label>
                      <div className="relative group">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FaInfoCircle className="text-gray-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          disabled={mode === 'view'}
                          rows="4"
                          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 ease-in-out outline-none text-sm font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                          placeholder="Add payment description or notes..."
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm p-6">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    {mode === 'view' ? 'Close' : 'Cancel'}
                  </button>
                  {mode !== 'view' && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn btn-primary shadow-sm hover:shadow-md active:shadow-sm"
                    >
                      {mode === 'edit' ? 'Update Payment' : 'Create Payment'}
                      <span className="ml-2">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;