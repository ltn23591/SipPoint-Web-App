import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { queryClient } from "@/helpers/queryClient";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

const getStatusText = (status) => {
  switch (status) {
    case "PENDING":
      return "Đơn hàng đang chờ nhà hàng xác nhận";
    case "CONFIRMED":
      return "Nhà hàng đã tiếp nhận đơn hàng của bạn";
    case "PREPARING":
      return "Barista đang pha chế thức uống của bạn ☕";
    case "READY":
      return "Đơn hàng đã sẵn sàng! Vui lòng nhận tại quầy 🔔";
    case "COMPLETED":
      return "Đơn hàng của bạn đã hoàn tất 🎉";
    case "CANCELLED":
      return "Đơn hàng của bạn đã bị hủy ❌";
    default:
      return `Trạng thái: ${status}`;
  }
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    const backendUrl = import.meta.env.VITE_APP_API_URL
      ? import.meta.env.VITE_APP_API_URL.replace("/api/v1", "")
      : "http://localhost:5000";

    socketRef.current = io(backendUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }

  useEffect(() => {
    const socketInstance = socketRef.current;

    socketInstance.on("connect", () => {
      console.log("🔌 [Socket.io Customer] Connected to server:", socketInstance.id);
    });

    // Lắng nghe cập nhật trạng thái đơn hàng thời gian thực
    socketInstance.on("order_status_updated", (updatedOrder) => {
      console.log("🔔 [Socket.io Customer] Order status updated:", updatedOrder);
      if (!updatedOrder) return;

      const codeStr = updatedOrder.code ? `#${updatedOrder.code}` : "của bạn";
      const statusDesc = getStatusText(updatedOrder.status);

      if (updatedOrder.status === "READY") {
        toast.success(`🔔 Đơn hàng ${codeStr} đã SẴN SÀNG!`, {
          description: statusDesc,
          duration: 7000,
        });
      } else if (updatedOrder.status === "CANCELLED") {
        toast.error(`Đơn hàng ${codeStr} đã bị HỦY`, {
          description: statusDesc,
          duration: 5000,
        });
      } else {
        toast.info(`Cập nhật đơn hàng ${codeStr}`, {
          description: statusDesc,
          duration: 5000,
        });
      }

      // Reload dữ liệu query React Query nếu có
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
        queryClient.invalidateQueries({ queryKey: ["orderDetail"] });
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("🔌 [Socket.io Customer] Disconnected");
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("order_status_updated");
      socketInstance.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
