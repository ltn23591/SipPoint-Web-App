import React from "react";
import { QuantityStepper } from "@/components/common/QuantityStepper";

export default function ProductDetailSheet({
  isOpen,
  isLoading,
  product,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  note,
  setNote,
  maxQty,
  available,
  onAddToCart,
  onClose,
}) {
  if (!isOpen) return null;

  const calculateSinglePrice = () => {
    if (!product) return 0;
    const base = product.price || 0;
    const sizeAdjustment = selectedSize ? selectedSize.priceAdjustment || 0 : 0;
    return base + sizeAdjustment;
  };

  const totalPrice = calculateSinglePrice() * quantity;

  const effectiveMax = maxQty != null ? maxQty : (product?.stock || 0);
  const canOrder = available != null ? available : effectiveMax > 0;

  return (
    <>
      {/* Scrim Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[60] opacity-100 animate-fade-in"
      />

      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto z-[70] bg-white dark:bg-surface rounded-t-[28px] max-h-[90vh] flex flex-col shadow-[0px_-8px_24px_rgba(59,31,10,0.1)] dark:shadow-none animate-slide-up">
        <div className="w-full flex justify-center py-3">
          <div className="w-8 h-1.5 bg-zinc-200 dark:bg-outline-variant rounded-full" />
        </div>

        <div className="absolute top-4 right-4 z-[80]">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-surface-container-highest/80 backdrop-blur-sm rounded-full text-zinc-800 dark:text-on-surface shadow-sm active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isLoading || !product ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300] dark:border-primary-container" />
            <span className="text-sm text-zinc-500 dark:text-on-surface-variant mt-2">
              Đang tải chi tiết món ăn...
            </span>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto hide-scrollbar flex-1 pb-32">
              <div className="relative w-full aspect-[4/3] bg-zinc-50 dark:bg-surface-container-low">
                {product.image ? (
                  <img
                    className="w-full h-full object-cover"
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-30 text-zinc-500 dark:text-on-surface">
                    <span className="material-symbols-outlined text-[64px]">local_cafe</span>
                  </div>
                )}
              </div>

              <div className="px-5 pt-5 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-[22px] font-bold text-zinc-900 dark:text-on-surface leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <p className="text-[20px] font-bold text-[#855300] dark:text-primary-container">
                      {product.price?.toLocaleString("vi-VN")}đ
                    </p>
                    <span
                      className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full border ${
                        canOrder
                          ? "bg-[#ffcdae]/30 text-[#855300] dark:bg-primary-container/20 dark:text-primary-container border-[#f59e0b]/20"
                          : "bg-red-100 text-red-700 border-red-200 dark:bg-error-container dark:text-on-error-container"
                      }`}
                    >
                      {canOrder ? `Còn phục vụ: ${effectiveMax}` : "Đã hết hàng"}
                    </span>
                  </div>
                  <p className="text-[13px] text-zinc-500 dark:text-on-surface-variant leading-relaxed pt-2">
                    {product.description || "Chưa có mô tả chi tiết cho món ăn này."}
                  </p>
                </div>

                {product.variants?.some(
                  (v) => v.variantType === "size" && v.isActive !== "inactive"
                ) && (
                  <div className="space-y-3">
                    <h3 className="text-[14px] font-bold text-zinc-900 dark:text-on-surface">
                      Chọn size
                    </h3>
                    <div className="flex gap-3">
                      {product.variants
                        .filter(
                          (v) => v.variantType === "size" && v.isActive !== "inactive"
                        )
                        .map((size) => (
                          <button
                            key={size._id}
                            onClick={() => setSelectedSize(size)}
                            className={`flex-1 py-2.5 rounded-full border-2 text-[13px] font-bold transition-all active:scale-95 ${
                              selectedSize?._id === size._id
                                ? "border-[#f59e0b] dark:border-primary-container bg-[#ffcdae]/30 dark:bg-primary-container/20 text-[#7a553c] dark:text-primary-container"
                                : "border-zinc-200 dark:border-outline-variant bg-transparent text-zinc-600 dark:text-on-surface-variant hover:border-[#f59e0b]/40 dark:hover:border-primary-container/40"
                            }`}
                          >
                            {size.name}{" "}
                            {size.priceAdjustment > 0 &&
                              `(+${size.priceAdjustment / 1000}k)`}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Note Field */}
                <div className="space-y-3">
                  <h3 className="text-[14px] font-bold text-zinc-900 dark:text-on-surface">
                    Ghi chú cho quán...
                  </h3>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-surface-container-lowest border border-zinc-100 dark:border-outline-variant rounded-xl p-4 text-[14px] text-zinc-800 dark:text-on-surface placeholder:text-zinc-400 dark:placeholder:text-on-surface-variant focus:ring-2 focus:ring-[#f59e0b]/20 dark:focus:ring-primary-container/50 outline-none min-h-[80px] resize-none"
                    placeholder="Ví dụ: Ít đá, nhiều kem muối..."
                  />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-surface p-5 flex items-center gap-4 shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] border-t border-zinc-100 dark:border-surface-container-high z-[90]">
              {/* Stepper Component */}
              <QuantityStepper
                quantity={quantity}
                maxStock={effectiveMax}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => q + 1)}
              />

              <button
                onClick={onAddToCart}
                disabled={!canOrder}
                className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[15px] font-bold transition-all shadow-md ${
                  !canOrder
                    ? "bg-zinc-200 dark:bg-surface-container-highest text-zinc-400 dark:text-on-surface-variant cursor-not-allowed"
                    : "bg-[#855300] dark:bg-primary-container text-white dark:text-on-primary-container active:scale-[0.98] hover:bg-[#855300]/95 dark:hover:bg-primary"
                }`}
              >
                <span>{!canOrder ? "Đã hết hàng" : "Thêm vào giỏ"}</span>
                {canOrder && (
                  <>
                    <span className="w-1 h-1 bg-white/40 dark:bg-on-primary-container/40 rounded-full" />
                    <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
