import React from "react";

export function QuantityStepper({ quantity, maxStock = 99, onDecrease, onIncrease, size = "md" }) {
  const isMin = quantity <= 1;
  const isMax = quantity >= maxStock;

  const heightClass = size === "sm" ? "h-8 px-1" : "h-12 px-2";
  const btnSizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSizeClass = size === "sm" ? "text-[16px]" : "text-[20px]";
  const textSizeClass = size === "sm" ? "w-6 text-[12px]" : "w-8 text-[14px]";

  return (
    <div className={`flex items-center bg-zinc-100 dark:bg-surface-container rounded-full ${heightClass}`}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={isMin}
        className={`${btnSizeClass} flex items-center justify-center text-[#855300] dark:text-primary-container active:scale-90 disabled:opacity-30 transition-transform`}
      >
        <span className={`material-symbols-outlined ${iconSizeClass}`}>remove</span>
      </button>
      <span className={`${textSizeClass} text-center font-bold text-zinc-800 dark:text-on-surface`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={isMax}
        className={`${btnSizeClass} flex items-center justify-center text-[#855300] dark:text-primary-container active:scale-90 transition-transform ${
          isMax ? "opacity-30 cursor-not-allowed" : ""
        }`}
      >
        <span className={`material-symbols-outlined ${iconSizeClass}`}>add</span>
      </button>
    </div>
  );
}
