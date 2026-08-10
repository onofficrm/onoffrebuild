import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: '안녕하세요! 온오프마케팅 AI 어시스턴트입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      if (data.result) {
        setMessages(prev => [...prev, { role: 'ai', content: data.result }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'ai', content: data.error }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: '입력을 처리하는 중 문제가 발생했습니다.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: '서버와 통신하는 중 에러가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
        {/* KakaoTalk 1:1 Consultation Floating Button */}
        <a
          href="http://pf.kakao.com/_MTlNK/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FEE500] text-[#371D1E] hover:bg-[#FDD800] px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-[0_8px_30px_rgba(254,229,0,0.45)] flex items-center gap-2.5 transition-all hover:scale-105 group font-black text-sm border border-[#e6ce00]"
        >
          <MessageCircle size={22} className="fill-[#371D1E] text-[#371D1E] group-hover:rotate-12 transition-transform" />
          <span>카카오톡 상담하기</span>
        </a>
      </div>

      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full sm:w-[400px] h-[520px] max-h-screen sm:max-h-[82vh] bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-blue-600 p-4 sm:rounded-t-2xl flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <span className="font-bold">AI 홈페이지 상담사</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full text-blue-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <a
            href="http://pf.kakao.com/_MTlNK/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FEE500] px-4 py-2.5 flex justify-between items-center text-[#371D1E] text-xs font-bold hover:bg-[#FDD800] transition-colors border-b border-[#e6ce00] shrink-0"
          >
            <span>💬 담당 마케터 1:1 실시간 직통 상담</span>
            <span className="bg-[#371D1E] text-[#FEE500] px-2.5 py-1 rounded-md text-[11px] font-black">카톡 연결</span>
          </a>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-sm text-slate-500">답변을 작성중입니다...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex bg-slate-100 rounded-full p-1 overflow-hidden">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' ? handleSend() : null}
                placeholder="AI에게 질문해보세요!"
                className="flex-1 bg-transparent px-4 text-sm focus:outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors shrink-0"
              >
                <Send size={18} className="mr-0.5 mt-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
