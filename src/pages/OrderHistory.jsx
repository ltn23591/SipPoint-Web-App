import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { ROUTE_PATH } from "@/constants/routePaths";
import { customerService } from "@/services/customerService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableName, setTableName] = useState(() => localStorage.getItem("tableName") || "");
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    const handleUpdate = () => {
      setTableName(localStorage.getItem("tableName") || "");
    };
    window.addEventListener("tableNameUpdated", handleUpdate);
    return () => window.removeEventListener("tableNameUpdated", handleUpdate);
  }, []);

  const handleReorder = (order, e) => {
    if (e) e.stopPropagation();
    if (!order || !order.items || order.items.length === 0) return;

    const savedCart = localStorage.getItem("sippoint_cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    let totalQtyAdded = 0;
    order.items.forEach((item) => {
      const prodId = typeof item.productId === "object" ? item.productId?._id : (item.productId || item._id);
      if (!prodId) return;

      const cartItem = {
        productId: prodId,
        name: item.name,
        image: item.productId?.image || item.image || "",
        price: item.unitPrice || item.price || 0,
        qty: item.qty || 1,
        variants: item.variants ? item.variants.map((v) => ({
          variantId: v.variantId || v._id,
          name: v.name,
          priceAdjustment: v.priceAdjustment || 0,
        })) : [],
        note: item.note || "",
        stock: item.productId?.stock || 99,
      };

      const existingIdx = cart.findIndex(
        (c) =>
          c.productId === cartItem.productId &&
          JSON.stringify(c.variants) === JSON.stringify(cartItem.variants) &&
          c.note === cartItem.note
      );

      if (existingIdx >= 0) {
        cart[existingIdx].qty += cartItem.qty;
      } else {
        cart.push(cartItem);
      }
      totalQtyAdded += cartItem.qty;
    });

    localStorage.setItem("sippoint_cart", JSON.stringify(cart));
    toast.success(`Đã thêm ${totalQtyAdded} sản phẩm vào giỏ hàng!`);
    navigate(ROUTE_PATH.CART);
  };

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
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-500 dark:border dark:border-amber-900/50";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:border dark:border-blue-900/50";
      case "PREPARING":
        return "bg-orange-100 text-orange-800 font-medium animate-pulse dark:bg-orange-900/20 dark:text-orange-400 dark:border dark:border-orange-900/50";
      case "READY":
        return "bg-green-100 text-green-800 font-semibold ring-2 ring-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border dark:border-green-900/50 dark:ring-1";
      case "COMPLETED":
        return "bg-zinc-100 text-zinc-800 dark:bg-surface-container-high dark:text-on-surface-variant dark:border dark:border-outline-variant/30";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 dark:border dark:border-red-900/50";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-surface-container-high dark:text-on-surface-variant";
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
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-[#131313] flex justify-center transition-colors duration-300">
      <div className="bg-[#f9f9f9] dark:bg-[#131313] text-[#1a1c1c] dark:text-on-surface relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans pb-24 transition-colors duration-300">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Top App Bar - Đã đồng bộ y hệt Menu */}
        <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#855300] dark:text-brand-cream text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              coffee
            </span>
            <span className="font-bold text-[18px] leading-none text-[#855300] dark:text-brand-cream tracking-wide">
              SipPoint
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 dark:bg-secondary-container text-[#7a553c] dark:text-on-secondary-container rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
            <span className="font-semibold text-[13px]">{tableName ? `Bàn ${tableName}` : "Mang đi"}</span>
          </div>

          <Link to={ROUTE_PATH.CART} className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[#534434] dark:text-on-surface">shopping_bag</span>
          </Link>
        </header>

        {/* Tab Filter theo Trạng thái */}
        <div className="flex px-4 pt-3 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "PROCESSING", label: "Đang xử lý" },
            { id: "COMPLETED", label: "Hoàn tất" },
            { id: "CANCELLED", label: "Đã hủy" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? "bg-[#855300] text-white dark:bg-primary-container dark:text-on-primary-container shadow-sm"
                    : "bg-zinc-100 text-zinc-600 dark:bg-surface-container-high dark:text-on-surface-variant hover:bg-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#855300] dark:border-primary" />
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 text-center">
            <span className="material-symbols-outlined text-zinc-300 dark:text-outline text-[64px] mb-4">receipt_long</span>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-on-surface w-full">Chưa có đơn hàng nào</h2>
            <p className="text-sm text-zinc-500 dark:text-on-surface-variant mt-2 max-w-[280px] w-full">
              Lịch sử mua sắm của bạn hiện đang trống. Hãy trải nghiệm thức uống của SipPoint ngay nào!
            </p>
            <Link to={ROUTE_PATH.MENU} className="mt-6 px-6 py-2.5 bg-[#855300] dark:bg-primary-container text-white dark:text-on-primary-container rounded-full font-semibold text-sm active:scale-95 transition-transform shadow-md">
              Đặt món ngay
            </Link>
          </div>
        ) : (
          <main className="pt-3 px-4 space-y-4 flex-1">
            {orders
              .filter((order) => {
                if (activeTab === "ALL") return true;
                if (activeTab === "PROCESSING") return ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(order.status);
                if (activeTab === "COMPLETED") return order.status === "COMPLETED";
                if (activeTab === "CANCELLED") return order.status === "CANCELLED";
                return true;
              })
              .map((order) => (
              <div 
                key={order._id}
                onClick={() => navigate(ROUTE_PATH.ORDER_DETAIL.replace(":orderId", order._id))}
                className="bg-white dark:bg-surface-container rounded-xl p-4 shadow-[0px_4px_12px_rgba(59,31,10,0.04)] dark:shadow-none border border-zinc-100 dark:border-outline-variant/30 hover:border-zinc-200 dark:hover:border-outline-variant/60 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#855300] dark:text-primary">
                      #{order.code || order.orderNumber}
                    </h3>
                    <p className="text-[11px] text-zinc-400 dark:text-on-surface-variant mt-0.5">
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
                <div className="space-y-1.5 border-t border-b border-zinc-100 dark:border-outline-variant/20 py-3 my-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[13px] text-zinc-600 dark:text-on-surface-variant">
                      <span className="truncate max-w-[200px]">{item.name}</span>
                      <span className="text-zinc-400 dark:text-on-surface/60 font-medium">x{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100 dark:border-outline-variant/20">
                  <span className="text-[12px] text-zinc-400 dark:text-on-surface-variant">
                    {order.tableId?.name ? `Bàn ${order.tableId.name}` : "Mang đi"}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-zinc-400 dark:text-on-surface-variant">Tổng: </span>
                      <span className="font-bold text-[14px] text-[#855300] dark:text-primary">
                        {order.total?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    {order.status === "COMPLETED" && (
                      <button
                        onClick={(e) => handleReorder(order, e)}
                        className="px-3 py-1.5 bg-[#855300] hover:bg-[#855300]/90 text-white dark:bg-primary-container dark:text-on-primary-container rounded-full font-bold text-[12px] flex items-center gap-1 active:scale-95 transition-all shadow-sm shrink-0"
                      >
                        <span className="material-symbols-outlined text-[15px]">refresh</span>
                        Đặt lại
                      </button>
                    )}
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