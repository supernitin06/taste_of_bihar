import React, { useEffect, useRef } from "react";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTruck,
  FiClock,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";

const STATUS_FLOW = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const OrderDetailsModal = ({ order, onClose }) => {
  const modalRef = useRef(null);

  if (!order) return null;

  const {
    customer = {},
    deliveryAddress = {},
    items = [],
    price = {},
    payment = {},
    delivery = {},
    timeline = [],
    status,
    orderId,
    createdAt,
  } = order;

  const customerName = customer.name || "-";
  const customerPhone = customer.phone || "-";
  const customerEmail = customer.email || "-";

  const deliveryName = deliveryAddress.name || "-";
  const deliveryPhone = deliveryAddress.phone || "-";
  const addressLine = deliveryAddress.addressLine || "-";
  const city = deliveryAddress.city || "-";
  const pincode = deliveryAddress.pincode || "-";

  const itemsTotal = price.itemsTotal || 0;
  const tax = price.tax || 0;
  const deliveryFee = price.deliveryFee || 0;
  const discount = price.discount || 0;
  const grandTotal = price.grandTotal || 0;

  const paymentMethod = payment.method || payment.type || "COD";
  const paymentStatus = payment.status || "PENDING";

  const deliveryPartner = delivery.partner || {
    name: "Assigning...",
    phone: "-",
    vehicle: "-",
  };
  const assignedAt = delivery.assignedAt || null;
  const pickedAt = delivery.pickedAt || null;
  const deliveredAt = delivery.deliveredAt || null;

  /* ✅ OUTSIDE CLICK + ESC */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const currentStatusIndex = STATUS_FLOW.indexOf(status);
  const progressPercentage =
    currentStatusIndex >= 0
      ? ((currentStatusIndex + 1) / STATUS_FLOW.length) * 100
      : 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-white/20 dark:bg-black/40 backdrop-blur-md transition-all duration-300" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="w-full max-w-6xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Top Gradient */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shrink-0" />

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-3">
                Order #{orderId}
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                  {status}
                </span>
              </h2>
              <p className="text-blue-100 text-xs mt-1">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all hover:scale-110"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-gray-900 p-6">
            {/* Timeline */}
            <div className="mb-6 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FiClock className="text-blue-600" /> Order Progress
              </h3>
              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full -translate-y-1/2" />
                <div
                  className="absolute left-0 top-1/2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -translate-y-1/2 transition-all duration-700"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div className="flex justify-between relative">
                  {STATUS_FLOW.map((s, i) => {
                    const stepInfo = timeline?.find((t) => t.status === s);
                    const isCompleted = stepInfo || i <= currentStatusIndex;
                    const isCurrent = status === s;
                    return (
                      <div
                        key={s}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                            isCurrent
                              ? "bg-gradient-to-br from-blue-500 to-purple-500 border-white text-white shadow-lg"
                              : isCompleted
                                ? "bg-green-500 border-green-500 text-white shadow-md"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                          }`}
                        >
                          {isCompleted ? (
                            <FiCheckCircle className="w-5 h-5" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide block ${
                              isCurrent
                                ? "text-blue-500"
                                : isCompleted
                                  ? "text-green-500"
                                  : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {s.replace(/_/g, " ")}
                          </span>
                          {stepInfo?.at && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block font-medium">
                              {new Date(stepInfo.at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Customer & Delivery */}
              <div className="lg:col-span-3 space-y-5">
                {/* Customer Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FiUser className="text-blue-600 dark:text-blue-300" />{" "}
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                        {customerName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {customerName}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <FiPhone className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {customerPhone}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <FiMail className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {customerEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-700/30">
                      <div className="flex items-start gap-2">
                        <FiMapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Delivery Address
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {addressLine}, {city} {pincode && `- ${pincode}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Partner */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FiTruck className="text-orange-600 dark:text-orange-400" />{" "}
                    Delivery Agent
                  </h3>
                  {deliveryPartner._id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Name
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {deliveryPartner.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Phone
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {deliveryPartner.phone}
                          </span>
                        </div>
                        {deliveryPartner.vehicle && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Vehicle
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {deliveryPartner.vehicle}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-gray-700/30 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            Assigned:
                          </span>
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {assignedAt
                              ? new Date(assignedAt).toLocaleTimeString()
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            Picked:
                          </span>
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            {pickedAt
                              ? new Date(pickedAt).toLocaleTimeString()
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/50 text-sm p-3 rounded-lg text-center border">
                      Looking for a partner...
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Items */}
              <div className="lg:col-span-6 flex flex-col h-full">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span className="bg-gradient-to-br from-blue-500 to-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {items.length}
                      </span>
                      Items Ordered
                    </h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-300 dark:bg-blue-900/30 px-3 py-1 rounded-lg border dark:border-blue-800/50">
                      Total: ₹{itemsTotal}
                    </span>
                  </div>

                  <div className="overflow-y-auto flex-1 p-3 space-y-2">
                    {items.length ? (
                      items.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0 overflow-hidden relative flex items-center justify-center">
                            <FiFileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            <div className="absolute top-0 right-0 -mt-1 -mr-1">
                              <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                x{item.quantity || 1}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {item.name || "Item"}
                              </h4>
                              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2">
                                ₹{item.finalItemPrice || item.price || 0}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            {item.addons?.length > 0 && (
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                {item.addons.map((add, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 px-2 py-1 rounded border"
                                  >
                                    {add.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No items in this order
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Payment & Summary */}
              <div className="lg:col-span-3 space-y-5">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl shadow-sm border-blue-100 dark:border-blue-800/50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900/50 dark:to-purple-900/50 text-white">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <FiDollarSign className="text-blue-200 dark:text-blue-300" />{" "}
                      Payment Information
                    </h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-blue-200 uppercase tracking-wide">
                          Grand Total
                        </p>
                        <p className="text-2xl font-bold">₹{grandTotal}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            paymentStatus === "PAID"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                          }`}
                        >
                          {paymentStatus}
                        </span>
                        <p className="text-xs text-blue-200 mt-1.5">
                          {paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Item Total
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        ₹{itemsTotal}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Tax
                      </span>
                      <span className="font-semibold text-red-500">
                        + ₹{tax}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Delivery Fee
                      </span>
                      <span className="font-semibold text-blue-500">
                        + ₹{deliveryFee}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Discount
                        </span>
                        <span className="font-semibold text-green-500">
                          - ₹{discount}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-dashed border-gray-300 dark:border-gray-700 pt-3 mt-2">
                      <div className="flex justify-between items-center text-base font-semibold text-gray-900 dark:text-gray-100">
                        <span>To Pay</span>
                        <span>₹{grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Order ID
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        #{orderId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Status
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-300">
                        {status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Items
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {items.length} items
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Order Time
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;
