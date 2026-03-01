import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MOOD_GROUPS, MOODS } from '../utils/moodData';

const MoodDetailScreen = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); 

  const group = MOOD_GROUPS.find(g => g.id === categoryId);
  const currentMoods = MOODS.filter(m => m.groupId === categoryId);

  if (!group) return <div className="text-white p-10 text-center">Категория не найдена</div>;

  return (
    <div className="h-[100dvh] text-white relative font-sans overflow-hidden flex flex-col">
      <img src="/logo.png" className="watermark-logo" alt="" />
      
      {/* Шапка */}
      <header className="pt-12 px-5 flex items-center gap-4 mb-6 relative z-20 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform border border-white/10"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-serif leading-tight">{group.label}</h1>
          <p className="text-xs text-white/50">Уточните чувство</p>
        </div>
      </header>

      {/* Список эмоций */}
      <div className="flex-1 px-5 overflow-y-auto pb-32 no-scrollbar z-10">
        <div className="grid grid-cols-1 gap-3">
          {currentMoods.map((mood) => {
            const Icon = mood.icon;
            
            return (
              <div 
                key={mood.id}
                onClick={() => {
                  let dateKey = localStorage.getItem('saviora_selected_date_key');
                  if (!dateKey) {
                     const today = new Date();
                     dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
                  }
                  const historyString = localStorage.getItem('saviora_mood_history');
                  const history = historyString ? JSON.parse(historyString) : {};
                  history[dateKey] = mood.id;
                  localStorage.setItem('saviora_mood_history', JSON.stringify(history));
                  navigate('/'); 
                }}
                className="
                  relative overflow-hidden rounded-[20px] p-4 
                  bg-white/5 backdrop-blur-md border border-white/10
                  cursor-pointer active:scale-[0.98] transition-all
                  flex items-center gap-4 group hover:bg-white/10
                "
              >
                {/* ИКОНКА: КОНТУР + ЦВЕТ */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 border"
                  style={{ 
                    borderColor: group.color,
                    backgroundColor: 'rgba(255,255,255,0.03)' 
                  }} 
                >
                  {Icon && <Icon sx={{ color: group.color, fontSize: 20 }} />}
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold">{mood.label}</h3>
                  <p className="text-xs text-white/50 leading-snug">{mood.fullLabel}</p>
                </div>

                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-transparent transition-colors">
                   <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodDetailScreen;