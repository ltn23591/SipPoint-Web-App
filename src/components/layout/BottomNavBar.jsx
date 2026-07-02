import React from 'react';
import { Link } from 'react-router';
import { ROUTE_PATH } from '@/constants/routePaths';

export default function BottomNavBar({ activeTab }) {
  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? "flex flex-col items-center justify-center bg-[#ffcdae]/50 text-[#7a553c] rounded-xl px-4 py-1.5 active:scale-90 transition-transform duration-150"
      : "flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5 hover:bg-zinc-50 rounded-xl transition-all active:scale-90 duration-150";
  };

  const getIconStyle = (tabName) => {
    return activeTab === tabName ? { fontVariationSettings: "'FILL' 1" } : {};
  };

  return (
    <nav className="fixed bottom-0 max-w-md mx-auto left-0 right-0 w-full z-10 flex justify-around items-center px-1 py-2 h-16 bg-white border-t border-zinc-100 shadow-[0px_-4px_12px_rgba(59,31,10,0.04)]">
      <Link to={ROUTE_PATH.HOME} className={getTabClass('HOME')}>
        <span className="material-symbols-outlined" style={getIconStyle('HOME')}>local_cafe</span>
        <span className="text-[10px] font-semibold mt-0.5">Thực đơn</span>
      </Link>
      <Link to={ROUTE_PATH.ORDERS} className={getTabClass('ORDERS')}>
        <span className="material-symbols-outlined" style={getIconStyle('ORDERS')}>receipt_long</span>
        <span className="text-[10px] font-semibold mt-0.5">Đơn hàng</span>
      </Link>
      <Link to={ROUTE_PATH.ORDER_TRACKING} className={getTabClass('TRACKING')}>
        <span className="material-symbols-outlined" style={getIconStyle('TRACKING')}>coffee_maker</span>
        <span className="text-[10px] font-semibold mt-0.5">Trạng thái</span>
      </Link>
      <Link to={ROUTE_PATH.REWARDS} className={getTabClass('REWARDS')}>
        <span className="material-symbols-outlined" style={getIconStyle('REWARDS')}>redeem</span>
        <span className="text-[10px] font-semibold mt-0.5">Điểm thưởng</span>
      </Link>
      <Link to={ROUTE_PATH.ACCOUNT} className={getTabClass('ACCOUNT')}>
        <span className="material-symbols-outlined" style={getIconStyle('ACCOUNT')}>person</span>
        <span className="text-[10px] font-semibold mt-0.5">Tài khoản</span>
      </Link>
    </nav>
  );
}
