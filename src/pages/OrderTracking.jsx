import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ROUTE_PATH } from "@/constants/routePaths";
import { customerService } from "@/services/customerService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function OrderTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleReorder = () => {
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

  // Khi được SePay redirect về với ?status=success, gọi API xác nhận thanh toán
  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    const paymentOrderId = searchParams.get("orderId") || orderId;
    if (paymentStatus === "success" && paymentOrderId) {
      customerService.confirmPayment(paymentOrderId)
        .then(() => {
          console.log("Đã xác nhận thanh toán thành công cho đơn:", paymentOrderId);
          fetchOrderDetails(); // Tải lại thông tin đơn hàng
        })
        .catch((err) => console.error("Lỗi xác nhận thanh toán:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch order details (either specific or latest)
  const fetchOrderDetails = async () => {
    try {
      if (orderId) {
        const orderData = await customerService.getMyOrderById(orderId);
        setOrder(orderData);
      } else {
        const ordersRes = await customerService.getMyOrders();
        const ordersList = ordersRes?.orders || ordersRes || [];
        if (ordersList.length > 0) {
          const sorted = [...ordersList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrder(sorted[0]);
        } else {
          setOrder(null);
        }
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchOrderDetails, 0);
    // Poll every 5 seconds to track order status in real time
    const interval = setInterval(fetchOrderDetails, 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Stepper calculations
  const getStepStatus = (stepName) => {
    if (!order) return "pending";
    const status = order.status;

    // Steps mapping
    switch (stepName) {
      case "ORDERED": // Step 1
        if (status === "PENDING") return "active";
        return ["CONFIRMED", "PREPARING", "READY", "COMPLETED"].includes(status) ? "completed" : "pending";
      case "CONFIRMED": // Step 2
        if (status === "CONFIRMED") return "active";
        return ["PREPARING", "READY", "COMPLETED"].includes(status) ? "completed" : "pending";
      case "PREPARING": // Step 3
        if (status === "PREPARING") return "active";
        return ["READY", "COMPLETED"].includes(status) ? "completed" : "pending";
      case "READY": // Step 4
        if (status === "READY") return "active";
        return status === "COMPLETED" ? "completed" : "pending";
      case "COMPLETED": // Step 5
        return status === "COMPLETED" ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  const getHeroInfo = () => {
    if (!order) return { icon: "coffee_maker", title: "Không có đơn hàng", desc: "Bạn chưa đặt đơn hàng nào gần đây." };
    switch (order.status) {
      case "PENDING":
        return { icon: "pending_actions", title: "Đã đặt hàng", desc: "Đơn hàng đang chờ nhà hàng xác nhận..." };
      case "CONFIRMED":
        return { icon: "thumb_up", title: "Đã xác nhận", desc: "Nhà hàng đã tiếp nhận đơn hàng của bạn." };
      case "PREPARING":
        return { icon: "coffee_maker", title: "Đang pha chế", desc: "Barista đang chuẩn bị thức uống của bạn..." };
      case "READY":
        return { icon: "done_all", title: "Sẵn sàng", desc: "Món ăn/nước uống đã sẵn sàng! Vui lòng nhận tại quầy." };
      case "COMPLETED":
        return { icon: "check_circle", title: "Hoàn tất", desc: "Cảm ơn bạn đã ủng hộ SipPoint!" };
      case "CANCELLED":
        return { icon: "cancel", title: "Đã huỷ", desc: "Đơn hàng của bạn đã bị hủy." };
      default:
        return { icon: "local_cafe", title: "Đơn hàng", desc: "Đang cập nhật trạng thái..." };
    }
  };

  const hero = getHeroInfo();

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-surface-dim flex justify-center transition-colors duration-300">
      <div className="bg-[#f9f9f9] dark:bg-surface-dim text-[#1a1c1c] dark:text-on-surface relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans pb-24 transition-colors duration-300">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          
          @keyframes pulse-soft {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
          }
          .animate-pulse-soft {
              animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .rotating {
              animation: rotate 3s linear infinite;
          }
          @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
        `}} />

        {/* Top App Bar */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Link to={ROUTE_PATH.MENU} className="p-2 -ml-2 hover:bg-[#f3f3f4] transition-colors active:scale-95 duration-200 rounded-full">
              <span className="material-symbols-outlined text-[#855300]">arrow_back</span>
            </Link>
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-[18px] text-[#855300] leading-tight truncate">
                {order ? `#${order.code || order.orderNumber}` : "Theo dõi đơn hàng"}
              </h1>
              {order && (
                <p className="text-[12px] text-[#534434] truncate">
                  {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} • {order.tableId?.name ? `Bàn ${order.tableId.name}` : "Mang đi"}
                </p>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-[#f3f3f4] dark:hover:bg-surface-container-high transition-colors active:scale-95 duration-200 rounded-full">
            <span className="material-symbols-outlined text-[#855300] dark:text-on-primary">help_outline</span>
          </button>
        </header>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center py-20 mt-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#855300]" />
          </div>
        ) : !order ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 mt-16 text-center w-full">
            <span className="material-symbols-outlined text-zinc-300 text-[64px] mb-4">receipt_long</span>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-on-surface">Không có đơn hàng nào</h2>
            <p className="text-sm text-zinc-500 dark:text-on-surface-variant mt-2 max-w-[280px] w-full">
              Bạn hiện không có đơn hàng nào đang thực hiện hoặc chưa từng đặt đơn nào.
            </p>
            <Link to={ROUTE_PATH.MENU} className="mt-6 px-6 py-2.5 bg-[#855300] text-white rounded-full font-semibold text-sm active:scale-95 transition-transform shadow-md">
              Đến Thực Đơn
            </Link>
          </div>
        ) : (
          <main className="pt-20 px-4 space-y-6 flex-1">
            {/* Status Hero */}
            <section className="text-center py-4">
              <div className="relative inline-flex items-center justify-center p-8 bg-[#f59e0b]/20 rounded-full mb-4">
                {["PENDING", "CONFIRMED", "PREPARING"].includes(order.status) && (
                  <div className="absolute inset-0 border-4 border-[#f59e0b] border-t-transparent rounded-full rotating"></div>
                )}
                <span className={`material-symbols-outlined text-[#855300] text-[48px] ${["PENDING", "CONFIRMED", "PREPARING"].includes(order.status) ? 'animate-pulse-soft' : ''}`}>
                  {hero.icon}
                </span>
              </div>
              <h2 className="font-bold text-[22px] text-[#855300] mb-1">{hero.title}</h2>
              <p className="text-[14px] text-[#534434]">{hero.desc}</p>
            </section>

            {/* Visual Stepper */}
            {order.status !== "CANCELLED" && (
              <section className="bg-white rounded-xl p-5 shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
                <div className="relative space-y-6 ml-4">
                  {/* Vertical Line */}
                  <div className="absolute left-[-11px] top-4 bottom-4 w-0.5 bg-[#d8c3ad]/30"></div>

                  {/* Step 1: Ordered */}
                  <div className="relative flex items-center gap-4">
                    {getStepStatus("ORDERED") === "completed" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#855300] flex items-center justify-center -ml-6">
                        <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                      </div>
                    ) : getStepStatus("ORDERED") === "active" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center -ml-6 ring-4 ring-[#f59e0b]/20">
                        <span className="material-symbols-outlined text-[14px] text-[#613b00] rotating">sync</span>
                      </div>
                    ) : (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#e2e2e2] flex items-center justify-center -ml-6">
                        <div className="w-2 h-2 rounded-full bg-[#d8c3ad]"></div>
                      </div>
                    )}
                    <div>
                      <p className={`text-[14px] font-bold ${getStepStatus("ORDERED") !== "pending" ? 'text-[#855300]' : 'text-[#534434]'}`}>Đã đặt</p>
                      <p className="text-[12px] text-[#534434]">Thành công lúc {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="relative flex items-center gap-4">
                    {getStepStatus("CONFIRMED") === "completed" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#855300] flex items-center justify-center -ml-6">
                        <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                      </div>
                    ) : getStepStatus("CONFIRMED") === "active" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center -ml-6 ring-4 ring-[#f59e0b]/20">
                        <span className="material-symbols-outlined text-[14px] text-[#613b00] rotating">sync</span>
                      </div>
                    ) : (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#e2e2e2] flex items-center justify-center -ml-6">
                        <div className="w-2 h-2 rounded-full bg-[#d8c3ad]"></div>
                      </div>
                    )}
                    <div>
                      <p className={`text-[14px] font-bold ${getStepStatus("CONFIRMED") !== "pending" ? 'text-[#855300]' : 'text-[#534434]'}`}>Đã xác nhận</p>
                      {getStepStatus("CONFIRMED") !== "pending" && (
                        <p className="text-[12px] text-[#534434]">Nhà hàng đã nhận đơn</p>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Preparing */}
                  <div className="relative flex items-center gap-4">
                    {getStepStatus("PREPARING") === "completed" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#855300] flex items-center justify-center -ml-6">
                        <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                      </div>
                    ) : getStepStatus("PREPARING") === "active" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center -ml-6 ring-4 ring-[#f59e0b]/20">
                        <span className="material-symbols-outlined text-[14px] text-[#613b00] rotating">sync</span>
                      </div>
                    ) : (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#e2e2e2] flex items-center justify-center -ml-6">
                        <div className="w-2 h-2 rounded-full bg-[#d8c3ad]"></div>
                      </div>
                    )}
                    <div>
                      <p className={`text-[14px] font-bold ${getStepStatus("PREPARING") !== "pending" ? 'text-[#855300]' : 'text-[#534434]'}`}>Đang pha chế</p>
                      {getStepStatus("PREPARING") === "active" && (
                        <p className="text-[12px] text-[#534434]">Dự kiến hoàn tất trong 5 phút</p>
                      )}
                    </div>
                  </div>

                  {/* Step 4: Ready */}
                  <div className="relative flex items-center gap-4">
                    {getStepStatus("READY") === "completed" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#855300] flex items-center justify-center -ml-6">
                        <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                      </div>
                    ) : getStepStatus("READY") === "active" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center -ml-6 ring-4 ring-[#f59e0b]/20">
                        <span className="material-symbols-outlined text-[14px] text-[#613b00]">notifications_active</span>
                      </div>
                    ) : (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#e2e2e2] flex items-center justify-center -ml-6">
                        <div className="w-2 h-2 rounded-full bg-[#d8c3ad]"></div>
                      </div>
                    )}
                    <div>
                      <p className={`text-[14px] font-bold ${getStepStatus("READY") !== "pending" ? 'text-[#855300]' : 'text-[#534434]'}`}>Sẵn sàng</p>
                      {getStepStatus("READY") === "active" && (
                        <p className="text-[12px] text-[#ba1a1a] font-medium">Vui lòng nhận tại quầy!</p>
                      )}
                    </div>
                  </div>

                  {/* Step 5: Completed */}
                  <div className="relative flex items-center gap-4">
                    {getStepStatus("COMPLETED") === "completed" ? (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#855300] flex items-center justify-center -ml-6">
                        <span className="material-symbols-outlined text-[14px] text-white font-bold">check</span>
                      </div>
                    ) : (
                      <div className="z-10 w-5 h-5 rounded-full bg-[#e2e2e2] flex items-center justify-center -ml-6">
                        <div className="w-2 h-2 rounded-full bg-[#d8c3ad]"></div>
                      </div>
                    )}
                    <div>
                      <p className={`text-[14px] font-bold ${getStepStatus("COMPLETED") === "completed" ? 'text-[#855300]' : 'text-[#534434]'}`}>Hoàn tất</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Items Summary Card */}
            <section className="bg-white rounded-xl p-5 shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[16px] text-[#1a1c1c]">Chi tiết món ăn</h3>
                <span className="text-[12px] text-[#534434]">{order.items?.length || 0} món</span>
              </div>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={item._id || idx} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[#e8e8e8] overflow-hidden shrink-0">
                      <img 
                        className="w-full h-full object-cover" 
                        src={item.productId?.image || "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop"} 
                        alt={item.name} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-[14px] text-[#1a1c1c]">{item.name}</h4>
                        <span className="font-semibold text-[14px] text-[#1a1c1c]">{(item.subtotal || item.unitPrice * item.qty).toLocaleString("vi-VN")}đ</span>
                      </div>
                      <p className="text-[12px] text-[#534434]">
                        x{item.qty} {item.variants?.map(v => v.name).join(", ")} {item.note && `• Note: ${item.note}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#d8c3ad]/20 flex justify-between items-center">
                <span className="font-semibold text-[14px] text-[#1a1c1c]">Tổng cộng</span>
                <span className="font-bold text-[18px] text-[#855300]">{order.total?.toLocaleString("vi-VN")}đ</span>
              </div>
            </section>

            {/* Reorder Action Button */}
            <div className="pt-2">
              <button
                onClick={handleReorder}
                className="w-full py-3.5 bg-[#855300] dark:bg-primary-container text-white dark:text-on-primary-container font-bold text-[15px] rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>Đặt lại đơn hàng này</span>
              </button>
            </div>
          </main>
        )}

        <BottomNavBar activeTab="TRACKING" />
      </div>
    </div>
  );
}
