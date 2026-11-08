import { useEffect, useState } from "react";
import { BellRing, CreditCard, HandHelping, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { customerService } from "@/services/customerService";

const ASSIST_OPTIONS = [
  {
    type: "CALL_STAFF",
    label: "Gọi nhân viên hỗ trợ",
    desc: "Nhân viên sẽ đến bàn của bạn ngay",
    icon: HandHelping,
  },
  {
    type: "EXTRA_ICE_NAPKIN",
    label: "Xin thêm đá / khăn giấy",
    desc: "Thêm đá viên, khăn giấy hoặc ống hút",
    icon: Sparkles,
  },
  {
    type: "PAY_AT_TABLE",
    label: "Yêu cầu thanh toán tại bàn",
    desc: "Nhân viên mang hóa đơn / QR tới bàn",
    icon: CreditCard,
  },
];

export function TableAssistButton() {
  const [open, setOpen] = useState(false);
  const [tableId, setTableId] = useState(() => localStorage.getItem("tableId") || "");
  const [tableName, setTableName] = useState(() => localStorage.getItem("tableName") || "");
  const [selectedType, setSelectedType] = useState("CALL_STAFF");
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  useEffect(() => {
    const syncTable = () => {
      setTableId(localStorage.getItem("tableId") || "");
      setTableName(localStorage.getItem("tableName") || "");
    };
    window.addEventListener("tableNameUpdated", syncTable);
    window.addEventListener("storage", syncTable);
    return () => {
      window.removeEventListener("tableNameUpdated", syncTable);
      window.removeEventListener("storage", syncTable);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Date.now() < cooldownUntil) {
      const remain = Math.ceil((cooldownUntil - Date.now()) / 1000);
      toast.info(`Vui lòng đợi ${remain} giây trước khi gửi yêu cầu tiếp theo.`);
      return;
    }

    setIsSending(true);
    try {
      await customerService.requestTableAssistance({
        tableId: tableId || undefined,
        tableName: tableName || "Khách tại quầy / bàn",
        requestType: selectedType,
        note,
      });
      toast.success("Đã gửi yêu cầu tới quầy phục vụ! Nhân viên sẽ hỗ trợ bạn ngay.");
      setCooldownUntil(Date.now() + 20000);
      setNote("");
      setOpen(false);
    } catch (error) {
      toast.error(error.message || "Không thể gửi yêu cầu hỗ trợ");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Gọi nhân viên / Hỗ trợ tại bàn"
        className="fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-full bg-amber-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-95"
      >
        <BellRing className="size-4 animate-bounce" />
        <span>{tableName ? `Gọi NV • Bàn ${tableName}` : "Gọi nhân viên"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Yêu cầu hỗ trợ tại bàn
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {tableName ? `Vị trí hiện tại: Bàn ${tableName}` : "Gửi tín hiệu trực tiếp tới nhân viên phục vụ"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {!tableId && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Số bàn của bạn (nếu ngồi tại quán)
                  </label>
                  <input
                    type="text"
                    value={tableName}
                    onChange={(e) => {
                      setTableName(e.target.value);
                      localStorage.setItem("tableName", e.target.value);
                    }}
                    placeholder="VD: Bàn 05, Tầng 1..."
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                {ASSIST_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const active = selectedType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedType(item.type)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        active
                          ? "border-amber-600 bg-amber-50/80 dark:border-amber-500 dark:bg-amber-950/30"
                          : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          active
                            ? "bg-amber-600 text-white"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.label}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Ghi chú thêm (tùy chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Cho mình xin thêm 2 ly đá nhỏ..."
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-60"
                >
                  {isSending ? <Loader2 className="size-4 animate-spin" /> : <BellRing className="size-4" />}
                  <span>Gửi yêu cầu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

