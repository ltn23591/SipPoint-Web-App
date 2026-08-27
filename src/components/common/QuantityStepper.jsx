import { useState, useEffect } from "react";

export function QuantityStepper({
  quantity,
  maxStock = 99,
  onDecrease,
  onIncrease,
  onChangeQuantity,
  size = "md",
}) {
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const isMin = quantity <= 1;
  const isMax = quantity >= maxStock;

  const heightClass = size === "sm" ? "h-8 px-1" : "h-12 px-2";
  const btnSizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSizeClass = size === "sm" ? "text-[16px]" : "text-[20px]";
  const inputSizeClass = size === "sm" ? "w-8 text-[12px]" : "w-10 text-[14px]";

  const handleBlur = () => {
    let val = parseInt(inputValue, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > maxStock) val = maxStock;
    setInputValue(String(val));
    if (onChangeQuantity && val !== quantity) {
      onChangeQuantity(val);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= maxStock && onChangeQuantity) {
      onChangeQuantity(num);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

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
      {onChangeQuantity ? (
        <input
          type="number"
          min={1}
          max={maxStock}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${inputSizeClass} text-center font-bold text-zinc-800 dark:text-on-surface bg-transparent outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
      ) : (
        <span className={`${inputSizeClass} text-center font-bold text-zinc-800 dark:text-on-surface`}>
          {quantity}
        </span>
      )}
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
