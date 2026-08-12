import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { ROUTE_PATH } from "@/constants/routePaths";
import { customerService } from "@/services/customerService";
import CartItemCard from "@/features/cart/components/CartItemCard";
import SelectVoucherSheet from "@/components/common/SelectVoucherSheet";

export default function Cart() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("sippoint_cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [customerVoucherId, setCustomerVoucherId] = useState(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [showVoucherSheet, setShowVoucherSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH or TRANSFER
  const [activePaymentMethods, setActivePaymentMethods] = useState(["CASH", "TRANSFER"]);
  const [removedAlerts, setRemovedAlerts] = useState([]);

  const validateCartItems = async (items) => {
    if (!items || items.length === 0) return true;
    try {
      const itemsPayload = items.map(item => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty
      }));
      const res = await customerService.validateCart(itemsPayload);
      const invalidProductIds = new Set((res?.invalidItems || []).map(i => i.productId));
      const imageByProductId = new Map((res?.validItems || []).map(i => [i.productId, i.image]));

      let changed = invalidProductIds.size > 0;
      const updatedCart = items
        .filter(i => !invalidProductIds.has(i.productId))
        .map(i => {
          const freshImage = imageByProductId.get(i.productId);
          if (freshImage && freshImage !== i.image) {
            changed = true;
            return { ...i, image: freshImage };
          }
          return i;
        });

      if (invalidProductIds.size > 0) {
        const messages = res.invalidItems.map(i => i.message || `Món "${i.name}" hiện đã ngừng bán.`);
        setRemovedAlerts(messages);
      }

      if (changed) {
        setCartItems(updatedCart);
        localStorage.setItem("sippoint_cart", JSON.stringify(updatedCart));
      }

      return invalidProductIds.size === 0;
    } catch (e) {
      console.warn("Lỗi kiểm tra giỏ hàng:", e);
    }
    return true;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = (item.price || 0) + (item.variantPriceSum || 0);
    return sum + itemPrice * item.qty;
  }, 0);

  const voucherDiscount = appliedVoucher ? (appliedVoucher.discountAmount || 0) : 0;
  const shippingFee = 0;
  const total = Math.max(0, subtotal - voucherDiscount + shippingFee);

  const applyWalletVoucher = async (v) => {
    setIsApplyingVoucher(true);
    setVoucherError("");
    setVoucherCode("");
    try {
      const res = await customerService.validateWalletVoucher(v._id, subtotal);
      setCustomerVoucherId(v._id);
      setAppliedVoucher(res);
    } catch (error) {
      setCustomerVoucherId(null);
      setAppliedVoucher(null);
      setVoucherError(error.message || "Voucher không hợp lệ hoặc chưa đủ điều kiện áp dụng");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    setTimeout(() => {
      setIsLoggedIn(!!token);
    }, 0);

    // Fetch store config to get enabled payment methods
    customerService.getStoreConfig().then((cfg) => {
      if (cfg && Array.isArray(cfg.paymentMethods) && cfg.paymentMethods.length > 0) {
        setActivePaymentMethods(cfg.paymentMethods);
        setPaymentMethod((prev) => (cfg.paymentMethods.includes(prev) ? prev : cfg.paymentMethods[0]));
      }
    });

    // Check saved voucher from MyVouchers page
    const savedCustomerVoucherId = localStorage.getItem("applied_customer_voucher_id");
    const savedVoucherCode = localStorage.getItem("applied_voucher_code");
    localStorage.removeItem("applied_customer_voucher_id");
    localStorage.removeItem("applied_voucher_code");

    if (savedCustomerVoucherId) {
      setTimeout(() => applyWalletVoucher({ _id: savedCustomerVoucherId }), 0);
    } else if (savedVoucherCode) {
      setTimeout(() => setVoucherCode(savedVoucherCode), 0);
    }

    // Validate cart on mount
    const savedCart = localStorage.getItem("sippoint_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed.length > 0) {
          setTimeout(() => validateCartItems(parsed), 0);
        }
      } catch {
        // ignore parse error
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!appliedVoucher || subtotal <= 0) return;
    const revalidate = customerVoucherId
      ? customerService.validateWalletVoucher(customerVoucherId, subtotal)
      : customerService.validateVoucher(appliedVoucher.code, subtotal);
    revalidate
      .then((res) => setAppliedVoucher(res))
      .catch((err) => {
        setAppliedVoucher(null);
        setCustomerVoucherId(null);
        setVoucherError(err.message || "Đơn hàng chưa đủ điều kiện dùng mã");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sippoint_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const itemToUpdate = prev[index];
      if (!itemToUpdate) return prev;
      
      const newQty = itemToUpdate.qty + delta;
      
      if (delta > 0) {
        const currentTotalQty = prev
          .filter(item => item.productId === itemToUpdate.productId)
          .reduce((sum, item) => sum + item.qty, 0);
          
        const maxStock = itemToUpdate.stock || 0;
        
        if (currentTotalQty + delta > maxStock) {
          toast.error(`Rất tiếc! Số lượng vượt quá khả năng phục vụ (chỉ còn ${maxStock}).`);
          return prev;
        }
      }
      
      return prev
        .map((item, i) => {
          if (i === index) {
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsApplyingVoucher(true);
    setVoucherError("");
    setCustomerVoucherId(null);
    try {
      const res = await customerService.validateVoucher(voucherCode.trim().toUpperCase(), subtotal);
      setAppliedVoucher(res);
      setVoucherError("");
    } catch (error) {
      setAppliedVoucher(null);
      setVoucherError(error.message || "Mã giảm giá không hợp lệ");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setCustomerVoucherId(null);
    setVoucherError("");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      // Re-validate cart items right before checkout
      const isValid = await validateCartItems(cartItems);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      const itemsPayload = cartItems.map(item => ({
        productId: item.productId,
        qty: item.qty,
        variants: item.variants ? item.variants.map(v => ({ variantId: v.variantId })) : [],
        note: item.note || ''
      }));

      const tableId = localStorage.getItem("tableId");
      
      // BE chỉ cho áp dụng 1 loại voucher/đơn - ưu tiên customerVoucherId (voucher trong ví)
      // nếu cả 2 vô tình cùng có giá trị, tránh lặp lại lỗi "Chỉ được áp dụng một loại voucher".
      const payload = {
        items: itemsPayload,
        voucherCode: customerVoucherId ? undefined : (voucherCode || undefined),
        customerVoucherId: customerVoucherId || undefined,
        paymentMethod: paymentMethod,
        note: "Đặt hàng từ Web"
      };

      if (tableId) {
        payload.tableId = tableId;
        payload.type = "dine_in";
      }

      const result = await customerService.createMyOrder(payload);

      // Clear local cart and table info in storage
      localStorage.removeItem("sippoint_cart");
      localStorage.removeItem("tableId");
      localStorage.removeItem("zoneId");
      
      const orderId = result._id || result.id;

      if (paymentMethod === "TRANSFER") {
        const sepayData = await customerService.createSepayPayment({
          amount: total,
          orderId: result.code || orderId,
          orderInfo: `Thanh toan don hang ${result.code || orderId}`,
          returnUrl: `${window.location.origin}${ROUTE_PATH.ORDER_DETAIL.replace(":orderId", orderId)}`
        });

        if (sepayData && sepayData.checkoutURL && sepayData.checkoutFormfields) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = sepayData.checkoutURL;

          Object.keys(sepayData.checkoutFormfields).forEach(key => {
            const hiddenField = document.createElement("input");
            hiddenField.type = "hidden";
            hiddenField.name = key;
            hiddenField.value = sepayData.checkoutFormfields[key];
            form.appendChild(hiddenField);
          });

          document.body.appendChild(form);
          form.submit();
          return;
        }
      }
      
      navigate(ROUTE_PATH.ORDER_DETAIL.replace(":orderId", orderId));
    } catch (error) {
      toast.error(error.message || "Đặt món thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-surface-dim flex justify-center selection:bg-[#f59e0b]/30 transition-colors duration-300">
      <div className="bg-[#f9f9f9] dark:bg-surface-dim text-[#1a1c1c] dark:text-on-surface relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans transition-colors duration-300">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Top Navigation */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f9f9f9]/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f4] transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-[#855300]">arrow_back</span>
            </button>
            <h1 className="font-bold text-[22px] text-[#855300]">Giỏ hàng</h1>
          </div>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f3f4] dark:hover:bg-surface-muted transition-colors">
              <span className="material-symbols-outlined text-[#855300]">delete_outline</span>
            </button>
          )}
        </header>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 mt-16 text-center w-full">
            <span className="material-symbols-outlined text-zinc-300 text-[64px] mb-4">shopping_cart</span>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-on-surface">Giỏ hàng trống</h2>
            <p className="text-sm text-zinc-500 dark:text-on-surface-variant mt-2 max-w-[280px] w-full">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá thực đơn ngay!
            </p>
            <Link to={ROUTE_PATH.MENU} className="mt-6 px-6 py-2.5 bg-[#855300] text-white rounded-full font-semibold text-sm active:scale-95 transition-transform shadow-md">
              Xem Thực Đơn
            </Link>
          </div>
        ) : (
          <>
            <main className="pt-20 pb-40 px-5 flex-1">
              {/* Removed Items Alert Banner */}
              {removedAlerts.length > 0 && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col gap-2 transition-all animate-fadeIn">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-[14px]">
                    <span className="material-symbols-outlined text-red-600">error</span>
                    <span>Cập nhật giỏ hàng</span>
                  </div>
                  {removedAlerts.map((msg, idx) => (
                    <p key={idx} className="text-[13px] text-red-600 dark:text-red-300 font-medium">
                      • {msg} Hệ thống đã tự động loại bỏ món này khỏi giỏ hàng.
                    </p>
                  ))}
                </div>
              )}

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
                  <CartItemCard
                    key={index}
                    item={item}
                    index={index}
                    onUpdateQuantity={updateQuantity}
                    onRemove={(i) => setCartItems((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                ))}
              </section>

              {/* Voucher Field */}
              <section className="mb-6">
                <h2 className="font-semibold text-[18px] text-[#1a1c1c] dark:text-on-surface mb-2">Mã giảm giá</h2>
                
                {appliedVoucher ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[22px]">verified</span>
                      <div>
                        <p className="font-bold text-[14px] text-emerald-800 dark:text-emerald-300">
                          {appliedVoucher.code}
                        </p>
                        <p className="text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {appliedVoucher.title || `Giảm ${appliedVoucher.discountAmount?.toLocaleString('vi-VN')}đ`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-xs text-red-600 dark:text-red-400 font-bold px-3 py-1 bg-white dark:bg-surface-container rounded-full border border-red-200 dark:border-red-800 shadow-sm active:scale-95 transition-transform"
                    >
                      Bỏ mã
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#534434] dark:text-on-surface-variant">confirmation_number</span>
                        <input
                          className="w-full rounded-xl py-3 pl-10 pr-4 text-[14px] bg-[#ffcdae]/30 dark:bg-surface-container dark:text-on-surface placeholder:text-[#534434]/60 dark:placeholder:text-on-surface-variant focus:ring-2 focus:ring-[#855300]/20 dark:focus:ring-primary-container outline-none uppercase font-semibold"
                          placeholder="Nhập mã khuyến mãi"
                          type="text"
                          value={voucherCode}
                          onChange={(e) => {
                            setVoucherCode(e.target.value);
                            if (voucherError) setVoucherError("");
                          }}
                        />
                      </div>
                      <button
                        onClick={handleApplyVoucher}
                        disabled={isApplyingVoucher || !voucherCode.trim()}
                        className="bg-[#7c563d] dark:bg-primary-container text-white dark:text-on-primary-container px-6 rounded-xl font-semibold text-[14px] active:scale-95 transition-transform disabled:opacity-50"
                      >
                        {isApplyingVoucher ? "..." : "Áp dụng"}
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium pl-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {voucherError}
                      </p>
                    )}
                    <button
                      onClick={() => setShowVoucherSheet(true)}
                      className="self-start text-[13px] font-semibold text-[#855300] dark:text-primary-container flex items-center gap-1 pl-1 mt-0.5 active:opacity-70"
                    >
                      Chọn voucher trong ví
                    </button>
                  </div>
                )}
              </section>

              {/* Order Summary */}
              <section className="bg-[#f3f3f4] dark:bg-surface-container rounded-2xl p-5 space-y-3">
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
              <section className="mt-6 p-4 bg-white dark:bg-surface-container-high border border-[#d8c3ad]/20 dark:border-outline-variant/10 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ede3b8]/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#665f3d]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-[#534434] dark:text-on-surface-variant">Phương thức thanh toán</p>
                  <p className="font-semibold text-[14px] text-[#1a1c1c] dark:text-on-surface">
                    {paymentMethod === "CASH" ? "Tiền mặt" : "Chuyển khoản / Quét QR"}
                  </p>
                </div>
                {activePaymentMethods.length > 1 && (
                  <button
                    onClick={() => {
                      const nextIndex = (activePaymentMethods.indexOf(paymentMethod) + 1) % activePaymentMethods.length;
                      setPaymentMethod(activePaymentMethods[nextIndex]);
                    }}
                    className="text-[#855300] dark:text-primary-container font-bold text-[12px]"
                  >
                    Thay đổi
                  </button>
                )}
              </section>
            </main>

            {/* Sticky Checkout Bottom Bar */}
            <footer className="fixed bottom-0 max-w-md mx-auto left-0 right-0 w-full bg-[#f9f9f9]/95 backdrop-blur-xl border-t border-[#d8c3ad]/20 px-5 pt-4 pb-8 z-50">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end mb-1">
                  <div className="flex flex-col">
                      <span className="text-[12px] text-[#534434] dark:text-on-surface-variant">Tổng thanh toán</span>
                      <span className="text-[#855300] font-bold text-[24px]">{total.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#4a4424] bg-[#ede3b8] rounded-full px-3 py-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    <span className="text-[12px] font-bold">{paymentMethod === "CASH" ? "Tiền mặt" : "Quét QR"}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-[#f59e0b] text-[#613b00] h-14 rounded-2xl font-bold text-[20px] shadow-[0px_8px_24px_rgba(245,158,11,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt món ngay"}
                  <span className="material-symbols-outlined">shopping_cart_checkout</span>
                </button>
              </div>
            </footer>
          </>
        )}
      </div>

      <SelectVoucherSheet
        open={showVoucherSheet}
        onClose={() => setShowVoucherSheet(false)}
        subtotal={subtotal}
        onSelect={applyWalletVoucher}
      />
    </div>
  );
}
