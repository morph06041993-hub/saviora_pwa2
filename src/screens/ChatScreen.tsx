import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ArrowLeft, Send, MoreVertical, Zap, Settings, Heart, History, X } from 'lucide-react';
import * as api from '../utils/api'; 

const CATEGORIES = ['Личное', 'Работа', 'Учеба', 'Здоровье', 'Финансы', 'Отношения', 'Путешествия', 'Другое'];

export const ChatScreen = () => {
  const navigate = useNavigate();
  const { dateId } = useParams(); // Получаем дату из URL
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Основные состояния
  const [convo, setConvo] = useState<api.ChatConvo | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Состояния для Модального окна настройки
  const [showSetup, setShowSetup] = useState(false);
  const [setupTitle, setSetupTitle] = useState('');
  const [setupCategory, setSetupCategory] = useState('');
  const [setupContext, setSetupContext] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  // 1. ЗАГРУЗКА ЧАТА
  useEffect(() => {
    const loadChat = async () => {
      setLoading(true);
      setMessages([]); 
      
      try {
        let currentConvo;
        
        // Определяем дату
        let targetDateId = dateId;
        if (!targetDateId) {
          const selectedKey = localStorage.getItem('saviora_selected_date_key');
          targetDateId = selectedKey || new Date().toISOString().split('T')[0];
        }

        currentConvo = await api.getConvoById(targetDateId);

        setConvo(currentConvo);
        setMessages(currentConvo.messages);

        // ЛОГИКА: Если чат пустой -> ПОКАЗАТЬ НАСТРОЙКУ
        if (currentConvo.messages.length === 0) {
          setShowSetup(true);
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [dateId]);

  // Автоскролл
  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Закрытие меню
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);


  // 2. СОХРАНЕНИЕ НАСТРОЕК
  const handleSaveSetup = async () => {
    if (!convo) return;
    
    const finalCategory = setupCategory === 'Другое' ? customCategory : setupCategory;
    const finalTitle = setupTitle.trim() || 'Беседа';

    const updated = await api.updateConvoMetadata(convo.id, {
      title: finalTitle,
      category: finalCategory,
      context: setupContext
    });
    
    setConvo(updated || convo);
    setShowSetup(false);

    const welcomeText = setupContext 
      ? `Понял. Контекст: "${setupContext}". Что ты чувствуешь по этому поводу?`
      : 'Привет! Расскажи, как прошел твой день?';
      
    const welcomeMsg = await api.sendMessage(convo.id, welcomeText, 'assistant');
    setMessages([welcomeMsg]);
  };

  const handleSkipSetup = async () => {
    setShowSetup(false);
    if (convo && messages.length === 0) {
        const welcomeMsg = await api.sendMessage(convo.id, 'Привет! Как прошел твой день?', 'assistant');
        setMessages([welcomeMsg]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !convo) return;
    const textToSend = input;
    setInput(''); 

    const userMsg = await api.sendMessage(convo.id, textToSend, 'user');
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      const aiMsg = await api.sendMessage(convo.id, 'Интересно... Продолжай.', 'assistant');
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleLike = async (msgId: string, text: string) => {
    if (!convo) return;
    const isNowLiked = await api.toggleInsight(msgId, text, convo.id);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isLiked: isNowLiked } : m));
  };

  return (
    // ИЗМЕНЕНО: Фон градиент (6875dc -> 7355af)
    <div className="h-[100dvh] text-white flex flex-col font-sans relative overflow-hidden bg-gradient-to-br from-[#6875dc] to-[#7355af]">
      
      <img src="/logo.png" className="watermark-logo" alt="" />
      
      {/* HEADER */}
      <header className="pt-12 px-5 pb-4 flex items-center justify-between z-20 shrink-0 bg-white/5 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="overflow-hidden">
            <h1 className="text-2xl font-serif font-bold" >  
              {convo?.title || 'Загрузка...'} 
            </h1>
            <p className="text-xs text-white/50 flex items-center gap-1">
              {convo?.date} • {convo?.category || 'Новая'}
            </p>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isMenuOpen ? 'bg-white/20' : 'bg-white/5'}`}
          >
            <MoreVertical size={20} className="text-white/60" />
          </button>

          {isMenuOpen && (
            <div className="absolute top-12 right-0 w-52 bg-[#7355af]/100 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setShowSetup(true)} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/10 text-sm text-left text-white transition-colors border-b border-white/5">
                <Settings size={16} className="text-purple-400" />
                Настройки беседы
              </button>
              <button onClick={() => navigate('/insights')} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/10 text-sm text-left text-white transition-colors border-b border-white/5">
                <Heart size={16} className="text-pink-400" />
                Любимые инсайты
              </button>
              <button onClick={() => navigate('/history')} className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/10 text-sm text-left text-white transition-colors">
                <History size={16} className="text-blue-400" />
                История бесед
              </button>
            </div>
          )}
        </div>
      </header>

      {/* --- МОДАЛЬНОЕ ОКНО НАСТРОЙКИ (SETUP) --- */}
      {showSetup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleSkipSetup} />
          
          <div className="relative w-full max-w-sm bg-[#7355af]/80 backdrop-blur-2xl border border-white/15 rounded-[32px] p-6 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">О чем поговорим?</h2>
              <button onClick={handleSkipSetup} className="p-2 -mr-2 text-white/40 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-5">
              {/* Название */}
              <div>
                <label className="text-xs text-white/50 ml-1 mb-1.5 block uppercase tracking-wider">Название</label>
                <input 
                  type="text" 
                  value={setupTitle}
                  onChange={(e) => setSetupTitle(e.target.value)}
                  placeholder="Например: Сон о море"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Категория */}
              <div>
                <label className="text-xs text-white/50 ml-1 mb-2 block uppercase tracking-wider">Категория</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSetupCategory(cat)}
                      className={`
                        px-3 py-1.5 rounded-xl text-xs font-medium transition-all border
                        ${setupCategory === cat 
                          ? 'bg-white text-black border-white' 
                          : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'}
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {setupCategory === 'Другое' && (
                  <input 
                    type="text" 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Ваша категория..."
                    className="w-full mt-3 bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white outline-none animate-in fade-in slide-in-from-top-2"
                  />
                )}
              </div>

              {/* Контекст */}
              <div>
                <label className="text-xs text-white/50 ml-1 mb-1.5 block uppercase tracking-wider">Контекст</label>
                <textarea 
                  value={setupContext}
                  onChange={(e) => setSetupContext(e.target.value)}
                  placeholder="Опиши кратко ситуацию, мысли или детали сна..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none resize-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSkipSetup}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-medium text-white/60 hover:bg-white/5 transition-colors"
                >
                  Пропустить
                </button>
                <button 
                  onClick={handleSaveSetup}
                  disabled={!setupTitle && !setupCategory && !setupContext}
                  className="flex-1 py-3.5 bg-white text-black rounded-2xl text-sm font-bold hover:bg-white/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Начать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* СПИСОК СООБЩЕНИЙ */}
      <div className="flex-1 overflow-y-auto px-4 pb-64 space-y-4 z-10 pt-4 no-scrollbar">
        {loading ? (
          <div className="text-center text-white/30 mt-10">Загрузка...</div>
        ) : messages.length === 0 && !showSetup ? (
           <div className="text-center text-white/30 mt-10">Диалог пуст.</div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isLiked = api.checkIsLiked(msg.id);
            return (
              <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${isUser ? 'bg-indigo-500/20' : 'bg-white/10'}`}>
                  {isUser ? <Settings size={14} /> : <Zap size={16} />}
                </div>
                
                <div className="relative max-w-[80%]">
                  <div className={`relative p-3.5 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-indigo-500 text-white rounded-tr-sm' : 'bg-white/10 border border-white/10 text-white/90 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  {!isUser && (
                    <button 
                      onClick={() => handleLike(msg.id, msg.text)}
                      className={`absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 ${isLiked ? 'opacity-100 text-pink-500' : 'opacity-0 group-hover:opacity-50 hover:!opacity-100 text-white/40'}`}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ПОЛЕ ВВОДА (ПОДНЯТО) */}
      <div className="fixed bottom-[140px] left-0 right-0 px-5 z-30">
        <div className="p-4 flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-lg">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-white/40 h-full font-sans"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all hover:bg-white/20"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};