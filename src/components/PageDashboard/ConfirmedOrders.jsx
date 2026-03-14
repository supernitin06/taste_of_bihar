import React, { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, ChevronDown, ChevronUp, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUpdateKitchenStatusMutation, useUpdateOrderStatusMutation } from '../../api/services/orderApi';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../../utils/toastAlert';

const ConfirmedOrders = ({ title, orders, icon: Icon, color }) => {
    
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Mutations
    const [updateKitchenStatus] = useUpdateKitchenStatusMutation();

    const [updateOrderStatus] = useUpdateOrderStatusMutation(); // For Reject if needed

    const navigate = useNavigate();

    const colorClasses = {
        orange: {
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            text: 'text-orange-600 dark:text-orange-400',
            iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        },
    };

    const statusStyles = {
        placed: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        packing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        confirmed: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
        cooking: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
        ready: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
    };

    const classes = colorClasses[color] || colorClasses.blue;

    const handleMarkReady = async (orderId) => {
        try {
            await updateKitchenStatus({ orderId, status: "PREPARING" }).unwrap();
            showSuccessAlert("Order Marked as PREPARING");
        } catch (err) {
            console.error(err);
            showErrorAlert("Failed to mark as PREPARING");
        }
    };

    const handleReject = async (orderId) => {
        const result = await showConfirmAlert("Are you sure you want to reject this confirmed order?");
        if (!result.isConfirmed) return;

        try {
            await updateOrderStatus({ id: orderId, status: "REJECTED" }).unwrap();
            showSuccessAlert("Order Marked as REJECTED");
        } catch (err) {
            console.error(err);
            showErrorAlert("Failed to mark as REJECTED");
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="h-full max-h-[600px] overflow-hidden flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800 transition-all duration-300 relative group ring-1 ring-black/5">

            {/* Background Aesthetic */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-${color}-500/20 to-teal-500/20 rounded-full blur-[80px] -z-10 transition-all duration-700`} />

            {/* Header */}
            <div className="px-6 py-5 flex-shrink-0 border-b border-gray-100/50 dark:border-gray-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${classes.iconBg} backdrop-blur-md shadow-lg shadow-${color}-500/10 ring-1 ring-black/5 ring-inset group-hover:scale-105 transition-transform duration-500 ease-out`}>
                            <Icon size={26} className={classes.text} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">{title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`flex w-2 h-2 rounded-full bg-${color}-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]`}></span>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {orders.length} In Progress
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 scroll-smooth">
                {orders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                            <Icon size={40} className="text-gray-300 dark:text-gray-600 opacity-50" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-200">No Active Orders</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
                            The kitchen is quiet. Time to prep for the rush!
                        </p>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <div
                            key={order.orderId}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className="relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-800/30 animate-in slide-in-from-bottom-2 fill-mode-backwards"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-lg shadow-md">
                                        <span className="text-xs font-bold tracking-wider">#{order.id}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ring-1 ring-inset ring-black/5 ${statusStyles[(order.status || '').toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-extrabold ${classes.text} tracking-tight`}>₹{(order.amount || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-0">
                                <div className="flex-1 w-full sm:w-auto">
                                    <p className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 leading-none">{order.customer}</p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                        <span>{order.time}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                        <button
                                            onClick={() => toggleExpand(order.orderId)}
                                            className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none"
                                        >
                                            {order.items ? order.items.length : 0} Items
                                            {expandedOrderId === order.orderId ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:pl-2">
                                    {/* Action Buttons */}
                                    <button
                                        onClick={() => handleMarkReady(order.orderId)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md shadow-green-200 dark:shadow-none transition-all duration-200 text-xs font-bold"
                                        title="Mark as Ready"
                                    >
                                        <ChefHat size={14} /> PREPARING
                                    </button>

                                    <button
                                        onClick={() => handleReject(order.orderId)}
                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all duration-200"
                                        title="Reject Order"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details Accordion */}
                            {expandedOrderId === order.orderId && order.items && (
                                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <ul className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                                                <div className="flex gap-2">
                                                    <span className="font-bold text-gray-400 dark:text-gray-500">{item.quantity}x</span>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span className="font-medium">₹{item.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-100/50 dark:border-gray-800/50">
                <button
                    onClick={() => navigate('/orders')}
                    className="group relative w-full py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        View All Orders
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </div>
        </div>
    );
};
export default ConfirmedOrders;
