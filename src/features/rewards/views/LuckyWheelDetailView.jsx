import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { gameService } from "@/services/gameService";
import BottomNavBar from "@/components/layout/BottomNavBar";

const REWARD_TYPE_MESSAGE = "MESSAGE";
const REWARD_TYPE_VOUCHER = "VOUCHER";
const REWARD_TYPE_POINTS = "POINTS";

const rewardIcon = (type) => {
  if (type === REWARD_TYPE_VOUCHER) return "confirmation_number";
  if (type === REWARD_TYPE_POINTS) return "monetization_on";
  return "card_giftcard";
};

const rewardText = (r) => {
  if (r.type === REWARD_TYPE_POINTS) return `+${r.rewardValue ?? 0} điểm`;
  if (r.type === REWARD_TYPE_VOUCHER) return r.voucher?.title || r.displayName;
  return r.displayName;
};

export default function LuckyWheelDetailView() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [prizeResult, setPrizeResult] = useState(null);
  const [exchanging, setExchanging] = useState(false);

  const fetchGame = async () => {
    try {
      setIsLoading(true);
      setLoadError("");
      const data = await gameService.getGameDetail(gameId);
      setGame(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const rewards = (game?.rewards || []).slice().sort((a, b) => a.index - b.index);
  // Thông tin phần thưởng hiển thị cho khách - bỏ ô "lời chúc" (MESSAGE, không phải quà thật).
  const displayRewards = rewards.filter((r) => r.type !== REWARD_TYPE_MESSAGE);

  const handleSpin = async () => {
    if (spinning || !game || (game.remainingTurns ?? 0) <= 0) return;
    setSpinning(true);
    try {
      const result = await gameService.drawGame(gameId);
      const sliceAngle = 360 / (rewards.length || 1);
      const matchedIndex = rewards.findIndex((r) => r.rewardId === result.prize.rewardId);
      const targetCenter = matchedIndex >= 0 ? matchedIndex * sliceAngle + sliceAngle / 2 : 0;
      const desiredMod = (360 - targetCenter) % 360;
      const currentMod = ((rotation % 360) + 360) % 360;
      const delta = (desiredMod - currentMod + 360) % 360;
      const newRotation = rotation + 1800 + delta;
      setRotation(newRotation);

      setTimeout(() => {
        setSpinning(false);
        setPrizeResult(result.prize);
        setGame((prev) => (prev ? { ...prev, remainingTurns: result.remainingTurns } : prev));
        setShowResultModal(true);
      }, 4000);
    } catch (err) {
      setSpinning(false);
      setLoadError(err.message);
    }
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setRotation((prev) => prev % 360);
  };

  const handleExchangeTurn = async () => {
    if (exchanging) return;
    setExchanging(true);
    try {
      const res = await gameService.exchangeTurn(gameId);
      setGame((prev) => (prev ? { ...prev, remainingTurns: res.remainingTurns } : prev));
      toast.success(`Đã dùng ${res.pointsSpent} điểm để đổi 1 lượt chơi.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setExchanging(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-[#131313] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300] dark:border-[#ffc174]" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-[#131313] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-[14px] text-[#534434] dark:text-[#d8c3ad]">
          {loadError || "Không tìm thấy trò chơi hoặc bạn không thể tham gia trò chơi này."}
        </p>
        <button onClick={() => navigate(-1)} className="text-[#855300] dark:text-[#ffc174] font-semibold text-[14px]">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-[#131313] flex justify-center selection:bg-[#ffb95f]">
      <div className="bg-[#f9f9f9] dark:bg-[#131313] text-[#1a1c1c] dark:text-[#e5e2e1] relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans pb-24">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .shimmer-effect { position: relative; overflow: hidden; }
          .shimmer-effect::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 2s infinite;
          }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        `,
          }}
        />

        {/* Top App Bar */}
        <header className="fixed top-0 max-w-md mx-auto left-0 right-0 w-full z-50 flex items-center gap-3 px-4 h-16 bg-[#f9f9f9]/95 dark:bg-[#1A0F06]/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-[#855300] dark:text-[#ffc174]">arrow_back</span>
          </button>
          <h1 className="font-bold text-[18px] text-[#855300] dark:text-[#ffc174] tracking-wide truncate">{game.name}</h1>
        </header>

        <main className="pt-20 px-5 flex flex-col items-center flex-1">
          {game.description ? (
            <p className="text-[13px] text-[#534434] dark:text-[#d8c3ad] text-center mb-4">{game.description}</p>
          ) : null}

          {loadError && (
            <div className="w-full mb-4 rounded-xl bg-[#ffdad6] dark:bg-[#5a1f1a] text-[#ba1a1a] dark:text-[#ffb4a9] text-[13px] px-4 py-2 text-center">
              {loadError}
            </div>
          )}

          {/* Lucky Wheel Canvas */}
          <div className="relative w-full aspect-square max-w-[300px] mb-6 flex items-center justify-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-2.5">
              <div className="w-8 h-10 bg-[#855300] dark:bg-[#f59e0b] rounded-b-full shadow-lg flex items-start justify-center pt-1 border-2 border-[#ffddb8] dark:border-[#ffc174]">
                <div className="w-2 h-2 bg-white dark:bg-[#613b00] rounded-full"></div>
              </div>
            </div>

            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 4s cubic-bezier(0.15, 0, 0.15, 1)" : "none",
              }}
              className="w-full h-full rounded-full shadow-[0px_8px_24px_rgba(59,31,10,0.15)] dark:shadow-none bg-[#e2e2e2] dark:bg-[#201f1f] overflow-hidden flex items-center justify-center border-4 border-white/50 dark:border-[#2a2a2a]"
            >
              {game.gameUrl ? (
                <img alt={game.name} className="w-full h-full object-contain" src={game.gameUrl} />
              ) : (
                <span className="material-symbols-outlined text-[#855300] dark:text-[#f59e0b] text-[64px]">toys</span>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 bg-white/20 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/40 dark:border-white/10 flex items-center justify-center shadow-xl">
                <div className="w-10 h-10 bg-[#855300] dark:bg-[#f59e0b] rounded-full flex items-center justify-center border-2 border-[#ffddb8] dark:border-[#ffc174]">
                  <span className="material-symbols-outlined text-white dark:text-[#613b00] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Spin Control */}
          <div className="flex flex-col items-center gap-3 w-full max-w-[320px] mb-8">
            <div className="bg-[#e8e8e8] dark:bg-[#2a2a2a] px-4 py-2 rounded-xl whitespace-nowrap">
              <p className="font-semibold text-[14px] text-[#855300] dark:text-[#ffc174]">
                Lượt quay còn lại: <span className="font-bold">{game.remainingTurns ?? 0}</span>
              </p>
            </div>
            <button
              onClick={handleSpin}
              disabled={spinning || (game.remainingTurns ?? 0) <= 0}
              className="shimmer-effect w-full bg-[#f59e0b] dark:bg-[#f59e0b] text-[#613b00] dark:text-[#613b00] h-14 rounded-xl font-bold text-[18px] shadow-[0px_4px_12px_rgba(245,158,11,0.3)] dark:shadow-none active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {spinning ? "Đang quay..." : (game.remainingTurns ?? 0) <= 0 ? "Bạn đã hết lượt chơi" : "Quay ngay"}
            </button>
            {(game.remainingTurns ?? 0) <= 0 && game.isExchangeTurnEnabled ? (
              <button
                onClick={handleExchangeTurn}
                disabled={exchanging}
                className="w-full border border-[#f59e0b] text-[#855300] dark:text-[#ffc174] dark:border-[#ffc174] h-12 rounded-xl font-semibold text-[14px] active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                {exchanging ? "Đang xử lý..." : `Dùng ${game.turnRewardAmount ?? 0} điểm đổi 1 lượt chơi`}
              </button>
            ) : null}
          </div>

          {/* Reward info (trừ ô lời chúc) */}
          {displayRewards.length > 0 && (
            <div className="w-full mb-6">
              <h2 className="font-semibold text-[16px] text-[#1a1c1c] dark:text-[#e5e2e1] mb-3">Phần thưởng của trò chơi</h2>
              <div className="grid grid-cols-2 gap-3">
                {displayRewards.map((r) => (
                  <div
                    key={r.rewardId}
                    className="bg-[#f3f3f4]/50 dark:bg-[#201f1f] p-4 rounded-xl shadow-sm dark:shadow-none border border-[#d8c3ad]/10 dark:border-[#534434]/50 flex flex-col items-start"
                  >
                    <span className="material-symbols-outlined text-[#7c563d] dark:text-[#ffc174] mb-2">{rewardIcon(r.type)}</span>
                    <p className="font-semibold text-[14px] text-[#1a1c1c] dark:text-[#e5e2e1]">{rewardText(r)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Result Modal */}
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${
            showResultModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-[#1a1c1c]/40 dark:bg-black/70 backdrop-blur-sm" onClick={closeResultModal}></div>
          <div
            className={`relative bg-[#f9f9f9] dark:bg-[#201f1f] p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-[#d8c3ad]/30 dark:border-[#534434]/50 transform transition-transform duration-300 ${
              showResultModal ? "scale-100" : "scale-90"
            }`}
          >
            <div className="w-20 h-20 bg-[#ffcdae] dark:bg-[#f59e0b]/20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg dark:shadow-none">
              <span className="material-symbols-outlined text-[#613b00] dark:text-[#f59e0b] text-[40px]">
                {prizeResult?.type === REWARD_TYPE_MESSAGE ? "sentiment_satisfied" : "card_giftcard"}
              </span>
            </div>
            <h3 className="font-bold text-[24px] text-[#1a1c1c] dark:text-[#e5e2e1] mb-2">
              {prizeResult?.type === REWARD_TYPE_MESSAGE ? "Rất tiếc!" : "Chúc mừng!"}
            </h3>
            <p className="text-[16px] text-[#534434] dark:text-[#d8c3ad] mb-6">
              {prizeResult?.type === REWARD_TYPE_MESSAGE ? (
                prizeResult?.message || "Chúc bạn may mắn lần sau!"
              ) : (
                <>
                  Bạn đã trúng{" "}
                  <span className="font-bold text-[#855300] dark:text-[#ffc174]">{prizeResult ? rewardText(prizeResult) : ""}</span>
                </>
              )}
            </p>
            <button
              onClick={closeResultModal}
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
