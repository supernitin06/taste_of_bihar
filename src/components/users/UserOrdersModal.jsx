import React from 'react';
import { X, Package, Calendar, DollarSign, Clock } from 'lucide-react';
import { useGetUserOrderHistoryQuery } from '../../api/services/userapi';
import GlassCard from '../ui/GlassCard';
import Badge from '../ui/Badge';

const UserOrdersModal = ({ userId, onClose }) => {
    const { data: ordersData, isLoading, isError } = useGetUserOrderHistoryQuery(userId);
    const orders = ordersData?.data || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-cyan-500" />
                        User Orders
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mb-4"></div>
                            <p>Loading orders...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-rose-500">
                            Failed to load orders. Please try again.
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No orders found for this user.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id || order.id}
                                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">#{order.orderId || order._id?.slice(-6)}</span>
                                                <Badge type={getStatusType(order.status)} size="sm">
                                                    {order.status || 'Pending'}
                                                </Badge>
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                                <Clock className="w-3.5 h-3.5 ml-2" />
                                                {new Date(order.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-end gap-1">
                                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Total:</span>
                                                ₹{order.price.itemsTotal || 0}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {order.items?.length || 0} items
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Preview (Optional) */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 uppercase tracking-wider">Items</p>
                                            <div className="space-y-2">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-700 dark:text-gray-300">{item.name || item.menuItemId?.name || 'Item'}</span>
                                                        <span className="text-gray-500 dark:text-gray-500">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <p className="text-xs text-cyan-600 dark:text-cyan-400 italic pt-1">
                                                        +{order.items.length - 3} more items...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Helper for status badge colors
const getStatusType = (status) => {
    if (!status) return 'default';
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('completed')) return 'active'; // Green
    if (s.includes('cancel') || s.includes('failed')) return 'inactive'; // Red
    if (s.includes('process') || s.includes('cooking')) return 'gold'; // Amber
    return 'default';
}

export default UserOrdersModal;
