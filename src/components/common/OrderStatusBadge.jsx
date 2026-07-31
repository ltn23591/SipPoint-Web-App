import React from "react";

export function OrderStatusBadge({ status }) {
  const getStatusBadgeClass = () => {
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

  const getStatusText = () => {
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
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${getStatusBadgeClass()}`}>
      {getStatusText()}
    </span>
  );
}
