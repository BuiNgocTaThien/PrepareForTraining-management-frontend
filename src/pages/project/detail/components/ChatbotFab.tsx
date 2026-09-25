import { useState } from "react";
import { askChatbot } from "../../../../services/projectService";

interface ChatbotFabProps {
  projectId: string;
}

export function ChatbotFab({ projectId }: ChatbotFabProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user" | "bot", content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleAskChatbot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;
    
    const questionToAsk = chatQuestion.trim();
    setChatMessages(prev => [...prev, { role: "user", content: questionToAsk }]);
    setChatQuestion("");
    setChatLoading(true);
    
    try {
      const res = await askChatbot(projectId, questionToAsk);
      setChatMessages(prev => [...prev, { role: "bot", content: res.answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "bot", content: "❌ Rất tiếc, tôi không thể trả lời lúc này do lỗi kết nối với máy chủ AI." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isChatOpen && (
        <div className="w-[480px] bg-surface-card rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border border-surface-container-low overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center justify-between p-4 bg-primary/5 border-b border-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">smart_toy</span>
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-text-heading">ChatGPT AI Chat</h3>
                <p className="font-body-sm text-[11px] text-text-muted">Hỏi đáp tài liệu dự án</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-text-muted transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="p-5 bg-surface-card flex flex-col gap-4">
            <div className="bg-surface-container-low rounded-xl p-5 h-[400px] overflow-y-auto flex flex-col gap-4 font-body-md text-body-md leading-relaxed text-text-heading">
              {chatMessages.length === 0 && !chatLoading ? (
                <div className="text-text-muted flex flex-col items-center justify-center h-full gap-2 opacity-70 text-center">
                  <span className="material-symbols-outlined text-[36px]">menu_book</span>
                  <span className="text-xs">Hãy đặt câu hỏi,<br/>tôi sẽ tìm đáp án trong tài liệu...</span>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className={`p-3 rounded-2xl whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-card text-text-heading border border-surface-container-low rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="self-start flex items-center gap-2 text-text-muted animate-pulse mt-2">
                      <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                      <span className="text-sm">Đang suy nghĩ...</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <form onSubmit={handleAskChatbot} className="flex gap-2">
              <input 
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-primary/30 transition-all text-text-heading placeholder-text-muted"
                disabled={chatLoading}
              />
              <button 
                type="submit" 
                disabled={chatLoading || !chatQuestion.trim()}
                className="bg-primary text-on-primary w-11 h-11 rounded-xl flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isChatOpen ? 'bg-surface-container text-text-heading' : 'bg-primary text-on-primary'}`}
        title="Mở AI Chatbot"
      >
        <span className="material-symbols-outlined text-[28px]">
          {isChatOpen ? 'keyboard_arrow_down' : 'smart_toy'}
        </span>
      </button>
    </div>
  );
}
