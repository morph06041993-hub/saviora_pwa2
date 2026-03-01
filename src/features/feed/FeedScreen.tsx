import React, { useState } from 'react';
import { useFeed } from './useFeed';
import { DreamCard } from './DreamCard';
import Navigation from '../../components/Navigation';
import { Search, X, Send } from 'lucide-react';

export const FeedScreen = () => {
  const { dreams, loading, error, toggleLike, changeSort } = useFeed();
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  
  // Состояние для комментариев
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Хранилище комментариев
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});

  const handleTabChange = (tab: 'latest' | 'popular') => {
    setActiveTab(tab);
    changeSort(tab);
  };

  const handleCommentClick = (dreamId: string) => {
    setOpenCommentsId(dreamId);
  };

  const handleSendComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!commentText.trim() || !openCommentsId) return;
    
    const newComment = {
      id: Date.now(),
      text: commentText,
      author: 'Я', 
      time: 'Только что'
    };
    
    setCommentsMap(prev => ({
      ...prev,
      [openCommentsId]: [...(prev[openCommentsId] || []), newComment]
    }));

    setCommentText('');
  };

  const currentComments = openCommentsId ? (commentsMap[openCommentsId] || []) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans pb-24 relative overflow-hidden">
      
      {/* ФОН */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[30px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
       <img src="/logo.png" className="watermark-logo" alt="" />

      {/* HEADER + TABS */}
      <div className="sticky top-0 z-30 pt-12 pb-2 px-5 bg-gradient-to-b from-[#6875dc]/90 to-[#6875dc]/0 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          {/* ЗАГОЛОВОК: СТРОГИЙ, КАК ТЫ ПРОСИЛА */}
          <h1 className="text-2xl font-serif font-bold">
            Лента снов
          </h1>
        </div>
        
        <div className="flex gap-4 border-b border-white/10 pb-0">
          <button onClick={() => handleTabChange('latest')} className={`text-sm font-bold transition-all relative pb-2 px-1 ${activeTab === 'latest' ? 'text-white' : 'text-white/40'}`}>
            Свежее {activeTab === 'latest' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />}
          </button>
          <button onClick={() => handleTabChange('popular')} className={`text-sm font-bold transition-all relative pb-2 px-1 ${activeTab === 'popular' ? 'text-white' : 'text-white/40'}`}>
            Популярное {activeTab === 'popular' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 mt-4 z-10 relative">
        {loading && <div className="py-20 text-center flex flex-col items-center"><div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full mb-3"/><p className="text-white/40 text-xs">Загружаем сновидения...</p></div>}
        {!loading && !error && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {dreams.map(dream => (
              <DreamCard key={dream.id} dream={dream} onLike={toggleLike} onCommentClick={handleCommentClick} />
            ))}
          </div>
        )}
      </div>

      {/* === МОДАЛКА КОММЕНТАРИЕВ === */}
      {openCommentsId && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenCommentsId(null)} />
          
          <div className="relative w-full sm:max-w-lg bg-[#7355af] border border-white/20 rounded-t-[32px] sm:rounded-3xl p-0 animate-in slide-in-from-bottom duration-300 flex flex-col h-[75vh] shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0 bg-[#7355af] rounded-t-[32px]">
              <h3 className="text-xl font-serif font-bold text-white">Комментарии</h3>
              <button onClick={() => setOpenCommentsId(null)} className="p-2 -mr-2 text-white/50 hover:text-white bg-white/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Список */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#7355af] pb-24">
              {currentComments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <p className="text-sm text-white">Пока нет комментариев.<br/>Будьте первым!</p>
                </div>
              ) : (
                currentComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold shrink-0 text-white">
                      {comment.author[0]}
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3 rounded-tl-none border border-white/5 backdrop-blur-sm">
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-xs text-white/60 font-bold">{comment.author}</p>
                        <span className="text-[10px] text-white/30">{comment.time}</span>
                      </div>
                      <p className="text-sm text-white/90">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ПОЛЕ ВВОДА (ПРИБИТО К НИЗУ) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#7355af] border-t border-white/10 z-30 pb-8">
              <form 
                onSubmit={handleSendComment}
                className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-[28px] p-1.5 pl-5 shadow-lg backdrop-blur-md relative"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Напиши сообщение..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 font-sans h-10"
                  autoFocus
                />
                
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`w-10 h-10 rounded-[20px] flex items-center justify-center transition-all ${
                    commentText.trim() 
                      ? 'bg-white text-[#5b50d6] shadow-md active:scale-90' 
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} className={commentText.trim() ? "ml-0.5" : "ml-0"} />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
};