import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { customerService } from "@/services/customerService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customerService.getMyOrders();
        const ordersList = res?.orders || res || [];
        // Sort by date descending
        const sorted = [...ordersList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (error) {
        console.error("Lỗi lấy lịch sử đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-800 font-medium animate-pulse";
      case "READY":
        return "bg-green-100 text-green-800 font-semibold ring-2 ring-green-500/20";
      case "COMPLETED":
        return "bg-zinc-100 text-zinc-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã nhận đơn";
      case "PREPARING":
        return "Đang chuẩn bị";
      case "READY":
        return "Chờ nhận món";
      case "COMPLETED":
        return "Hoàn tất";
      case "CANCELLED":
        return "Đã huỷ";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex justify-center">
      <div className="bg-[#f9f9f9] text-[#1a1c1c] relative min-h-screen w-full max-w-md flex flex-col shadow-xl overflow-x-hidden font-sans pb-24">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Top App Bar */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex items-center px-4 h-16 bg-white/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
          <h1 className="font-bold text-[20px] text-[#855300] tracking-wide">
            Đơn hàng của tôi
          </h1>
        </header>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-20 mt-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#855300]" />
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 mt-16 text-center">
            <span className="material-symbols-outlined text-zinc-300 text-[64px] mb-4">receipt_long</span>
            <h2 className="text-lg font-bold text-zinc-800">Chưa có đơn hàng nào</h2>
            <p className="text-sm text-zinc-500 mt-2 max-w-xs">
              Lịch sử mua sắm của bạn hiện đang trống. Hãy trải nghiệm thức uống của SipPoint ngay nào!
            </p>
            <Link to={ROUTE_PATH.MENU} className="mt-6 px-6 py-2.5 bg-[#855300] text-white rounded-full font-semibold text-sm active:scale-95 transition-transform shadow-md">
              Đặt món ngay
            </Link>
          </div>
        ) : (
          <main className="pt-20 px-4 space-y-4 flex-1">
            {orders.map((order) => (
              <div 
                key={order._id}
                onClick={() => navigate(ROUTE_PATH.ORDER_DETAIL.replace(":orderId", order._id))}
                className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(59,31,10,0.04)] border border-zinc-100 hover:border-zinc-200 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#855300]">
                      #{order.code || order.orderNumber}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Items preview list */}
                <div className="space-y-1.5 border-t border-b border-zinc-100 py-3 my-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[13px] text-zinc-600">
                      <span className="truncate max-w-[200px]">{item.name}</span>
                      <span className="text-zinc-400 font-medium">x{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-[12px] text-zinc-400">
                    {order.tableId?.name ? `Bàn ${order.tableId.name}` : "Mang đi"}
                  </span>
                  <div className="text-right">
                    <span className="text-[12px] text-zinc-400">Tổng thanh toán: </span>
                    <span className="font-bold text-[15px] text-[#855300] ml-1">
                      {order.total?.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </main>
        )}

        <BottomNavBar activeTab="ORDERS" />
      </div>
    </div>
  );
}
