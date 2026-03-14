// OrderCard.jsx
import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Clock, Info, Bike, CreditCard, Eye, MapPin, ShoppingBag, ChevronRight, ChefHat } from 'lucide-react';
import OrderItem from './OrderItem';
import OrderDetailsModal from './OrderDetailsModal';
import Card from '../ui/GlassCard';
import Button from '../ui/Button';

import OrderTimeline from './OrderTimeline';

const OrderCard = ({ order, onDelete, onEdit, onUpdateStatus, viewMode }) => {
  const [showDetails, setShowDetails] = useState(false);
  console.log(order.discount);
  const statusConfig = {

    DELIVERED: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
      icon: CheckCircle,
      label: 'Delivered'
    },
    CANCELLED: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      icon: XCircle,
      label: 'Cancelled'
    },
    REJECTED: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      icon: XCircle,
      label: 'Rejected'
    },

    PREPARING: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      icon: Clock,
      label: 'Preparing'
    },

    PLACED: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-400',
      icon: Clock,
      label: 'Placed'
    },
    ACCEPTED: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-700 dark:text-indigo-400',
      icon: CheckCircle,
      label: 'Accepted'
    },
    READY: {
      bg: 'bg-teal-100 dark:bg-teal-900/30',
      text: 'text-teal-700 dark:text-teal-400',
      icon: ChefHat, // Using ChefHat if available or fallback
      label: 'Ready'
    },
    ASSIGNED: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-400',
      icon: Bike,
      label: 'Assigned'
    },
    OUT_FOR_DELIVERY: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-400',
      icon: Bike,
      label: 'Out For Delivery'
    },

    PICKED: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-400',
      icon: Bike,
      label: 'Picked Up'
    },
    'ON-PROCESS': {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-700 dark:text-indigo-400',
      icon: Clock,
      label: 'On Process'
    }
  };

  const config = statusConfig[order.status] || statusConfig['ON-PROCESS'] || statusConfig['PLACED'];
  const StatusIcon = config?.icon || Info;

  // ============= LIST VIEW =============
  if (viewMode === 'list') {
    return (
      <>
        <Card className="hover:border-primary/50 transition-all duration-300 group mb-3 p-0 cursor-pointer hover:shadow-md" onClick={() => setShowDetails(true)}>
          <div className="p-4 flex flex-col justify-center h-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

              {/* 1. Order Info (Span 3) */}
              <div className="md:col-span-3 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">
                    {order.orderId.replace('#ORDER', '#')}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate" title={order.customer}>
                    {order.customer}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-medium uppercase tracking-wide">
                      {order.type}
                    </span>
                    {order.table && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-2">
                        {order.table}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Status (Span 2) */}
              <div className="md:col-span-2">
                <div className={`${config.bg} ${config.text} px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5`}>
                  <StatusIcon size={14} />
                  {config.label}
                </div>
              </div>

              {/* 3. Details (Partner & Payment) (Span 3) */}
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Bike size={14} className="text-purple-500" />
                  <span className="truncate">{order.deliveryPartner ? order.deliveryPartner.name : 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <CreditCard size={14} className="text-green-500" />
                  <span className="truncate">{order.paymentMethod}</span>
                </div>
              </div>

              {/* 4. Time & Total (Span 2) */}
              <div className="md:col-span-2 text-right">

                <div className="text-base font-bold text-primary">
                  Rs. {order.price?.grandTotal?.toFixed(2) || order.total?.toFixed(2)}
                </div>
                <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <Clock size={12} />
                  {order.time}
                </div>
              </div>

              {/* 5. Actions (Span 2) */}
              <div className="md:col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setShowDetails(true); }} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="View Details">
                  <Eye size={16} />
                </Button>

                {['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'ON-PROCESS'].includes(order.status) && (
                  <>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'COMPLETED'); }} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20" title="Complete">
                      <CheckCircle size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'CANCELLED'); }} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" title="Cancel">
                      <XCircle size={16} />
                    </Button>
                  </>
                )}

                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(order); }} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" title="Edit">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {showDetails && (
          <OrderDetailsModal
            order={order}
            onClose={() => setShowDetails(false)}
          />
        )
        }
      </>
    );
  }

  // ============= GRID VIEW (CARD) =============
  return (
    <>
      <Card className="hover:border-primary/50 transition-all duration-300 flex flex-col h-full p-0 overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1" onClick={() => setShowDetails(true)}>

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate" title={order.customer}>
                {order.customer}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}
                className="p-1 h-auto text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title="View Full Details"
              >
                <Info size={14} />
              </Button>
            </div>
            <div className="flex gap-1">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onEdit(order); }}
                className="p-1.5 h-auto text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title="Edit"
              >
                <Edit size={14} />
              </Button> */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}
                className="p-1.5 h-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Delete"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Row 1: Order ID & Time (Left) - Payment (Right) */}
            <div className="flex justify-between items-center">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-bold hover:bg-primary/20 transition-colors cursor-default">
                {order.orderId}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-default">
                <Clock size={12} />
                {order.time}
              </span>
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-xs font-semibold flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-default">
                <CreditCard size={12} />
                {order.paymentMethod}
              </span>
            </div>

            {/* Row 2: Status (Left) - Type (Right) */}
            <div className="flex justify-between items-center">
              <div className={`${config.bg} ${config.text} px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity cursor-default`}>
                <StatusIcon size={12} />
                {config.label}
              </div>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-default">
                {order.type} {order.table && `• ${order.table}`}
              </span>
            </div>

            {/* Row 3: Delivery Partner (Left) - Status (Right) */}
            {order.deliveryPartner && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-md text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors cursor-default">
                  <Bike size={12} />
                  <span>{order.deliveryPartner.name}</span>
                </div>
                <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors cursor-default">
                  {order.deliveryPartner.status || 'Assigned'}
                </span>
              </div>
            )}

            {/* Timeline */}
            <OrderTimeline currentStatus={order.status} timeline={order.timeline} />
          </div>
        </div>

        {/* Items */}
        <div className="px-4 py-2 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1">
              <ShoppingBag size={12} /> Items ({order.items.length})
            </h4>
          </div>

          <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {order.items.map((item, index) => (
              <OrderItem key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-t border-gray-100 dark:border-gray-700 text-xs">
          {/* Price Breakdown */}
          {order.price && (
            <div className="space-y-1 mb-2 border-b border-gray-200 dark:border-gray-600 pb-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Item Total</span>
                <span>Rs. {order.itemsTotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax Charge</span>
                <span>Rs. {order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charge</span>
                <span>Rs. {order.deliveryFee?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>- Rs. {order.discount?.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-bold">
              Grand Total
            </span>
            <span className="text-xl font-bold text-primary">
              Rs. {order.grandTotal?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </Card>

      {showDetails && (
        <OrderDetailsModal
          order={order}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default OrderCard;