import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, X, Clock, Bell, Trash2 } from "lucide-react";
import { FiCheckSquare } from "react-icons/fi";

import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "../../../api/services/notificationApi";

import {
  useUpdateOrderStatusMutation,
  useGetOrdersQuery,
} from "../../../api/services/orderApi";

const NotificationDrawer = ({ isOpen, onClose }) => {
  // ---------------- API HOOKS ----------------
  const { data, refetch } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { refetch: refetchOrders } = useGetOrdersQuery({
    page: 1,
    limit: 5000,
  });

  // ---------------- NORMALIZE NOTIFICATIONS ----------------
  const notifications = data?.data || [];
  const normalizedNotifications = notifications.map((n) => ({
    id: n._id,
    type: n.type === "NEW_ORDER" ? "order" : "system",
    title: n.title,
    message: n.message,
    orderId: n.data?.orderId,
    isRead: n.isRead,
    time: new Date(n.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const unreadCount = normalizedNotifications.filter((n) => !n.isRead).length;

  // ---------------- REFRESH ON DRAWER OPEN ----------------
  useEffect(() => {
    if (isOpen) refetch(); // fetch notifications when drawer opens
  }, [isOpen]);

  // ---------------- ACTION HANDLER ----------------
  const handleAction = async (item, action) => {
    try {
      if (!item.orderId) return;

      // 1️⃣ Update order status (Drawer + Table sync)
      await updateOrderStatus({
        id: item.orderId,
        status: action === "accept" ? "ACCEPTED" : "REJECTED",
      }).unwrap();

      // 2️⃣ Mark notification as read

      // 3️⃣ Refresh notifications + orders table
      refetch();
      refetchOrders();
    } catch (err) {
      console.error("Error handling notification:", err);
    }
  };

  const markasread = async (itmeid) => {
    try {
      console.log(itmeid);
      const item = normalizedNotifications.find((n) => n.id === itmeid);
      if (!item) return;
      await markRead(item.id).unwrap();
      refetch();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await markAllRead().unwrap();
      refetch(); // refresh notifications
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  // ---------------- UI HELPER ----------------
  const getStyles = (type) => {
    switch (type) {
      case "order":
        return {
          card: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800",
          iconBg:
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          Icon: Bell,
        };
      default:
        return {
          card: "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700",
          iconBg:
            "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
          Icon: Bell,
        };
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[9999] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } bg-white dark:bg-gray-900 shadow-2xl border-l flex flex-col`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-primary text-lg">Notifications</h2>
              <p className="text-xs  text-primary">
                You have {unreadCount} unread messages
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              disabled={unreadCount === 0}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 transform shadow ${
                unreadCount === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
              }`}
              title={
                unreadCount === 0
                  ? "No unread notifications"
                  : "Mark all as read"
              }
            >
              <FiCheckSquare className="w-4 h-4" />
              Mark All as Read
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {normalizedNotifications.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">No notifications</p>
          ) : (
            normalizedNotifications.map((item) => {
              const { card, iconBg, Icon } = getStyles(item.type);
              return (
                <div
                  onClick={() => markasread(item.id)}
                  key={item.id}
                  className={`rounded-xl  text-primary p-4 border ${card} ${
                    item.isRead ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <span className="text-xs  text-primary flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </span>
                      </div>

                      <p className="text-sm text-primary mt-1">
                        {item.message}
                      </p>

                      {item.type === "order" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAction(item, "accept")}
                            className="flex-1 bg-gray-900 text-white text-xs py-2 rounded-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleAction(item, "reject")}
                            className="flex-1 border text-red-500 text-xs py-2 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default NotificationDrawer;
