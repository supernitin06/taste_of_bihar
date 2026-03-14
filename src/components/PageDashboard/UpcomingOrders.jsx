import React, { useState } from 'react';
import { ArrowRight, MoreVertical, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useUpdateOrderStatusMutation } from '../../api/services/orderApi';
import { showSuccessAlert, showErrorAlert } from '../../utils/toastAlert';

const UpcomingOrders = ({ title, orders, icon: Icon, color }) => {
    const [actionsMenuOrderId, setActionsMenuOrderId] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // API Mutation
    const [updateOrderStatus] = useUpdateOrderStatusMutation({ refetchOnMountOrArgChange: true });
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
        cooking: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
    };

    const classes = colorClasses[color] || colorClasses.orange;

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
            showSuccessAlert(`Order ${newStatus.toLowerCase()} successfully!`);
            closeMenu();
        } catch (error) {
            console.error(error);
            showErrorAlert("Failed to update order status");
        }
    };

    const toggleMenu = (e, orderId) => {
        e.stopPropagation();
        if (actionsMenuOrderId === orderId) {
            closeMenu();
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX - 140
            });
            setActionsMenuOrderId(orderId);
        }
    };

    const closeMenu = () => {
        setActionsMenuOrderId(null);
        setMenuPosition(null);
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="h-full max-h-[600px] overflow-hidden flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800 transition-all duration-300 relative group ring-1 ring-black/5">

            {/* Background Aesthetic */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-$
{color}-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10 transition-all duration-700`} />

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
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-${color}-500`}></span>
                                </span>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {orders.length} Pending
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
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-200">No New Orders</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">
                            Looks like you're all caught up! Relax for a moment.
                        </p>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <div
                            key={order.orderId} // Use Mongo ID key
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

                            <div className="flex justify-between items-end">
                                <div>
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

                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleMenu(e, order.orderId)} // Pass Mongo ID
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
                                    >
                                        <MoreVertical size={18} />
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

            {/* Portal Dropdown Menu */}
            {actionsMenuOrderId && createPortal(
                <div className="fixed inset-0 z-[9999] isolate" style={{ zIndex: 9999 }}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-transparent" onClick={closeMenu} />

                    {/* The Menu */}
                    <div
                        className="absolute w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-black/5"
                        style={{
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`
                        }}
                    >
                        <div className="p-1 space-y-1">
                            <button
                                onClick={() => handleUpdateStatus(actionsMenuOrderId, 'ACCEPTED')}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <Check size={14} /> Accept Order
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(actionsMenuOrderId, 'REJECTED')}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <X size={14} /> Reject Order
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default UpcomingOrders;
