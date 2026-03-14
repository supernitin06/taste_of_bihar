import { useEffect } from "react";
import { useSockets } from "../context/SocketContext";
import toast from "react-hot-toast";

const GlobalNotification = () => {
  const { ordersSocket } = useSockets();

  useEffect(() => {
    if (!ordersSocket) return;

    /* 🔔 NEW ORDER */
    const handleNewOrder = (order) => {
      console.log("🔔 New Order Notification:", order);

      toast.success(
        `🛒 New Order Received: ${order.customOrderId}`,
        { duration: 4000 }
      );
    };

    /* Attach */
    ordersSocket.on("NEW_ORDER", handleNewOrder);

    /* Cleanup */
    return () => {
      ordersSocket.off("NEW_ORDER", handleNewOrder);
    };
  }, [ordersSocket]);

  // ❌ No UI needed
  return null;
};

export default GlobalNotification;
