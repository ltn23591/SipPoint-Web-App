import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, RefreshCw, Minus } from "lucide-react";
import { AiApi } from "@/apis";

export function ChatbotAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Khởi tạo sessionId duy nhất để lưu trữ lịch sử
  const [sessionId, setSessionId] = useState("");

  const initializeSession = () => {
    // Lấy thông tin user hiện hành (nếu có) để phân biệt session
    const userStr = localStorage.getItem("user");
    let userId = "guest";
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userId = userObj._id || userObj.email || "guest";
      } catch {
        // bỏ qua
      }
    }

    const sessionKey = `chatbot_session_id_${userId}`;
    let sid;
    if (userId !== "guest") {
      sid = userId;
    } else {
      sid = localStorage.getItem(sessionKey);
      if (!sid) {
        sid = "session_guest_" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem(sessionKey, sid);
      }
    }
    // Lấy tin nhắn cũ nếu có
    const savedMessages = localStorage.getItem(`chat_history_${sid}`);
    setSessionId(sid);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Tin nhắn chào mừng mặc định
      const welcomeMessage = {
        role: "model",
        text: "Dạ, SipPoint xin chào bạn! Em là trợ lý ảo AI hỗ trợ tư vấn đồ uống và điểm thành viên. Quán đang có nhiều khuyến mãi hấp dẫn lắm ạ, em có thể giúp gì cho bạn hôm nay?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  useEffect(() => {
    initializeSession();
    
    // Lắng nghe sự kiện đăng nhập/đăng xuất để tải lại phiên chat
    const handleAuthChange = () => {
      initializeSession();
    };
    window.addEventListener("authChange", handleAuthChange);
    
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Lưu lịch sử chat cục bộ
  const saveChatHistory = (updatedMessages) => {
    if (sessionId) {
      localStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(updatedMessages));
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    if (!textToSend) {
      setInputValue("");
    }

    const newUserMessage = {
      role: "user",
      text: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setIsLoading(true);

    try {
      const response = await AiApi.chat({
        message: text,
        sessionId: sessionId,
      });

      const botReply = response.data?.data?.reply || "Dạ, hệ thống đang gặp chút sự cố nhỏ. Bạn vui lòng thử lại sau nhé!";
      
      const newBotMessage = {
        role: "model",
        text: botReply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, newBotMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      console.error("Lỗi khi kết nối với AI API:", error);
      const errorMessage = {
        role: "model",
        text: "Dạ, SipPoint xin lỗi ạ! Hệ thống phản hồi hơi chậm hoặc chưa được kết nối. Bạn hãy kiểm tra máy chủ backend của mình nhé!",
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa lịch sử chat để bắt đầu phiên mới
  const handleResetChat = () => {
    const welcomeMessage = {
      role: "model",
      text: "Dạ, SipPoint đã làm mới cuộc trò chuyện. Em có thể hỗ trợ gì thêm cho bạn ạ?",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    if (sessionId) {
      localStorage.removeItem(`chat_history_${sessionId}`);
    }
  };

  // Định dạng text có chứa Markdown đơn giản (**bold**, \n, - bullet)
  const renderFormattedText = (text) => {
    if (!text) return "";
    
    return text.split("\n").map((line, idx) => {
      let content = line;
      
      // Xử lý list item dạng gạch đầu dòng
      const isListItem = content.trim().startsWith("-");
      if (isListItem) {
        content = content.replace(/^-\s*/, "");
      }

      // Xử lý in đậm **text**
      const parts = [];
      const regex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-amber-950 dark:text-amber-300">{match[1]}</strong>);
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      if (isListItem) {
        return (
          <li key={idx} className="ml-4 list-disc my-1 text-sm leading-relaxed">
            {parts}
          </li>
        );
      }

      return (
        <p key={idx} className="min-h-[1.2rem] my-1 text-sm leading-relaxed">
          {parts}
        </p>
      );
    });
  };

  const suggestionChips = [
    "Menu hôm nay có gì?",
    "Quán đang có mã giảm giá nào?",
    "Tích lũy điểm SipPoints như thế nào?",
  ];

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end font-sans">
      {/* Cửa sổ Chatbot */}
      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-amber-100 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-800 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shadow-inner">
                  <Sparkles className="w-5 h-5 text-amber-100 animate-pulse" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  SipPoint Assistant
                </h3>
                <span className="text-[11px] text-amber-100/95 font-medium flex items-center gap-1">
                  AI trực tuyến 24/7
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleResetChat} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Làm mới chat"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Khung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
                    SP
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white rounded-tr-none"
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800 rounded-tl-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="space-y-1">{renderFormattedText(msg.text)}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-sm">
                  SP
                </div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-none px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chips gợi ý nhanh */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2 bg-zinc-50/50 dark:bg-zinc-950/20">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="text-xs px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 hover:border-amber-300 transition-all font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Form nhập dữ liệu */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi SipPoint AI..."
              className="flex-1 px-4 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-on-surface focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white rounded-xl transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Nút kích hoạt Tròn Chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-orange-500/20 active:scale-95 transition-all duration-300 border border-white/20 group relative"
        title="Trò chuyện với AI"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full animate-bounce"></span>
          </>
        )}
      </button>
    </div>
  );
}
