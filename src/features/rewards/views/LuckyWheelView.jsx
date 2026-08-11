import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTE_PATH } from "@/constants/routePaths";
import { gameService } from "@/services/gameService";
import BottomNavBar from "@/components/layout/BottomNavBar";

export default function LuckyWheelView() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoading(true);
      const list = await gameService.getAvailableGames();
      if (active) {
        setGames(list);
        setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const openGame = (game) => {
    navigate(ROUTE_PATH.LUCKY_WHEEL_DETAIL.replace(":gameId", game.id));
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] dark:bg-[#131313] flex justify-center selection:bg-[#ffb95f]">
      <div className="bg-[#f9f9f9] dark:bg-[#131313] text-[#1a1c1c] dark:text-[#e5e2e1] relative min-h-screen w-full max-w-md flex flex-col shadow-xl dark:shadow-none overflow-x-hidden font-sans pb-24">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        `,
          }}
        />

        {/* Top App Bar */}
        <header className="sticky top-0 left-0 w-full z-50 flex items-center gap-3 px-4 h-16 bg-[#f9f9f9]/95 dark:bg-[#1A0F06]/95 backdrop-blur-md shadow-[0px_4px_12px_rgba(59,31,10,0.06)] dark:shadow-none dark:border-b dark:border-white/5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-[#855300] dark:text-[#ffc174]">arrow_back</span>
          </button>
          <h1 className="font-bold text-[20px] text-[#855300] dark:text-[#ffc174] tracking-wide">Trò chơi may mắn</h1>
        </header>

        <main className="pt-6 px-5 flex flex-col flex-1">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#855300] dark:border-[#ffc174]" />
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
              <span className="material-symbols-outlined text-[#d8c3ad] dark:text-[#534434] text-[48px]">toys</span>
              <p className="text-[14px] text-[#534434] dark:text-[#d8c3ad]">
                Hiện chưa có trò chơi nào đang diễn ra dành cho bạn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => openGame(game)}
                  className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-[0px_8px_24px_rgba(59,31,10,0.12)] active:scale-[0.98] transition-transform text-left"
                >
                  {game.backgroundUrl ? (
                    <img src={game.backgroundUrl} alt={game.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#ffcdae] to-[#f59e0b] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[48px]">toys</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-bold text-[16px] text-white drop-shadow-md">{game.name}</p>
                    {game.description ? (
                      <p className="text-[12px] text-white/80 line-clamp-1">{game.description}</p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>

        <BottomNavBar activeTab="REWARDS" />
      </div>
    </div>
  );
}
