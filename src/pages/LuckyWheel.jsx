import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function LuckyWheel() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [freeSpins, setFreeSpins] = useState(1);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [prize, setPrize] = useState("");
  const [tickerText, setTickerText] = useState("Minh Tuấn vừa trúng Voucher 50%");

  // Ticker animation mock
  useEffect(() => {
    const tickers = [
      "Minh Tuấn vừa trúng Voucher 50%",
      "Khánh Vy vừa trúng Ly Latte miễn phí",
      "Gia Bảo vừa nhận 100 điểm thưởng",
      "Mỹ Linh vừa trúng Voucher 20%",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % tickers.length;
      setTickerText(tickers[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    if (spinning || freeSpins <= 0) return;
    setSpinning(true);
    setFreeSpins((prev) => prev - 1);

    // Generate random rotation (at least 5 full rotations + random angle)
    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = wheelRotation + 1800 + randomAngle;
    setWheelRotation(newRotation);

    // Determine prize based on angle
    const normalizedAngle = (360 - (newRotation % 360)) % 360;
    let wonPrize = "Voucher 20%";
    if (normalizedAngle >= 0 && normalizedAngle < 45) wonPrize = "Free Latte";
    else if (normalizedAngle >= 45 && normalizedAngle < 90) wonPrize = "Voucher 50%";
    else if (normalizedAngle >= 90 && normalizedAngle < 135) wonPrize = "50 Điểm Thưởng";
    else if (normalizedAngle >= 135 && normalizedAngle < 180) wonPrize = "Voucher 10%";
    else if (normalizedAngle >= 180 && normalizedAngle < 225) wonPrize = "Free Cappuccino";
    else if (normalizedAngle >= 225 && normalizedAngle < 270) wonPrize = "Voucher 30%";
    else if (normalizedAngle >= 270 && normalizedAngle < 315) wonPrize = "Voucher 20%";
    else wonPrize = "Ly Latte đá";

    setPrize(wonPrize);

    setTimeout(() => {
      setShowModal(true);
      setSpinning(false);
    }, 4000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Keep rotation under 360 to prevent large rotation values
    setWheelRotation((prev) => prev % 360);
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex justify-center selection:bg-[#ffb95f]">
      <div className="bg-[#f9f9f9] text-[#1a1c1c] relative min-h-screen w-full max-w-md flex flex-col shadow-xl overflow-x-hidden font-sans pb-24">
        
        {/* Custom Keyframe Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .shimmer-effect {
            position: relative;
            overflow: hidden;
          }
          .shimmer-effect::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
          }
          @keyframes ticker-scroll {
            0% { transform: translateY(100%); opacity: 0; }
            10% { transform: translateY(0); opacity: 1; }
            90% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100%); opacity: 0; }
          }
          .ticker-item-animated {
            animation: ticker-scroll 4s infinite;
          }
        `}} />

        {/* Top App Bar */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f9f9f9]/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)]">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-[#855300]">arrow_back</span>
            </button>
            <h1 className="font-bold text-[20px] text-[#855300] tracking-wide">Vòng Quay May Mắn</h1>
          </div>
          <Link to={ROUTE_PATH.CART} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors">
            <span className="material-symbols-outlined text-[#534434]">shopping_bag</span>
          </Link>
        </header>

        <main className="pt-20 px-5 flex flex-col items-center flex-1">
          {/* Ticker Section */}
          <div className="w-full bg-[#ffcdae]/30 rounded-full py-2.5 px-4 mb-6 flex items-center gap-2 overflow-hidden border border-[#d8c3ad]/20">
            <span className="material-symbols-outlined text-[#7c563d] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
            <div className="relative h-5 flex-1 overflow-hidden">
              <p key={tickerText} className="ticker-item-animated absolute inset-0 text-[12px] font-semibold text-[#7a553c] whitespace-nowrap">
                {tickerText}
              </p>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-[22px] text-[#1a1c1c] mb-1">Thử vận may, nhận ngay quà khủng!</h2>
            <p className="text-[14px] text-[#534434]">Quay bánh xe để rinh hàng ngàn ưu đãi hấp dẫn từ SipPoint</p>
          </div>

          {/* Lucky Wheel Canvas */}
          <div className="relative w-full aspect-square max-w-[300px] mb-6 flex items-center justify-center">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-2.5">
              <div className="w-8 h-10 bg-[#855300] rounded-b-full shadow-lg flex items-start justify-center pt-1 border-2 border-[#ffddb8]">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* The Wheel */}
            <div 
              style={{ 
                transform: `rotate(${wheelRotation}deg)`, 
                transition: spinning ? "transform 4s cubic-bezier(0.15, 0, 0.15, 1)" : "none"
              }} 
              className="w-full h-full rounded-full shadow-[0px_8px_24px_rgba(59,31,10,0.15)] bg-[#e2e2e2] overflow-hidden flex items-center justify-center"
            >
              <img 
                alt="Lucky Wheel" 
                className="w-full h-full object-contain" 
                src="https://lh3.googleusercontent.com/aida/ADBb0uhOmuont8wZUrgRPJbbV24SGKKKIekY4Oe0CVfcHMFEX_ra0IHk57zoxFi5GPdviQ7JUks2K1bIPOL_S2ZoiIfckfpPyrrxDborVRd1cOgbim4k1rXOqC9vKgefBnJnHhdK1GYNiIx6fWoJ6JPj6RatU28MLCeiCShCdlnMAJjGdfG-jYEIRnfmNCc7P3p37lifVBRhpkpUk2zExNHi8etOCAj6K6aN1GX1tEz5Oq3P3GpkiC4ONql_" 
              />
            </div>

            {/* Center Cap */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full border border-white/40 flex items-center justify-center shadow-xl">
                <div className="w-10 h-10 bg-[#855300] rounded-full flex items-center justify-center border-2 border-[#ffddb8]">
                  <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spin Control Button */}
          <div className="flex flex-col items-center gap-3 w-full max-w-xs mb-8">
            <div className="bg-[#e8e8e8] px-4 py-2 rounded-xl">
              <p className="font-semibold text-[14px] text-[#855300]">Lượt quay miễn phí: <span className="font-bold">{freeSpins}</span></p>
            </div>
            <button 
              onClick={handleSpin}
              disabled={spinning || freeSpins <= 0}
              className="shimmer-effect w-full bg-[#f59e0b] text-[#613b00] h-14 rounded-xl font-bold text-[18px] shadow-[0px_4px_12px_rgba(245,158,11,0.3)] active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {spinning ? "Đang quay..." : "Quay ngay"}
            </button>
            <p className="text-[12px] text-[#534434] text-center px-4">
              Mỗi hóa đơn thanh toán trên 50k sẽ được nhận thêm 1 lượt quay may mắn.
            </p>
          </div>

          {/* Prizes Grid */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#f3f3f4]/50 p-4 rounded-xl shadow-sm border border-[#d8c3ad]/10 flex flex-col items-start">
              <span className="material-symbols-outlined text-[#7c563d] mb-2">redeem</span>
              <p className="font-semibold text-[14px] text-[#1a1c1c]">Voucher 50%</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Giải Nhất</p>
            </div>
            <div className="bg-[#f3f3f4]/50 p-4 rounded-xl shadow-sm border border-[#d8c3ad]/10 flex flex-col items-start">
              <span className="material-symbols-outlined text-[#7c563d] mb-2">local_cafe</span>
              <p className="font-semibold text-[14px] text-[#1a1c1c]">Ly Latte miễn phí</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Giải Nhì</p>
            </div>
            <div className="col-span-2 bg-[#ffddb8]/20 p-4 rounded-xl shadow-sm border border-[#ffddb8]/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-[16px] text-[#2a1700]">Ưu đãi hôm nay</p>
                <p className="text-[13px] text-[#653e00]">Quay bánh xe, rinh ngàn quà tặng!</p>
              </div>
              <span className="material-symbols-outlined text-[#855300] text-[40px] opacity-25">celebration</span>
            </div>
          </div>
        </main>

        {/* Result Modal */}
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-[#1a1c1c]/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className={`relative bg-[#f9f9f9] p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-[#d8c3ad]/30 transform transition-transform duration-300 ${showModal ? "scale-100" : "scale-90"}`}>
            <div className="w-20 h-20 bg-[#ffcdae] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[#613b00] text-[40px]">card_giftcard</span>
            </div>
            <h3 className="font-bold text-[24px] text-[#1a1c1c] mb-2">Chúc mừng!</h3>
            <p className="text-[16px] text-[#534434] mb-6">Bạn đã trúng <span className="font-bold text-[#855300]">{prize}</span></p>
            <button 
              onClick={handleCloseModal}
              className="w-full bg-[#7c563d] text-white h-12 rounded-xl font-bold active:scale-95 transition-all"
            >
              Tuyệt vời
            </button>
          </div>
        </div>

        <BottomNavBar activeTab="REWARDS" />
      </div>
    </div>
  );
}
