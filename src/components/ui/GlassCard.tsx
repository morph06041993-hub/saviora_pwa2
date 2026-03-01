import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // <--- Важно: добавляем тип для клика
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick} // <--- Важно: вешаем обработчик на div
      className={`
        bg-white/5 
        backdrop-blur-xl 
        border border-white/10 
        shadow-lg 
        rounded-[24px] 
        hover:border-white/20 
        transition-all 
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};