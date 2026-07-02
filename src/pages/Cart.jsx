import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { authService } from "@/services/authService";

export default function Cart() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("sippoint_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }

    // Check login status
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sippoint_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].qty += delta;
      if (updated[index].qty <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = (item.price || 0) + (item.variantPriceSum || 0);
    return sum + itemPrice * item.qty;
  }, 0);

  const shippingFee = 0; // Free for dine-in
  const total = subtotal - voucherDiscount + shippingFee;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsApplyingVoucher(true);
    // TODO: Call voucher validation API
    setTimeout(() => {
      setIsApplyingVoucher(false);
    }, 500);
  };

  const handleCheckout = () => {
    // TODO: Integrate with order creation API
    alert("Chức năng đặt món đang được phát triển!");
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex justify-center selection:bg-[#f59e0b]/30">
      <div className="bg-[#f9f9f9] text-[#1a1c1c] relative min-h-screen w-full max-w-md flex flex-col shadow-xl overflow-x-hidden font-sans">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Top Navigation */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f9f9f9]/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f4] transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-[#855300]">arrow_back</span>
            </button>
            <h1 className="font-bold text-[22px] text-[#855300]">Giỏ hàng</h1>
          </div>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f4] transition-colors">
              <span className="material-symbols-outlined text-[#855300]">delete_outline</span>
            </button>
          )}
        </header>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 mt-16 text-center">
            <span className="material-symbols-outlined text-zinc-300 text-[64px] mb-4">shopping_cart</span>
            <h2 className="text-lg font-bold text-zinc-800">Giỏ hàng trống</h2>
            <p className="text-sm text-zinc-500 mt-2 max-w-xs">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá thực đơn ngay!
            </p>
            <Link to={ROUTE_PATH.MENU} className="mt-6 px-6 py-2.5 bg-[#855300] text-white rounded-full font-semibold text-sm active:scale-95 transition-transform shadow-md">
              Xem Thực Đơn
            </Link>
          </div>
        ) : (
          <>
            <main className="pt-20 pb-40 px-5 flex-1">
              {/* Reward Banner */}
              {!isLoggedIn && (
                <div className="mb-6 bg-[#f59e0b]/20 border border-[#f59e0b]/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-[#f59e0b] text-[#613b00] w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[14px] text-[#613b00]">Đăng nhập để tích {Math.round(subtotal / 1000)} điểm từ đơn này</p>
                    <Link to={ROUTE_PATH.LOGIN} className="text-[#855300] font-bold text-[12px] mt-0.5 hover:underline">Đăng nhập ngay</Link>
                  </div>
                  <span className="material-symbols-outlined text-[#534434]">chevron_right</span>
                </div>
              )}

              {/* Cart Items Section */}
              <section className="space-y-4 mb-6">
                <h2 className="font-semibold text-[20px] text-[#1a1c1c] mb-2">Sản phẩm đã chọn</h2>

                {cartItems.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(59,31,10,0.06)] flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#e8e8e8]">
                      <img className="w-full h-full object-cover" src={item.image || "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop"} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[14px] text-[#1a1c1c] truncate">{item.name}</h3>
                      <p className="text-[12px] text-[#534434]">
                        {item.variants?.map(v => v.name).join(", ") || "Mặc định"}
                      </p>
                      <p className="text-[#855300] font-bold mt-1 text-[14px]">
                        {((item.price + (item.variantPriceSum || 0)) * item.qty).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 bg-[#eeeeee] rounded-full py-1 px-1">
                      <button onClick={() => updateQuantity(index, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-bold text-[14px] px-2">{item.qty}</span>
                      <button onClick={() => updateQuantity(index, 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#855300] text-white shadow-sm active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              {/* Voucher Field */}
              <section className="mb-6">
                <h2 className="font-semibold text-[20px] text-[#1a1c1c] mb-3">Mã giảm giá</h2>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#534434]">confirmation_number</span>
                    <input
                      className="w-full bg-[#ffcdae]/30 border-none rounded-xl py-3 pl-10 pr-4 text-[14px] focus:ring-2 focus:ring-[#855300]/20 text-[#1a1c1c] placeholder:text-[#534434]/60"
                      placeholder="Nhập mã khuyến mãi"
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleApplyVoucher}
                    disabled={isApplyingVoucher}
                    className="bg-[#7c563d] text-white px-6 rounded-xl font-semibold text-[14px] active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {isApplyingVoucher ? "..." : "Áp dụng"}
                  </button>
                </div>
              </section>

              {/* Order Summary */}
              <section className="bg-[#f3f3f4] rounded-2xl p-5 space-y-3">
                <h2 className="font-semibold text-[20px] text-[#1a1c1c] mb-2">Chi tiết thanh toán</h2>
                <div className="flex justify-between items-center text-[#534434]">
                  <span className="text-[14px]">Tạm tính</span>
                  <span className="font-semibold text-[14px]">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between items-center text-[#534434]">
                  <span className="text-[14px]">Giảm giá</span>
                  <span className="font-semibold text-[14px] text-[#855300]">-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="h-px bg-[#d8c3ad]/30 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[20px] text-[#1a1c1c]">Tổng cộng</span>
                  <span className="font-bold text-[24px] text-[#855300]">{total.toLocaleString("vi-VN")}đ</span>
                </div>
              </section>

              {/* Payment Method Mini-card */}
              <section className="mt-6 p-4 bg-white border border-[#d8c3ad]/20 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ede3b8]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#665f3d]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-[#534434]">Phương thức thanh toán</p>
                  <p className="font-semibold text-[14px] text-[#1a1c1c]">Tiền mặt</p>
                </div>
                <button className="text-[#855300] font-bold text-[12px]">Thay đổi</button>
              </section>
            </main>

            {/* Sticky Checkout Bottom Bar */}
            <footer className="fixed bottom-0 max-w-md mx-auto left-0 right-0 w-full bg-[#f9f9f9]/95 backdrop-blur-xl border-t border-[#d8c3ad]/20 px-5 pt-4 pb-8 z-50">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[#534434]">Tổng thanh toán</span>
                    <span className="text-[#855300] font-bold text-[24px]">{total.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#4a4424] bg-[#ede3b8] rounded-full px-3 py-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <span className="text-[12px] font-bold">Tiền mặt</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#f59e0b] text-[#613b00] h-14 rounded-2xl font-bold text-[20px] shadow-[0px_8px_24px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  Đặt món ngay
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
