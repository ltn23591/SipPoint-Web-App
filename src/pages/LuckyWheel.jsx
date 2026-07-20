import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import BottomNavBar from "@/components/layout/BottomNavBar";
import { customerService } from "@/services/customerService";

export default function LuckyWheel() {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [prize, setPrize] = useState("");
  const [tickerText, setTickerText] = useState("Minh Tuấn vừa trúng Voucher 50%");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prizes, setPrizes] = useState([]);

  const fetchWheelInfo = async () => {
    try {
      // Tải cấu hình các ô phần thưởng động từ database
      const configs = await customerService.getLuckyWheelConfigs();
      if (configs && configs.length === 8) {
        setPrizes(configs);
      }
    } catch (error) {
      console.error("Lỗi lấy cấu hình vòng quay:", error);
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      const info = await customerService.getLuckyWheelInfo();
      setFreeSpins(info.luckySpins || 0);
      setCurrentPoints(info.currentPoints || 0);
    } catch (error) {
      console.error("Lỗi lấy thông tin cá nhân vòng quay:", error);
    }
  };

  useEffect(() => {
    fetchWheelInfo();
  }, []);

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

  const handleSpin = async (usePoints) => {
    if (spinning || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await customerService.spinLuckyWheel(usePoints);
      setSpinning(true);
      
      const prizeId = result.prizeId; // 0 to 7
      // Calculate target rotation to land on the center of that sector
      const targetAngle = (360 - (prizeId * 45 + 22.5)) % 360;
      
      // Spin at least 5 rotations
      const newRotation = wheelRotation + 1800 + targetAngle - (wheelRotation % 360);
      setWheelRotation(newRotation);
      setPrize(result.prizeLabel);
      
      setTimeout(() => {
        setShowModal(true);
        setSpinning(false);
        setFreeSpins(result.luckySpins || 0);
        setCurrentPoints(result.currentPoints || 0);
      }, 4200);
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi thực hiện quay");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Keep rotation under 360 to prevent large rotation values
    setWheelRotation((prev) => prev % 360);
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-[#131313] flex justify-center selection:bg-[#ffb95f]">
      <div className="bg-[#f9f9f9] dark:bg-[#131313] text-[#1a1c1c] dark:text-[#e5e2e1] relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans pb-24">
        
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

        {/* Top App Bar - Đã Fix Header màu Nâu Tách biệt hoàn toàn với Nền Xám */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f9f9f9]/95 dark:bg-[#1A0F06]/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined text-[#855300] dark:text-[#ffc174]">arrow_back</span>
            </button>
            <h1 className="font-bold text-[20px] text-[#855300] dark:text-[#ffc174] tracking-wide">Vòng Quay May Mắn</h1>
          </div>
          <Link to={ROUTE_PATH.CART} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[#534434] dark:text-[#e5e2e1]">shopping_bag</span>
          </Link>
        </header>

        <main className="pt-20 px-5 flex flex-col items-center flex-1">
          {/* Ticker Section */}
          <div className="w-full bg-[#ffcdae]/30 dark:bg-[#f59e0b]/10 rounded-full py-2.5 px-4 mb-6 flex items-center gap-2 overflow-hidden border border-[#d8c3ad]/20 dark:border-[#f59e0b]/20">
            <span className="material-symbols-outlined text-[#7c563d] dark:text-[#f59e0b] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
            <div className="relative h-5 flex-1 overflow-hidden">
              <p key={tickerText} className="ticker-item-animated absolute inset-0 text-[12px] font-semibold text-[#7a553c] dark:text-[#f59e0b] whitespace-nowrap">
                {tickerText}
              </p>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-[22px] text-[#1a1c1c] dark:text-[#e5e2e1] mb-1">Thử vận may, nhận ngay quà khủng!</h2>
            <p className="text-[14px] text-[#534434] dark:text-[#d8c3ad]">Quay bánh xe để rinh hàng ngàn ưu đãi hấp dẫn từ SipPoint</p>
          </div>

          {/* Lucky Wheel Canvas */}
          <div className="relative w-full aspect-square max-w-[300px] mb-6 flex items-center justify-center">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-2.5">
              <div className="w-8 h-10 bg-[#855300] dark:bg-[#f59e0b] rounded-b-full shadow-lg flex items-start justify-center pt-1 border-2 border-[#ffddb8] dark:border-[#ffc174]">
                <div className="w-2 h-2 bg-white dark:bg-[#613b00] rounded-full"></div>
              </div>
            </div>

            {/* The Wheel */}
            <div 
              style={{ 
                transform: `rotate(${wheelRotation}deg)`, 
                transition: spinning ? "transform 4s cubic-bezier(0.15, 0, 0.15, 1)" : "none"
              }} 
              className="relative w-full h-full rounded-full shadow-[0px_8px_24px_rgba(59,31,10,0.15)] dark:shadow-none bg-[#e2e2e2] dark:bg-[#201f1f] overflow-hidden border-4 border-[#855300] dark:border-[#ffddb8]"
            >
              {/* Conic Gradient background */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(
                    #FFF3E0 0deg 45deg,
                    #FFE0B2 45deg 90deg,
                    #FFCC80 90deg 135deg,
                    #FFB74D 135deg 180deg,
                    #FFF3E0 180deg 225deg,
                    #FFE0B2 225deg 270deg,
                    #FFCC80 270deg 315deg,
                    #FFB74D 315deg 360deg
                  )`
                }}
              />
              
              {/* Dynamic Labels */}
              {prizes.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-amber-50/50">
                  <span className="material-symbols-outlined text-[#855300] animate-spin text-[32px]">progress_activity</span>
                </div>
              ) : (
                prizes.map((p, index) => {
                  const angle = index * 45 + 22.5;
                  return (
                    <div
                      key={p.slotIndex}
                      className="absolute top-0 left-1/2 w-[100px] h-[150px] -ml-[50px] origin-bottom flex flex-col items-center pt-5 text-center select-none"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "50% 100%"
                      }}
                    >
                      <span className="font-bold text-[9px] text-[#534434] max-w-[65px] break-words leading-tight">
                        {p.label}
                      </span>
                      <span className="material-symbols-outlined text-[#855300] text-[12px] mt-0.5">
                        {p.type === "VOUCHER" ? "redeem" : p.type === "POINTS" ? "stars" : "sentiment_satisfied"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Center Cap */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/40 dark:border-white/10 flex items-center justify-center shadow-xl">
                <div className="w-10 h-10 bg-[#855300] dark:bg-[#f59e0b] rounded-full flex items-center justify-center border-2 border-[#ffddb8] dark:border-[#ffc174]">
                  <span className="material-symbols-outlined text-white dark:text-[#613b00] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spin Control Button */}
          <div className="flex flex-col items-center gap-3 w-full max-w-[320px] mb-8">
            {!isLoggedIn ? (
              <Link
                to={ROUTE_PATH.LOGIN}
                className="w-full bg-[#f59e0b] text-[#613b00] h-14 rounded-xl font-bold text-[18px] flex items-center justify-center shadow-lg active:scale-95 transition-all"
              >
                Đăng nhập để quay thưởng
              </Link>
            ) : (
              <>
                {freeSpins > 0 ? (
                  <button 
                    onClick={() => handleSpin(false)}
                    disabled={spinning}
                    className="shimmer-effect w-full bg-[#f59e0b] text-[#613b00] h-14 rounded-xl font-bold text-[16px] shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {spinning ? "Đang quay..." : `Quay miễn phí (Còn ${freeSpins} lượt)`}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSpin(true)}
                    disabled={spinning || currentPoints < 15}
                    className="shimmer-effect w-full bg-[#855300] text-white h-14 rounded-xl font-bold text-[16px] shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {spinning ? "Đang quay..." : `Quay bằng 15 điểm (Có ${currentPoints} điểm)`}
                  </button>
                )}
                {freeSpins === 0 && currentPoints < 15 && (
                  <p className="text-[12px] text-red-500 font-semibold text-center">
                    Bạn không đủ điểm hoặc lượt quay miễn phí
                  </p>
                )}
              </>
            )}
            <p className="text-[12px] text-[#534434] dark:text-[#d8c3ad] text-center px-4">
              Mỗi hóa đơn thanh toán trên 50k sẽ được nhận thêm 1 lượt quay miễn phí hoặc tiêu 15 điểm tích lũy cho mỗi lượt quay.
            </p>
          </div>

          {/* Prizes Grid */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            {prizes.map((p) => (
              <div key={p.slotIndex} className="bg-[#f3f3f4]/50 dark:bg-[#201f1f] p-4 rounded-xl shadow-sm dark:shadow-none border border-[#d8c3ad]/10 dark:border-[#534434]/50 flex flex-col items-start">
                <span className="material-symbols-outlined text-[#7c563d] dark:text-[#ffc174] mb-2">
                  {p.type === "VOUCHER" ? "redeem" : p.type === "POINTS" ? "stars" : "sentiment_satisfied"}
                </span>
                <p className="font-semibold text-[13px] text-[#1a1c1c] dark:text-[#e5e2e1] line-clamp-1">{p.label}</p>
                <p className="text-[10px] text-zinc-400 dark:text-[#d8c3ad] uppercase tracking-wider font-semibold">Tỷ lệ: {p.probability}%</p>
              </div>
            ))}
            <div className="col-span-2 bg-[#ffddb8]/20 dark:bg-[#f59e0b]/10 p-4 rounded-xl shadow-sm dark:shadow-none border border-[#ffddb8]/30 dark:border-[#f59e0b]/20 flex items-center justify-between">
              <div>
                <p className="font-bold text-[16px] text-[#2a1700] dark:text-[#ffc174]">Ưu đãi hôm nay</p>
                <p className="text-[13px] text-[#653e00] dark:text-[#f59e0b]">Quay bánh xe, rinh ngàn quà tặng!</p>
              </div>
              <span className="material-symbols-outlined text-[#855300] dark:text-[#f59e0b] text-[40px] opacity-25">celebration</span>
            </div>
          </div>
        </main>

        {/* Result Modal */}
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${showModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-[#1a1c1c]/40 dark:bg-black/70 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className={`relative bg-[#f9f9f9] dark:bg-[#201f1f] p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-[#d8c3ad]/30 dark:border-[#534434]/50 transform transition-transform duration-300 ${showModal ? "scale-100" : "scale-90"}`}>
            <div className="w-20 h-20 bg-[#ffcdae] dark:bg-[#f59e0b]/20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg dark:shadow-none">
              <span className="material-symbols-outlined text-[#613b00] dark:text-[#f59e0b] text-[40px]">card_giftcard</span>
            </div>
            <h3 className="font-bold text-[24px] text-[#1a1c1c] dark:text-[#e5e2e1] mb-2">Chúc mừng!</h3>
            <p className="text-[16px] text-[#534434] dark:text-[#d8c3ad] mb-6">Bạn đã trúng <span className="font-bold text-[#855300] dark:text-[#ffc174]">{prize}</span></p>
            <button 
              onClick={handleCloseModal}
              className="w-full bg-[#7c563d] dark:bg-[#f59e0b] text-white dark:text-[#613b00] h-12 rounded-xl font-bold active:scale-95 transition-all"
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