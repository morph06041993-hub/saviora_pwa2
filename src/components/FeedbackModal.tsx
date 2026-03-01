import React, { useState, useEffect } from 'react';
import { X, Star, DollarSign, Send } from 'lucide-react';
import * as api from '../utils/api'; // Предполагаем, что тут будет метод отправки

export const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Данные формы
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkShouldShow();
  }, []);

  const checkShouldShow = () => {
    // 1. Если уже оставил отзыв — не показываем
    const hasReviewed = localStorage.getItem('saviora_has_reviewed');
    if (hasReviewed) return;
    
    // 2. Проверяем дату первого запуска
    const startDateStr = localStorage.getItem('saviora_start_date');
    let startDate = startDateStr ? new Date(startDateStr) : new Date();

    if (!startDateStr) {
      // Первый запуск вообще — сохраняем дату
      localStorage.setItem('saviora_start_date', startDate.toISOString());
      return; // В первый день не мучаем
    }

    // 3. Проверяем, сколько прошло времени
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 4. Проверяем, когда показывали в последний раз (чтобы не показывать каждый рефреш)
    const lastShownStr = localStorage.getItem('saviora_feedback_last_shown');
    const lastShown = lastShownStr ? new Date(lastShownStr) : null;
    
    // Логика: Показывать каждые 5 дней (5, 10, 15...), если сегодня еще не показывали
    if (diffDays > 0 && diffDays % 5 === 0) {
      // Проверяем, не показывали ли уже СЕГОДНЯ
      if (!lastShown || lastShown.toDateString() !== now.toDateString()) {
        setIsOpen(true);
        localStorage.setItem('saviora_feedback_last_shown', now.toISOString());
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Отправляем данные на сервер (или просто логируем пока)
      /* 
      await api.sendFeedback({
        rating,
        price: price ? parseFloat(price) : null,
        comment
      });
      */
      console.log('Feedback:', { rating, price, comment });

      // Запоминаем, что отзыв отправлен
      localStorage.setItem('saviora_has_reviewed', 'true');
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Не ставим 'has_reviewed', чтобы окно появилось через 5 дней снова
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#6875dc] backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-[#6875dc] p-6 text-center relative">
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={18} />
          </button>
          <h3 className="text-xl font-serif font-bold text-white mb-1">Помоги нам стать лучше</h3>
          <p className="text-xs text-white/70">Твое мнение формирует будущее Saviora</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* 1. Звездочки */}
          <div className="text-center">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 block">Оцени приложение</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-transform hover:scale-110 active:scale-95 ${rating >= star ? 'text-yellow-400' : 'text-white/10'}`}
                >
                  <Star size={32} fill={rating >= star ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Цена (Необязательно) */}
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block flex items-center gap-2">
              <DollarSign size={12}/> Сколько бы ты заплатил ($)?
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Например: 5"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 outline-none transition-all text-center font-bold text-lg"
            />
          </div>

          {/* 3. Комментарий (Необязательно) */}
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Что нам улучшить?"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder:text-white/20 focus:bg-white/10 focus:border-white/30 outline-none transition-all resize-none"
            />
          </div>

          {/* Footer Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting} // Можно отправлять даже пустым, если хочется, или добавить условие rating > 0
            className="w-full py-3.5 bg-white text-[#6875dc] font-bold rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Отправка...' : <>Отправить <Send size={18} /></>}
          </button>
        </div>

      </div>
    </div>
  );
};