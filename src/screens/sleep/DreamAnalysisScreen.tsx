import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Mic, Send, Trash2 } from 'lucide-react';
import * as api from '../../utils/api';

export const DreamAnalysisScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dream, setDream] = useState<api.FeedDream | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await api.getDreamById(id);
        if (data) {
          setDream(data);
          // Имитируем приветствие по первому блоку
          if (data.blocks && data.blocks.length > 0) {
            setMessages([{
              id: 'init',
              text: `Анализируем блок: "${data.blocks[0].text}"`,
              sender: 'system'
            }]);
            
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: 'ai-1',
                text: 'Что вы чувствовали в этот момент?',
                sender: 'ai'
              }]);
            }, 1000);
          }
        }
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const txt = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: txt, sender: 'user' }]);
    setIsTyping(true);

    // Ответ ИИ
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        text: 'Это очень символично. Продолжайте...', 
        sender: 'ai' 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!dream) return <div className="text-white p-10">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      <header className="pt-12 px-5 pb-4 flex items-center justify-between z-20 bg-[#6875dc]/90 backdrop-blur-sm sticky top-0">
        <button onClick={() => navigate(-1)}><ArrowLeft/></button>
        <h1 className="font-bold text-lg">Анализ сновидения</h1>
        <button><Trash2 size={20} className="text-white/50"/></button>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4 space-y-4">
        
        {/* Блоки снов (Скрин 2) */}
        {messages.map((msg, idx) => {
          if (msg.sender === 'system') {
            return (
              <div key={idx} className="bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white/80 mb-6">
                <p className="opacity-50 text-xs uppercase font-bold mb-2">Анализируемый блок:</p>
                {msg.text}
              </div>
            );
          }
          const isUser = msg.sender === 'user';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isUser && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg flex items-center justify-center"><Bot size={16}/></div>}
              <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${isUser ? 'bg-[#7c3aed]/80 text-white rounded-br-none' : 'bg-white/20 text-white rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && <div className="text-xs text-white/40 ml-12">Печатает...</div>}
        <div ref={endRef} />
      </div>

      {/* INPUT (Скрин 3 - Капсула внизу) */}
      <div className="fixed bottom-8 left-0 right-0 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#fde047] text-black flex items-center justify-center font-bold shadow-lg shrink-0">
          {/* Тут может быть луна-кнопка для прогресса, как на скрине */}
          ☾
        </div>
        
        <div className="flex-1 bg-[#7355af]/90 backdrop-blur-xl border border-white/20 rounded-[30px] p-1.5 pl-5 flex items-center shadow-2xl">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опиши свой сон"
            className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          {input.trim() ? (
            <button onClick={handleSend} className="p-2 bg-white/20 rounded-full mr-1 hover:bg-white/30"><Send size={18}/></button>
          ) : (
            <button className="p-2 text-white/50 mr-1"><Mic size={20}/></button>
          )}
        </div>
      </div>

    </div>
  );
};