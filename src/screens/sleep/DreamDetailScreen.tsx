import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Palette, Layers,
  MoreVertical, Star, History, Settings,
  X, Check, Tag, Info
} from 'lucide-react';
import * as api from '../../utils/api';

const DREAM_CATEGORIES = [
  'Яркий', 'Тревожный', 'Спокойный', 'Повторяющийся', 'Кошмар', 'Осознанный', 'Другой'
];

export const DreamDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dream, setDream] = useState<api.FeedDream | null>(null);
  
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('Яркий');
  const [editContext, setEditContext] = useState('');

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await api.getDreamById(id);
        if (data) setDream(data);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить этот сон?')) {
      navigate(-1);
    }
  };

  const handleOpenEdit = () => {
    if (!dream) return;
    setEditTitle(dream.title);
    setEditText(dream.dreamText);
    setEditCategory(dream.tags && dream.tags.length > 0 ? dream.tags[0] : 'Яркий');
    setEditContext((dream as any).context || ''); 
    
    setShowMenu(false);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!id) return;
    setDream(prev => prev ? ({
      ...prev,
      title: editTitle,
      dreamText: editText,
      tags: [editCategory],
    }) : null);
    setIsEditOpen(false);
  };

  if (!dream) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
      <div className="animate-pulse">Загрузка...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans flex flex-col relative overflow-hidden">
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <img src="/logo.png" alt="" className="w-[80vw] max-w-[500px] opacity-[0.05] blur-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      
      <header className="pt-12 px-5 pb-4 flex items-center justify-between z-30 relative">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform hover:bg-white/20 border border-white/5">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">Saviora</h1>
        </div>

        <div className="relative" ref={menuRef}>
            <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5 active:scale-95">
              <MoreVertical size={20}/>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 w-64 bg-[#6c5dd3]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="flex flex-col py-2">
                  <button onClick={handleOpenEdit} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white text-sm font-medium">
                    <Settings size={18} className="text-white/70" />
                    <span>Редактировать сон</span>
                  </button>
                  {/* ИЗМЕНЕНИЕ ЗДЕСЬ: Передаем state при навигации */}
                  <button 
                    onClick={() => { 
                      setShowMenu(false); 
                      navigate('/insights', { state: { defaultTab: 'dream' } }); 
                    }} 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white text-sm font-medium"
                  >
                    <Star size={18} className="text-white/70" />
                    <span>Любимые инсайты</span>
                  </button>
                  <button onClick={() => { setShowMenu(false); navigate(`/dream/${id}/analysis`); }} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white text-sm font-medium">
                    <History size={18} className="text-white/70" />
                    <span>История анализа</span>
                  </button>
                  <div className="h-px bg-white/10 my-1 mx-4" />
                  <button onClick={handleDelete} className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 transition-colors text-red-200 text-sm font-medium">
                    <Trash2 size={18} className="text-red-200" />
                    <span>Удалить сон</span>
                  </button>
                </div>
              </div>
            )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4 no-scrollbar z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg border border-white/10" />
          <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-white/5 shadow-sm">
            {new Date(dream.date).toLocaleDateString()}
          </div>
        </div>

        {/* Блок быстрого перехода к инсайтам (в теле экрана) */}
        {/* ИЗМЕНЕНИЕ ЗДЕСЬ ТОЖЕ: Добавляем клик с переходом на вкладку снов */}
        <div 
          onClick={() => navigate('/insights', { state: { defaultTab: 'dream' } })}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg cursor-pointer active:scale-[0.98] transition-all hover:bg-white/15"
        >
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-white/90">
            <Star size={14} fill="currentColor" className="text-white" /> Инсайты сновидения
          </h3>
          <p className="text-xs opacity-70 leading-relaxed text-white/80">
            Нажмите, чтобы открыть коллекцию всех сохраненных мудрых мыслей из диалогов.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-h-[400px] relative shadow-lg">
          <h2 className="text-xl font-serif font-bold mb-4 leading-tight">{dream.title}</h2>
          <p className="text-sm leading-7 opacity-90 whitespace-pre-wrap font-light">{dream.dreamText}</p>

          <div className="absolute bottom-4 right-4 flex gap-2 items-center">
            <button className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
              <Palette size={20} />
            </button>
            <button onClick={() => navigate(`/dream/${id}/analysis`)} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white">
              <Layers size={20} />
            </button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          
          <div className="relative w-full sm:max-w-lg bg-[#1c1c2e] border border-white/20 rounded-t-[32px] sm:rounded-3xl p-0 animate-in slide-in-from-bottom duration-300 flex flex-col h-[90vh] shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-5 border-b border-white/10 shrink-0 bg-[#7355af]">
              <button onClick={() => setIsEditOpen(false)} className="p-2 -ml-2 text-white/50 hover:text-white rounded-full transition-colors">
                <X size={24} />
              </button>

              <h3 className="text-lg font-bold text-white tracking-wide">Редактирование</h3>

              <button 
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${!editText.trim() ? 'text-white/30 cursor-not-allowed' : 'bg-white text-[#7355af] shadow-lg active:scale-95'}`}
              >
                <span>Сохранить</span>
                {!!editText.trim() && <Check size={16} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#7355af]">
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
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
                      onClick={() => setEditCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${editCategory === cat ? 'bg-white text-[#7355af] border-white shadow-md' : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Описание сна</label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Я оказался в..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base placeholder:text-white/20 focus:bg-white/10 focus:border-white/20 outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div>
                 <label className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                  <Info size={12} /> Контекст
                </label>
                <textarea
                  value={editContext}
                  onChange={(e) => setEditContext(e.target.value)}
                  placeholder="Мысли перед сном, события дня..."
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:bg-white/10 outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};