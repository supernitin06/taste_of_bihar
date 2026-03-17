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

    const classes = {
        iconBg: 'bg-bihar-red/10',
        text: 'text-bihar-red',
    };

    const statusStyles = {
        placed: 'bg-orange-500/10 text-orange-600',
        preparing: 'bg-blue-500/10 text-blue-600',
        packing: 'bg-indigo-500/10 text-indigo-600',
        confirmed: 'bg-cyan-500/10 text-cyan-600',
        cooking: 'bg-yellow-500/10 text-yellow-600',
        ready: 'bg-green-500/10 text-green-600'
    };

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
        <div className="premium-card flex flex-col group overflow-hidden relative h-full max-h-[600px]">
            {/* Header */}
            <div className="px-8 py-8 flex-shrink-0 border-b border-gray-100 dark:border-white/5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${classes.iconBg} shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                            <Icon size={28} className={classes.text} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-bihar-red dark:text-white font-display uppercase tracking-tight">{title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bihar-red opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-bihar-red shadow-[0_0_10px_rgba(211,47,47,0.5)]"></span>
                                </span>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {orders.length} ACTIVE FLOWS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {orders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-fade-in">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Icon size={40} className="text-gray-200 dark:text-gray-700" />
                        </div>
                        <h4 className="text-xl font-black text-bihar-maroon dark:text-white uppercase tracking-widest">Kitchen is Quiet</h4>
                        <p className="text-xs text-gray-400 mt-2 max-w-[200px] font-bold uppercase tracking-widest leading-loose">
                           All stations are clear and ready.
                        </p>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <div
                            key={order.orderId}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className="relative p-6 rounded-[2rem] bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-bihar-red/20 transition-all duration-500 group/item animate-scaleIn"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="vibrant-gradient text-white px-3 py-1.5 rounded-xl shadow-lg">
                                        <span className="text-[10px] font-black tracking-widest uppercase">#{order.id}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${statusStyles[(order.status || '').toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-bihar-red dark:text-white font-display tracking-tight">₹{(order.amount || 0).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                                <div className="flex-1 w-full sm:w-auto">
                                    <p className="text-lg font-black text-bihar-maroon dark:text-white mb-2">{order.customer}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.time}</span>
                                        <button
                                            onClick={() => toggleExpand(order.orderId)}
                                            className="text-[10px] font-black text-bihar-red uppercase tracking-widest flex items-center gap-1 hover:underline"
                                        >
                                            {order.items ? order.items.length : 0} ITEMS {expandedOrderId === order.orderId ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    <button
                                        onClick={() => handleMarkReady(order.orderId)}
                                        className="flex items-center gap-2 px-6 py-3 vibrant-gradient text-white rounded-2xl shadow-bihari-sm hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <ChefHat size={14} strokeWidth={3} /> COOKING
                                    </button>

                                    <button
                                        onClick={() => handleReject(order.orderId)}
                                        className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            </div>

                            {expandedOrderId === order.orderId && order.items && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 animate-scaleIn">
                                    <ul className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between">
                                                <div className="flex gap-3">
                                                    <span className="font-black text-bihar-red text-xs">{item.quantity}×</span>
                                                    <span className="text-xs font-bold text-bihar-maroon dark:text-gray-300 uppercase tracking-wider">{item.name}</span>
                                                </div>
                                                <span className="text-xs font-black text-bihar-red">₹{item.price}</span>
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
            <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 relative z-10">
                <button
                    onClick={() => navigate('/orders')}
                    className="w-full py-4 rounded-2xl bg-white dark:bg-white/10 text-gray-400 text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-white/5 hover:border-bihar-red hover:text-bihar-red transition-all duration-500 group"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Enter Order Archive
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ConfirmedOrders;
