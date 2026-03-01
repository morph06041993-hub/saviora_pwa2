import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Calendar, Ghost } from 'lucide-react';
import * as api from '../utils/api';

export const HistoryScreen = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const allConvos = await api.getAllConvos();
      setChats(allConvos);
    };
    loadHistory();
  }, []);

  return (
    // ФОН: Тот самый фиолетовый градиент
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Пятна для глубины (как в Инсайтах и Чате) */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* HEADER */}
      <header className="pt-12 px-5 pb-6 flex items-center gap-4 z-20 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform border border-white/10 hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold">История бесед</h1>
      </header>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-4 no-scrollbar z-10">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/chat/${chat.id}`)} 
            className="
              bg-white/10 backdrop-blur-md border border-white/10 
              p-5 rounded-[24px] relative group transition-all 
              hover:bg-white/20 active:scale-[0.98] cursor-pointer shadow-lg
            "
          >
            {/* Верхняя строка: Дата и Категория */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90 border border-white/5">
                  <Calendar size={14} />
                </div>
                <span className="text-sm font-bold opacity-90">{chat.date}</span>
              </div>
              
              {chat.category && (
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/5 text-[10px] uppercase tracking-wider text-white/80 font-bold">
                  {chat.category}
                </span>
              )}
            </div>

            {/* Заголовок и Контекст */}
            <h3 className="text-lg font-serif mb-2 leading-tight font-bold">{chat.title}</h3>
            
            {chat.context && (
              <p className="text-xs text-white/60 line-clamp-2 mb-3 bg-black/10 p-3 rounded-xl border border-white/5 italic">
                "{chat.context}"
              </p>
            )}
            
            {/* Нижняя строка: кол-во сообщений */}
            <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
              <MessageSquare size={14} />
              <span>{chat.messages?.length || 0} сообщений</span>
            </div>
          </div>
        ))}

        {/* ЕСЛИ ПУСТО */}
        {chats.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center -mt-20">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10 shadow-lg">
              <Ghost size={32} className="text-white/70" />
            </div>
            <p className="text-xl font-medium mb-2 text-white/90">История пуста</p>
            <p className="text-sm text-white/50">Здесь будут храниться ваши прошлые разговоры с ИИ.</p>
          </div>
        )}
      </div>
    </div>
  );
};