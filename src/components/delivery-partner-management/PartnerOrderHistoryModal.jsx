import React, { useMemo } from 'react';
import { useGetdeliveryPartnerOrdersQuery } from "../../api/services/deliveryPartnerApi";
import { X, Calendar, MapPin, DollarSign, Package, CheckCircle, Clock } from "lucide-react";
import Button from "../ui/Button";

const PartnerOrderHistoryModal = ({ partnerId, onClose }) => {
    const { data: ordersData, isLoading, isError } = useGetdeliveryPartnerOrdersQuery(partnerId);
    const orders = ordersData?.data || [];

    // Helper for status colors
    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED':
            case 'COMPLETED':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'PENDING':
            case 'PLACED':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'ASSIGNED':
            case 'OUT_FOR_DELIVERY':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'READY':
            case 'READY_FOR_PICKUP':
                return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Order History
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Partner ID: #{partnerId?.slice(-6)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-red-500 dark:text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <p className="text-gray-500 text-sm">Loading order history...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl">
                            <p>Failed to load order history. Please try again.</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Package size={32} />
                            </div>
                            <h3 className="text-gray-900 dark:text-white font-medium">No Orders Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">This partner hasn't completed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, index) => (
                                <div
                                    key={order._id}
                                    className="group p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-primary/20 hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                        {/* Serial Number */}
                                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 w-8 text-center">
                                            {index + 1}.
                                        </div>

                                        {/* Order ID & Status */}
                                        <div className="space-y-2 min-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                                    #{order.orderId || order._id?.slice(-8)}
                                                </span>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-[180px]">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <Clock size={14} className="text-gray-400 ml-2" />
                                            <span>
                                                {(() => {
                                                    try {
                                                        const date = new Date(order.createdAt);
                                                        return !isNaN(date.getTime())
                                                            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                            : '';
                                                    } catch (e) {
                                                        return '';
                                                    }
                                                })()}
                                            </span>
                                        </div>

                                        {/* Cost */}
                                        <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white min-w-[100px]">
                                            <DollarSign size={14} className="text-primary" />
                                            <span>{order.price?.grandTotal?.toFixed(2) || '0.00'}</span>
                                        </div>

                                        {/* Details Button */}
                                        <Button variant="ghost" size="sm" className="text-xs">
                                            View Details
                                        </Button>
                                    </div>

                                    {/* Order Items Summary */}
                                    <div className="mt-3 py-2 border-t border-b border-gray-50 dark:border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Items</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items?.map((item, i) => (
                                                <span key={i} className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">
                                                    {item.quantity} x {item.name}
                                                </span>
                                            ))}
                                            {(!order.items || order.items.length === 0) && <span className="text-xs text-gray-400">No items listed</span>}
                                        </div>
                                    </div>

                                    {/* Pickup/Dropoff & Payment */}
                                    <div className="mt-3 flex flex-col md:flex-row gap-6 text-sm">

                                        {/* Dropoff (Customer) */}
                                        {order.deliveryAddress && (
                                            <div className="flex gap-2 min-w-[200px]">
                                                <div className="min-w-[6px] w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Deliver To</p>
                                                    <p className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">{order.deliveryAddress.name || order.customer?.name || "Customer"}</p>
                                                    <p className="text-gray-500 text-xs truncate max-w-[200px]">
                                                        {order.deliveryAddress.addressLine || order.deliveryAddress.addressLine1 || ""}
                                                        {order.deliveryAddress.city ? `, ${order.deliveryAddress.city}` : ''}
                                                    </p>
                                                    <p className="text-gray-400 text-[10px] mt-0.5">
                                                        {order.deliveryAddress.phone || order.customer?.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Info */}
                                        <div className="flex gap-2">
                                            <div className="min-w-[6px] w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Payment</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
                                                        {order.payment?.type || "COD"}
                                                    </span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${order.payment?.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.payment?.status || "PENDING"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <Button onClick={onClose} variant="ghost" className="hover:bg-white dark:hover:bg-gray-700">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PartnerOrderHistoryModal;
