import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { MyDreamCard } from './MyDreamCard';
import { Plus, X, Moon, Tag, Info, Check } from 'lucide-react';
import * as api from '../../utils/api';

const DREAM_CATEGORIES = [
  'Яркий', 
  'Тревожный', 
  'Спокойный', 
  'Повторяющийся', 
  'Кошмар', 
  'Осознанный', 
  'Другой'
];

export const SleepScreen = () => {
  const navigate = useNavigate();
  
  const [dreams, setDreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('Яркий');
  const [context, setContext] = useState('');

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    setLoading(true);
    try {
      const data = await api.getMyDreams();
      setDreams(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newText.trim()) return;

    const dream = await api.createDream(newText, newTitle, category, context);
    setDreams([dream, ...dreams]);
    
    setIsWriteOpen(false);
    setNewText('');
    setNewTitle('');
    setCategory('Яркий');
    setContext('');
  };

  return (
    // ГЛАВНЫЙ КОНТЕЙНЕР: h-screen и overflow-hidden, чтобы скролл был только внутри списка
    <div className="h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* ФОН (Абсолютное позиционирование, не влияет на лейаут) */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <img src="/logo.png" className="watermark-logo pointer-events-none" alt="" />

      {/* HEADER (Фиксированный, не скроллится) */}
      <header className="z-30 pt-12 pb-4 px-5 bg-gradient-to-b from-[#6875dc] to-transparent shrink-0 flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
          Дневник <Moon size={20} className="fill-white/20 text-white" />
        </h1>
        <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
          {dreams.length} снов
        </div>
      </header>

      {/* ОБЛАСТЬ СКРОЛЛА (Занимает всё оставшееся место) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-white/40 text-xs">Загрузка дневника...</div>
        ) : dreams.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 -mt-20">
            <p>Ваш дневник снов пуст.</p>
            <p className="text-sm mt-2">Запишите свой первый сон!</p>
          </div>
        ) : (
          dreams.map(dream => (
            <MyDreamCard 
              key={dream.id} 
              dream={dream} 
              onClick={() => navigate(`/dream/${dream.id}`)} 
            />
          ))
        )}
      </div>

      {/* FAB (Кнопка добавления) - поверх всего */}
      <button 
        onClick={() => setIsWriteOpen(true)}
        className="absolute bottom-40 right-4 w-14 h-14 rounded-full bg-white text-[#6875dc] shadow-xl shadow-black/20 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* МОДАЛКА НОВОГО СНА */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsWriteOpen(false)} />
          
          <div className="relative w-full sm:max-w-lg bg-[#1c1c2e] border border-white/20 rounded-t-[32px] sm:rounded-3xl p-0 animate-in slide-in-from-bottom duration-300 flex flex-col h-[90vh] shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-white/10 shrink-0 bg-[#7355af]">
              <button onClick={() => setIsWriteOpen(false)} className="p-2 -ml-2 text-white/50 hover:text-white rounded-full transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-lg font-bold text-white tracking-wide">Новая запись</h3>
              <button 
                onClick={handleSave}
                disabled={!newText.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${!newText.trim() ? 'text-white/30 cursor-not-allowed' : 'bg-white text-[#7355af] shadow-lg active:scale-95'}`}
              >
                <span>Сохранить</span>
                {!!newText.trim() && <Check size={16} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#7355af]">
              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Название сна..."
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-2xl font-serif font-bold placeholder:text-white/30 focus:border-white/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-3">
                  <Tag size={12} /> Категория
                </label>
                <div className="flex flex-wrap gap-2">
                  {DREAM_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${category === cat ? 'bg-white text-[#7355af] border-white shadow-md' : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Описание сна</label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Я оказался в..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base placeholder:text-white/20 focus:bg-white/10 focus:border-white/20 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div>
                 <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                  <Info size={12} /> Контекст
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Мысли перед сном, события дня..."
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:bg-white/10 outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Навигация (Фиксированная снизу) */}
      <Navigation />
    </div>
  );
};