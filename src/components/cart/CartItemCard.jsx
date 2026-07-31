import React from "react";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { Link } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";

export default function CartItemCard({ item, index, onUpdateQuantity, onRemove }) {
  const itemPrice = (item.price || 0) + (item.variantPriceSum || 0);

  return (
    <div className="bg-white dark:bg-surface-container rounded-2xl p-4 shadow-[0px_4px_12px_rgba(59,31,10,0.04)] dark:shadow-none border border-zinc-100 dark:border-outline-variant/30 flex gap-4 transition-all">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-surface-container-high overflow-hidden shrink-0 relative">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <span className="material-symbols-outlined text-[32px]">local_cafe</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-[15px] text-zinc-900 dark:text-on-surface truncate pr-2">
              {item.name}
            </h3>
            <button
              onClick={() => onRemove(index)}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1 -mr-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <p className="text-[12px] text-zinc-500 dark:text-on-surface-variant mt-0.5">
              Size: {item.variants.map((v) => v.name).join(", ")}
            </p>
          )}

          {/* Custom Note */}
          {item.note && (
            <p className="text-[12px] text-[#855300] dark:text-primary italic mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              {item.note}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-[15px] text-[#855300] dark:text-primary">
            {(itemPrice * item.qty).toLocaleString("vi-VN")}đ
          </span>

          {/* Quantity Stepper */}
          <QuantityStepper
            size="sm"
            quantity={item.qty}
            maxStock={item.stock || 99}
            onDecrease={() => onUpdateQuantity(index, -1)}
            onIncrease={() => onUpdateQuantity(index, 1)}
          />
        </div>
      </div>
    </div>
  );
}
