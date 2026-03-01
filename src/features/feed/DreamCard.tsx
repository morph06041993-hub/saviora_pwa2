import React from 'react';
import { Heart, MessageCircle, Eye } from 'lucide-react'; // Share2 и MoreHorizontal удалены из импорта
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// === ТИПЫ (Локально) ===
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
}

interface DreamCardProps {
  dream: FeedDream;
  onLike: (id: string) => void;
  onCommentClick?: (id: string) => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({ dream, onLike, onCommentClick }) => {
  const timeAgo = formatDistanceToNow(new Date(dream.published_at), { addSuffix: true, locale: ru });

  return (
    <div className="group relative overflow-hidden rounded-[24px] p-5 bg-white/10 border border-white/10 backdrop-blur-md transition-all active:scale-[0.99] mb-4 shadow-lg">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Аватар */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/20">
            {dream.author.displayName[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-none mb-1">{dream.author.displayName}</h3>
            <div className="flex items-center gap-2 text-white/50 text-[10px]">
              <span>{timeAgo}</span>
              {dream.views_count > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye size={10} /> {dream.views_count}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* ТРИ ТОЧКИ УДАЛЕНЫ */}
      </div>

      {/* CONTENT */}
      <div className="mb-4 space-y-2">
        <h2 className="text-lg font-serif font-bold text-white leading-tight">
          {dream.title}
        </h2>
        <p className="text-white/80 text-sm leading-relaxed font-light line-clamp-4">
          {dream.dreamText}
        </p>
      </div>

      {/* TAGS */}
      {dream.tags && dream.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {dream.tags.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-wide">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-6">
          
          {/* Like Button */}
          <button 
            onClick={() => onLike(dream.id)}
            className="flex items-center gap-2 group/like transition-all"
          >
            <div className={`p-2 rounded-full transition-all ${dream.user_liked ? 'bg-pink-500/20 text-pink-400' : 'bg-transparent text-white/40 group-hover/like:bg-white/10'}`}>
              <Heart size={18} className={dream.user_liked ? 'fill-current' : ''} strokeWidth={2} />
            </div>
            <span className={`text-xs font-bold ${dream.user_liked ? 'text-pink-400' : 'text-white/40'}`}>
              {dream.likes_count}
            </span>
          </button>

          {/* Comment Button */}
          <button 
            onClick={() => onCommentClick && onCommentClick(dream.id)}
            className="flex items-center gap-2 group/comment"
          >
            <div className="p-2 rounded-full bg-transparent text-white/40 group-hover/comment:bg-white/10 transition-colors">
              <MessageCircle size={18} strokeWidth={2} />
            </div>
            <span className="text-xs font-bold text-white/40">
              {dream.comments_count}
            </span>
          </button>
        </div>

        {/* SHARE УДАЛЕН */}
      </div>
    </div>
  );
};