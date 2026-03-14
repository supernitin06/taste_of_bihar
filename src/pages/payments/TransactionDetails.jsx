import React from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ChevronLeft, Download, Mail, RefreshCw } from 'lucide-react';

const TransactionDetails = ({ transaction, onBack }) => {
  if (!transaction) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No transaction selected</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex bg-primary flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white mb-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Transactions
          </button>
          <h1 className="highlight text-2xl font-bold text-white">Transaction Details</h1>
          <p className="text-white/70">ID: {transaction.id}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md rounded-full">
          <Badge type="default" size="lg">{transaction.status}</Badge>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Information</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</label>
                <p className="mt-1 text-gray-900 dark:text-white font-medium">{transaction.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Customer Name</label>
                <p className="mt-1 text-gray-900 dark:text-white">{transaction.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Customer Email</label>
                <p className="mt-1 text-gray-900 dark:text-white">{transaction.customerEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                <p className="mt-1 text-gray-900 dark:text-white text-xl font-bold">₹{transaction.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</label>
                <p className="mt-1 text-gray-900 dark:text-white capitalize">{transaction.paymentMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <Badge type="default">{transaction.status}</Badge>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                <p className="mt-1 text-gray-900 dark:text-white">{transaction.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Currency</label>
                <p className="mt-1 text-gray-900 dark:text-white">{transaction.currency}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</label>
            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">{transaction.description}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="flex gap-3">
              <Button variant="primary" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700">
                <RefreshCw className="w-4 h-4" />
                Refund
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;