import React, { useState, useEffect, useRef } from "react";
import { askChatbot, uploadDocument, reloadAiKnowledge } from "../../../../services/projectService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Document } from "../../../../types/project";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

interface ChatFullscreenProps {
  projectId: string;
  documents: Document[];
  onRefreshDocs: () => void;
}

export function ChatFullscreen({ projectId, documents, onRefreshDocs }: ChatFullscreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // State for Chat Sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedDocSources, setSelectedDocSources] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleDocSource = (fileName: string) => {
    setSelectedDocSources(prev => 
      prev.includes(fileName) ? prev.filter(f => f !== fileName) : [...prev, fileName]
    );
  };

  // Load sessions from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(`chat_sessions_${projectId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed);
        if (parsed.length > 0 && !activeSessionId) {
          setActiveSessionId(parsed[0].id);
        }
      } else {
        handleNewChat();
      }
    }
  }, [isOpen, projectId]);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(`chat_sessions_${projectId}`, JSON.stringify(sessions));
    }
  }, [sessions, projectId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, chatLoading]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "Cuộc trò chuyện mới",
      messages: [],
      updatedAt: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleAskChatbot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || !activeSessionId) return;
    
    const questionToAsk = chatQuestion.trim();
    
    // Update session with user message
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        // Auto generate title if it's the first question
        const title = s.messages.length === 0 ? questionToAsk.slice(0, 30) + (questionToAsk.length > 30 ? "..." : "") : s.title;
        return {
          ...s,
          title,
          updatedAt: Date.now(),
          messages: [...s.messages, { role: "user", content: questionToAsk }]
        };
      }
      return s;
    }));
    
    setChatQuestion("");
    setChatLoading(true);
    
    try {
      // Pass the previous history for context
      const history = activeSession?.messages || [];
      const res = await askChatbot(projectId, questionToAsk, history, selectedDocSources.length > 0 ? selectedDocSources : undefined);
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, { role: "bot", content: res.answer || res.data?.answer }] // Handle potential wrapper differences
          };
        }
        return s;
      }));
    } catch (err) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, { role: "bot", content: "❌ Rất tiếc, tôi không thể trả lời lúc này do lỗi kết nối với máy chủ AI." }]
          };
        }
        return s;
      }));
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 100MB");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadDocument(projectId, file);
      // Notify AI service to sync the new file into VectorDB
      try {
        await reloadAiKnowledge(projectId);
      } catch (aiErr) {
        console.error("AI Sync failed", aiErr);
      }
      onRefreshDocs();
      // Auto-select the newly uploaded file source if needed
      if (res.data && res.data.storagePath) {
        setSelectedDocSources(prev => prev.includes(res.data.storagePath) ? prev : [...prev, res.data.storagePath]);
      }
    } catch (err) {
      alert("Lỗi tải lên: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        title="Mở AI Chatbot (Toàn màn hình)"
      >
        <span className="material-symbols-outlined text-[28px]">smart_toy</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col md:flex-row animate-in fade-in duration-200">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[280px] xl:w-[320px] bg-surface-card border-r border-surface-container-low flex flex-col shrink-0">
            <div className="p-4 flex items-center justify-between border-b border-surface-container-low">
              <button 
                onClick={() => setIsOpen(false)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <button 
                onClick={handleNewChat}
                className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2.5 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Cuộc trò chuyện mới
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-2">Lịch sử</div>
              {sessions.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${activeSessionId === s.id ? 'bg-surface-container text-text-heading' : 'hover:bg-surface-container-low text-text-muted'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="material-symbols-outlined text-[18px] opacity-70">chat_bubble</span>
                    <span className="truncate text-sm font-medium">{s.title}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteChat(e, s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-error transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CHAT AREA */}
          <div className="flex-1 flex flex-col bg-background relative h-full">
            
            {/* Header */}
            <div className="h-16 border-b border-surface-container-low flex items-center justify-between px-4 lg:px-8 bg-surface-card/50 backdrop-blur-sm z-10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-text-heading font-semibold">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                  9Router AI
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className={`hidden lg:flex w-10 h-10 rounded-xl items-center justify-center transition-colors ${isRightSidebarOpen ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-container hover:text-text-heading'}`}
                  title="Ẩn/Hiện bảng tài liệu"
                >
                  <span className="material-symbols-outlined">view_sidebar</span>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-surface-container hover:text-error transition-colors"
                  title="Đóng chat"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
              <div className="max-w-3xl mx-auto flex flex-col gap-6">
                {!activeSession || activeSession.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-60 text-center">
                    <span className="material-symbols-outlined text-[64px] mb-4 text-primary">forum</span>
                    <h2 className="text-xl font-semibold text-text-heading mb-2">Tôi có thể giúp gì cho bạn hôm nay?</h2>
                    <p className="text-text-muted max-w-sm">Hãy chọn một tài liệu hoặc tải lên tài liệu mới để bắt đầu đặt câu hỏi phân tích.</p>
                  </div>
                ) : (
                  <>
                    {activeSession.messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 mt-1">
                            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                          </div>
                        )}
                        <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-surface-container text-text-heading' : 'bg-transparent text-text-heading'}`}>
                          {msg.role === 'user' ? (
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          ) : (
                            <div className="prose prose-sm md:prose-base prose-primary dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-text-muted shrink-0 mt-1">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        </div>
                        <div className="p-4 text-text-muted animate-pulse">
                          Đang phân tích...
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 lg:p-6 bg-background">
              <div className="max-w-3xl mx-auto relative">
                {selectedDocSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 px-2">
                    {selectedDocSources.map(doc => {
                      const documentItem = documents.find(d => d.storagePath === doc);
                      const displayName = documentItem ? documentItem.fileName : doc;
                      return (
                        <div key={doc} className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full text-xs text-text-heading border border-surface-container">
                          <span className="material-symbols-outlined text-[14px] text-primary">description</span>
                          <span className="max-w-[150px] truncate" title={displayName}>{displayName}</span>
                          <button type="button" onClick={() => toggleDocSource(doc)} className="hover:text-error ml-1 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <form 
                  onSubmit={handleAskChatbot}
                  className="relative flex items-end gap-2 bg-surface-container-low border border-surface-container rounded-3xl p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-4 ring-primary/10 transition-all"
                >
                  <textarea 
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAskChatbot(e);
                      }
                    }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 max-h-48 min-h-[44px] bg-transparent text-text-heading outline-none resize-none px-2 py-2.5 placeholder-text-muted leading-relaxed"
                    rows={1}
                    disabled={chatLoading}
                  />
                  <button 
                    type="submit"
                    disabled={chatLoading || !chatQuestion.trim()}
                    className="w-10 h-10 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors mb-0.5"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                  </button>
                </form>
                <div className="text-center mt-2 text-xs text-text-muted opacity-70">
                  AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (DOCUMENTS) */}
          <div className={`hidden lg:flex flex-col bg-surface-card shrink-0 transition-all duration-300 overflow-hidden ${isRightSidebarOpen ? 'w-[280px] xl:w-[320px] border-l border-surface-container-low' : 'w-0 border-l-0'}`}>
            <div className="h-16 border-b border-surface-container-low flex items-center justify-between px-4 bg-surface-card/50 backdrop-blur-sm z-10 shrink-0 w-[280px] xl:w-[320px]">
              <div className="flex items-center gap-2 font-semibold text-sm text-text-heading">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                Nguồn tài liệu
              </div>
              <button 
                onClick={() => setIsRightSidebarOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-container transition-colors"
                title="Đóng bảng tài liệu"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
            
            <div className="w-[280px] xl:w-[320px] flex-1 flex flex-col h-[calc(100%-64px)]">
              <div className="p-4 border-b border-surface-container-low shrink-0">
                <input 
                  type="file" 
                  id="chat-upload-sidebar"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label 
                  htmlFor="chat-upload-sidebar" 
                  className={`w-full flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl border-2 border-dashed border-surface-container hover:bg-surface-container-low hover:border-primary/50 cursor-pointer transition-all ${isUploading ? 'opacity-50 pointer-events-none' : 'text-primary'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{isUploading ? 'sync' : 'upload_file'}</span>
                  <span className="font-medium">{isUploading ? 'Đang tải lên...' : 'Tải tài liệu mới'}</span>
                </label>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Chọn file phân tích</div>
                {documents.map(d => (
                  <label key={d.id} className="flex items-start gap-3 p-3 hover:bg-surface-container-low rounded-xl cursor-pointer transition-colors group border border-transparent hover:border-surface-container">
                    <input 
                      type="checkbox" 
                      checked={d.storagePath ? selectedDocSources.includes(d.storagePath) : false} 
                      onChange={() => d.storagePath && toggleDocSource(d.storagePath)} 
                      className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30 cursor-pointer shrink-0" 
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-text-heading break-words leading-tight group-hover:text-primary transition-colors">{d.fileName}</span>
                    </div>
                  </label>
                ))}
                {documents.length === 0 && (
                  <div className="text-center p-6 text-text-muted text-sm border border-dashed border-surface-container rounded-xl">
                    Dự án chưa có tài liệu nào.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
