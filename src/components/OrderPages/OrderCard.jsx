import React from "react";
import { format } from "date-fns";
import {
  MapPin,
  Phone,
  Clock,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Button from "../../components/ui/Button";

const OrderCard = ({
  order,
  onAccept,
  onReject,
  onReady,
  isProcessing,
  onPrepare,
  isbuttonvisible,
}) => {
  const {
    orderId,
    customer = {},
    deliveryAddress = {},
    items = [],
    price = {},
    payment = {},
    status,
    createdAt,
  } = order;

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100/80 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30">
            <CheckCircle size={14} /> Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100/80 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30">
            <XCircle size={14} /> Rejected
          </span>
        );
      case "PLACED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/80 text-blue-700 border border-blue-200 animate-pulse dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30">
            <AlertCircle size={14} /> New Order
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
            {status}
          </span>
        );
    }
  };

  const formattedDate = createdAt
    ? createdAt
    : format(new Date(), "dd MMM yyyy, hh:mm a");

  return (
    <div className="card group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      {/* Top Stripe for Visual Appeal */}
      <div
        className={`h-1.5 w-full ${
          status === "PLACED"
            ? "bg-blue-500"
            : status === "ACCEPTED"
            ? "bg-green-500"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      />

      <div className="p-5 flex flex-col flex-grow gap-4">
        {/* Header: ID, Price, Status */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                #{orderId?.slice(-6) || "N/A"}
              </span>
              {getStatusBadge(status)}
            </div>
            <h3 className="font-extrabold text-gray-800 dark:text-white text-xl tracking-tight">
              ₹{price?.grandTotal?.toFixed(0) || "0"}
            </h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-full border border-transparent dark:border-gray-600">
              <Clock size={12} />
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Customer & Location Info */}
        <div className="space-y-3 bg-gray-50/50 dark:bg-gray-700/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
          {/* Customer */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-600">
              <UserIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {customer?.name || "Guest User"}
              </p>
              <a
                href={`tel:${customer?.phone}`}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Phone size={12} />
                {customer?.phone || "N/A"}
              </a>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-600 w-full" />

          {/* Delivery Address */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-full text-orange-600 dark:text-orange-400 shadow-sm border border-gray-100 dark:border-gray-600">
              <MapPin size={16} />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-0.5">
                Delivery Location
              </p>
              {deliveryAddress ? (
                <>
                  {deliveryAddress.addressLine && (
                    <span>{deliveryAddress.addressLine}, </span>
                  )}
                  {deliveryAddress.city && <span>{deliveryAddress.city}</span>}
                  {deliveryAddress.pincode && (
                    <span> - {deliveryAddress.pincode}</span>
                  )}
                </>
              ) : (
                <span className="italic text-gray-400 dark:text-gray-500">
                  No address provided
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <ShoppingBag size={14} />
            Order Items ({items.length})
          </div>
          <ul className="space-y-2.5">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-start text-sm group/item"
              >
                <div className="flex gap-2.5">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs font-bold rounded">
                    {item.quantity}×
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 font-medium text-xs tabular-nums">
                  ₹{item.finalItemPrice || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Info */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CreditCard
              size={14}
              className="text-purple-500 dark:text-purple-400"
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {payment?.method || "N/A"}
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
              payment?.status === "PAID"
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
            }`}
          >
            {payment?.status || "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-0 mt-auto">
        {status === "ACCEPTED" ? (
          <Button
            size="sm"
            variant="success"
            disabled={isProcessing}
            onClick={onPrepare}
            className={`
    w-full justify-center
    bg-gradient-to-r from-green-400 to-green-600
    text-white font-semibold
    py-2 px-4 rounded-xl
    shadow-lg shadow-green-300/50
    hover:from-green-500 hover:to-green-700
    hover:shadow-green-400/60
    transition-all duration-300
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-green-300
  `}
          >
            {isProcessing ? "Please wait..." : "Prepare Order"}
          </Button>
        ) : status === "PREPARING" ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              variant="danger"
              className="w-full justify-center"
              disabled={isProcessing}
              onClick={onReject}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="success"
              className="w-full justify-center shadow-lg shadow-green-200 dark:shadow-none"
              disabled={isProcessing}
              onClick={onReady}
            >
              Ready
            </Button>
          </div>
        ) : status === "REJECTED" ? (
          <div className="w-full py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-center text-sm font-medium rounded-xl border border-red-100 dark:border-red-500/20">
            Order was declined
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              variant="danger"
              className="w-full justify-center"
              disabled={isProcessing}
              onClick={onReject}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="success"
              className="w-full justify-center shadow-lg shadow-green-200 dark:shadow-none"
              disabled={isProcessing}
              onClick={onAccept}
            >
              {isProcessing ? "Wait..." : "Accept Order"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Icon Component
const UserIcon = ({ size = 16, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default OrderCard;
