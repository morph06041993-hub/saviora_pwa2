import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MOOD_GROUPS } from '../utils/moodData';

const MoodSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] text-white relative font-sans overflow-hidden flex flex-col">
      <img src="/logo.png" className="watermark-logo" alt="" />
      
      {/* Шапка */}
      <header className="pt-12 px-5 flex items-center gap-4 mb-6 relative z-20 shrink-0">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform border border-white/10"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-2xl font-serif leading-tight">Что вы чувствуете?</h1>
      </header>

      {/* Сетка выбора */}
      <div className="flex-1 px-5 overflow-y-auto pb-32 no-scrollbar z-10">
        <div className="grid grid-cols-1 gap-4">
          {MOOD_GROUPS.map((group) => {
            const Icon = group.icon;
            
            return (
              <div 
                key={group.id}
                onClick={() => navigate(`/mood/${group.id}`)}
                className={`
                  relative overflow-hidden rounded-[24px] p-5 cursor-pointer active:scale-[0.98] transition-all
                  border border-white/10 bg-white/5 backdrop-blur-md group
                `}
              >
                {/* Градиент при наведении (оставляем для красоты) */}
                <div className={`absolute inset-0 bg-gradient-to-r ${group.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    {/* ИКОНКА: КОНТУР + ЦВЕТ */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border"
                      style={{ 
                        borderColor: group.color, // Цветная рамка
                        backgroundColor: 'rgba(255,255,255,0.03)' // Почти прозрачный фон
                      }}
                    >
                      {/* Сама иконка теперь цветная */}
                      <Icon sx={{ color: group.color, fontSize: 24 }} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold">{group.label}</h3>
                      <p className="text-xs text-white/50">{group.description}</p>
                    </div>
                  </div>
                  
                  <ArrowLeft className="rotate-180 text-white/20" size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodSelectionScreen;