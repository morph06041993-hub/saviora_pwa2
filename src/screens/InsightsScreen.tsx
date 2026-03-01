import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, MessageCircle, Moon } from 'lucide-react';
import * as api from '../utils/api';

export const InsightsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Чтобы понять, откуда пришли (опционально)

  // Состояние активной вкладки ('chat' или 'dream')
  // Если хотим, чтобы при переходе из снов открывалась вкладка снов, можно добавить логику проверки state
  const [activeTab, setActiveTab] = useState<'chat' | 'dream'>('chat');
  const [insights, setInsights] = useState<api.Insight[]>([]);

  // При загрузке проверяем, не передали ли нам желаемую вкладку при навигации
  useEffect(() => {
    if (location.state && (location.state as any).defaultTab) {
      setActiveTab((location.state as any).defaultTab);
    }
  }, [location]);

  // Загрузка данных при смене вкладки
  useEffect(() => {
    loadInsights();
  }, [activeTab]);

  const loadInsights = async () => {
    let data;
    if (activeTab === 'chat') {
      data = await api.getChatInsights();
    } else {
      data = await api.getDreamInsights();
    }
    setInsights(data);
  };

  const handleRemove = async (id: string) => {
    await api.deleteInsight(id);
    loadInsights();
  };

  // Клик по карточке ведет к источнику
  const handleCardClick = (item: api.Insight) => {
    if (item.type === 'dream') {
      // Идем к сну (если есть ID сна)
      if (item.sourceId) navigate(`/dream/${item.sourceId}`);
    } else {
      // Идем в чат
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Логотип-водяной знак */}
      <img src="/logo.png" className="watermark-logo" alt="" />
      
      {/* Пятна фона */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER */}
      <header className="pt-12 px-5 pb-4 flex items-center gap-4 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform hover:bg-white/20 border border-white/5"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold">Копилка мудрости</h1>
      </header>

      {/* ПЕРЕКЛЮЧАТЕЛЬ ВКЛАДОК (TABS) */}
      <div className="px-5 mb-6 flex p-1 bg-black/20 rounded-2xl mx-5 backdrop-blur-sm z-20">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`
            flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
            ${activeTab === 'chat' 
              ? 'bg-white text-[#6875dc] shadow-md' 
              : 'text-white/50 hover:text-white'}
          `}
        >
          <MessageCircle size={16} />
          Из бесед
        </button>
        <button 
          onClick={() => setActiveTab('dream')}
          className={`
            flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
            ${activeTab === 'dream' 
              ? 'bg-white text-[#6875dc] shadow-md' 
              : 'text-white/50 hover:text-white'}
          `}
        >
          <Moon size={16} />
          Из снов
        </button>
      </div>

      {/* СПИСОК КАРТОЧЕК */}
      <div className="flex-1 px-5 pb-10 overflow-y-auto no-scrollbar z-10 space-y-4">
        {insights.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center -mt-20 opacity-60">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
               {activeTab === 'chat' ? <MessageCircle size={32} /> : <Moon size={32} />}
            </div>
            <p className="font-medium text-lg">Здесь пока пусто</p>
            <p className="text-sm mt-2 max-w-[200px] leading-relaxed text-white/50">
              {activeTab === 'chat' 
                ? 'Сохраняйте важные сообщения из диалогов, нажав на них.' 
                : 'Сохраняйте выводы из анализа сновидений.'}
            </p>
          </div>
        ) : (
          insights.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleCardClick(item)}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-[24px] relative group animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-lg cursor-pointer active:scale-[0.98] transition-all hover:bg-white/15"
            >
              {/* Текст инсайта */}
              <p className="text-base text-white/95 leading-relaxed font-serif italic mb-4">
                "{item.text}"
              </p>
              
              {/* Футер карточки */}
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-full ${item.type === 'dream' ? 'bg-purple-400/20 text-purple-200' : 'bg-blue-400/20 text-blue-200'}`}>
                    {item.type === 'dream' ? <Moon size={10}/> : <MessageCircle size={10}/>}
                  </span>
                  <span className="text-xs text-white/40 font-bold uppercase tracking-wider">
                    {item.date}
                  </span>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                  className="p-2 -mr-2 text-white/30 hover:text-red-300 hover:bg-white/10 rounded-full transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};