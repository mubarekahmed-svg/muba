import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCw, BookOpen, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, theme = 'light' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isLight = theme === 'light';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Greetings! I am the AI Research Assistant for Hassen Mosa Halil. I can answer questions regarding Hassen's 27+ peer-reviewed research papers, clinical findings in maternal & neonatal health, educational background, or editorial appointments at Werabe University. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const samplePrompts = [
    "Summarize Hassen's research on birth asphyxia.",
    "What are his findings on preterm birth risk factors?",
    "Which journals does Hassen edit or review for?",
    "How can I invite Hassen for peer review or research collaboration?",
  ];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const assistantText = data.reply || data.error || "I apologize, I could not generate a response.";

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered a network issue contacting the server. Please verify your connection or try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-end p-0 sm:p-4 ${
      isLight ? 'bg-stone-900/40' : 'bg-black/90'
    }`}>
      <div className={`border-l sm:border w-full sm:max-w-lg h-full sm:h-[88vh] sm:rounded-sm flex flex-col shadow-2xl overflow-hidden ${
        isLight
          ? 'bg-white border-stone-300 text-stone-900'
          : 'bg-[#0A0A0A] border-white/20 text-white'
      }`}>
        
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          isLight ? 'bg-stone-100 border-stone-200' : 'bg-zinc-900 border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-sm font-mono font-bold flex items-center justify-center text-xs ${
              isLight ? 'bg-stone-900 text-white' : 'bg-white text-black'
            }`}>
              AI
            </div>
            <div>
              <h3 className={`text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}>
                Research Assistant
                <span className={`px-2 py-0.5 text-[9px] font-mono uppercase border rounded-sm ${
                  isLight ? 'bg-stone-200 text-stone-700 border-stone-300' : 'bg-zinc-800 text-zinc-300 border-white/10'
                }`}>
                  Gemini
                </span>
              </h3>
              <p className={`text-[10px] font-mono ${isLight ? 'text-stone-500' : 'text-zinc-500'}`}>
                Publications & Academic Knowledgebase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`text-xs font-mono cursor-pointer ${
              isLight ? 'text-stone-500 hover:text-stone-900' : 'text-zinc-500 hover:text-white'
            }`}
          >
            [✕]
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-mono">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className={`w-6 h-6 rounded-sm border flex items-center justify-center shrink-0 text-[10px] font-mono mt-1 ${
                  isLight ? 'bg-stone-200 border-stone-300 text-stone-800' : 'bg-zinc-800 border-white/10 text-white'
                }`}>
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-sm p-3.5 leading-relaxed ${
                  msg.sender === 'user'
                    ? isLight
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-white text-black font-semibold'
                    : isLight
                      ? 'bg-stone-100 border border-stone-200 text-stone-900 whitespace-pre-wrap'
                      : 'bg-zinc-900 border border-white/10 text-zinc-200 whitespace-pre-wrap'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-1 text-right font-mono ${
                    msg.sender === 'user'
                      ? isLight ? 'text-stone-300' : 'text-zinc-600'
                      : isLight ? 'text-stone-500' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 text-[10px] font-mono mt-1 font-bold ${
                  isLight ? 'bg-stone-900 text-white' : 'bg-white text-black'
                }`}>
                  YOU
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className={`flex items-center gap-2 text-xs py-2 font-mono ${
              isLight ? 'text-stone-500' : 'text-zinc-500'
            }`}>
              <RefreshCw className={`w-3.5 h-3.5 animate-spin ${isLight ? 'text-stone-900' : 'text-white'}`} />
              <span>Analyzing research corpus...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className={`p-3 border-t shrink-0 ${
          isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 border-white/10'
        }`}>
          <p className={`text-[9px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1 ${
            isLight ? 'text-stone-500 font-semibold' : 'text-zinc-500'
          }`}>
            <BookOpen className={`w-3 h-3 ${isLight ? 'text-stone-600' : 'text-zinc-400'}`} /> Suggested Queries:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className={`text-[10px] font-mono px-2.5 py-1 border transition-colors cursor-pointer text-left truncate max-w-full disabled:opacity-50 rounded-sm ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-700 hover:text-stone-900'
                    : 'bg-[#0A0A0A] hover:bg-zinc-800 border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className={`p-3 border-t shrink-0 ${
          isLight ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 border-white/10'
        }`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Hassen's research..."
              disabled={loading}
              className={`flex-1 border rounded-sm px-3 py-2 text-xs font-mono focus:outline-none disabled:opacity-50 ${
                isLight
                  ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-stone-500'
                  : 'bg-[#0A0A0A] border-white/10 text-white placeholder-zinc-500 focus:border-white/30'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2 font-bold rounded-sm disabled:opacity-40 transition-colors cursor-pointer ${
                isLight
                  ? 'bg-stone-900 text-white hover:bg-stone-800'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
