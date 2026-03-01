import React from 'react';
import { Calendar, Lock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// === ЛОКАЛЬНЫЕ ТИПЫ (Чтобы не было ошибок импорта) ===
interface Author {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
}

interface FeedDream {
  id: string;
  title: string;
  dreamText: string;
  dreamSummary: string;
  date: number;
  published_at: number;
  likes_count: number;
  comments_count: number;
  views_count: number;
  user_liked: boolean;
  author: Author;
  blocks?: any[]; 
  tags?: string[];
  isPrivate?: boolean;
}
// ====================================================

interface Props {
  dream: FeedDream;
  onClick: () => void;
}

export const MyDreamCard: React.FC<Props> = ({ dream, onClick }) => {
  const dateStr = format(new Date(dream.date), 'd MMMM', { locale: ru });

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-[24px] p-5 bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider">
          <Calendar size={12} />
          <span>{dateStr}</span>
        </div>
        <Lock size={14} className="text-white/30" />
      </div>

      {/* CONTENT */}
      <div className="mb-4">
        <h3 className="text-lg font-serif font-bold text-white mb-1 leading-tight">
          {dream.title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed line-clamp-3 font-light">
          {dream.dreamText}
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex gap-2">
          {dream.tags?.map((tag, i) => (
            <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-white/60">
              #{tag}
            </span>
          ))}
        </div>
        <div className="p-2 rounded-full bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};