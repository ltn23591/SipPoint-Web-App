import React from "react";

export function HeaderBar({ title = "SipPoint", tableName, onOpenCart, cartCount = 0 }) {
  return (
    <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-white/95 dark:bg-surface/90 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-[#855300] dark:text-brand-cream text-[24px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          coffee
        </span>
        <span className="font-bold text-[18px] leading-none text-[#855300] dark:text-brand-cream tracking-wide">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffcdae]/50 dark:bg-secondary-container text-[#7a553c] dark:text-on-secondary-container rounded-full shadow-sm">
        <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
        <span className="font-semibold text-[13px]">{tableName ? `Bàn ${tableName}` : "Mang đi"}</span>
      </div>

      {onOpenCart && (
        <button
          onClick={onOpenCart}
          className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-[#534434] dark:text-on-surface">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#f59e0b] text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm animate-pulse-soft">
              {cartCount}
            </span>
          )}
        </button>
      )}
    </header>
  );
}
