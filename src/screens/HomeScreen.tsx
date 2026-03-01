import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  Zap, ChevronRight, BookOpen, ChevronDown, ChevronLeft, 
  X, Edit2, Check, User, LogOut, HelpCircle, Camera 
} from 'lucide-react';
import { MOODS, MOOD_GROUPS } from '../utils/moodData';
import { useAuth } from '../features/auth/AuthProvider';
import { QuizModal } from '../components/quiz/QuizModal';
import { addXp } from '../utils/api';

// === ЛОГИКА КАЛЕНДАРЯ ===
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  
  let startDay = date.getDay(); 
  if (startDay === 0) startDay = 7; 
  startDay -= 1; 
  
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  const currentMonthIndex = date.getMonth();
  while (date.getMonth() === currentMonthIndex) {
    days.push({ 
      date: date.getDate(), 
      fullDate: new Date(date) 
    });
    date.setDate(date.getDate() + 1);
  }

  const TOTAL_CELLS = 42; 
  while (days.length < TOTAL_CELLS) {
    days.push(null);
  }

  return days;
};

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// === НОВЫЕ ПАСТЕЛЬНЫЕ ПРЕСЕТЫ ===
const AVATAR_PRESETS = [
  'bg-gradient-to-br from-indigo-300 to-purple-400', // Пастельный Индиго
  'bg-gradient-to-br from-rose-300 to-pink-400',     // Пыльная Роза
  'bg-gradient-to-br from-teal-200 to-emerald-400',   // Мятный
  'bg-gradient-to-br from-amber-200 to-orange-300',   // Персиковый
  'bg-gradient-to-br from-sky-300 to-blue-400',       // Небесный
  'bg-gradient-to-br from-blue-600 to-violet-600',    // Тот самый (любимый)
];

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth(); 
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFullDate, setSelectedFullDate] = useState(new Date());
  
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [isSmoothScrollEnabled, setIsSmoothScrollEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayMood, setDisplayMood] = useState<any>(null);

  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // === СОСТОЯНИЯ ПРОФИЛЯ ===
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  // Локальное состояние для мгновенного переключения аватара
  // Дефолт ставим на последний (любимый) цвет
  const [localAvatar, setLocalAvatar] = useState(AVATAR_PRESETS[5]);

  // Синхронизация локального аватара с user при загрузке
  useEffect(() => {
    if (user?.avatar) {
      setLocalAvatar(user.avatar);
    }
  }, [user]);

  const handleQuizSubmit = async (score: number) => {
    if (user && user.id) {
        try {
            const updatedUser = await addXp(user.id, score);
            if (updatedUser && setUser) {
                setUser(updatedUser);
            }
        } catch (e) {
            console.error("Ошибка при начислении XP:", e);
        }
    }
  };

  const displayName = (user?.name && user.name.trim().length > 0) ? user.name : 'Сновидец';

  // --- ЛОГИКА ДАТ ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 
  const days = getDaysInMonth(year, month);
  const currentMonthName = monthNames[month];

  const changeMonth = (offset: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const handleDateSelect = (dayInfo: any) => {
    if (!dayInfo) return;
    setSelectedFullDate(dayInfo.fullDate);
  };

  // --- СОХРАНЕНИЕ ПРОФИЛЯ ---
  const saveName = () => {
    if (user && setUser) {
      const updated = { ...user, name: tempName };
      setUser(updated);
      localStorage.setItem('saviora_user', JSON.stringify(updated));
    }
    setIsEditingName(false);
  };

  const saveAvatar = (gradientClass: string) => {
    // 1. Мгновенно обновляем UI
    setLocalAvatar(gradientClass);
    
    // 2. Сохраняем в глобальный стейт и сторедж
    if (user && setUser) {
      const updated = { ...user, avatar: gradientClass };
      setUser(updated);
      localStorage.setItem('saviora_user', JSON.stringify(updated));
    }
  };

  // --- СОХРАНЕНИЕ И ЗАГРУЗКА ---
  useEffect(() => {
    const y = selectedFullDate.getFullYear();
    const m = String(selectedFullDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedFullDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;
    localStorage.setItem('saviora_selected_date_key', dateKey);
    const historyString = localStorage.getItem('saviora_mood_history');
    const history = historyString ? JSON.parse(historyString) : {};
    const moodId = history[dateKey];
    if (moodId) {
      const mood = MOODS.find(m => m.id === moodId);
      if (mood) {
        const group = MOOD_GROUPS.find(g => g.id === mood.groupId);
        setDisplayMood({ ...mood, groupColor: group?.color || '#7355af' });
      } else setDisplayMood(null);
    } else setDisplayMood(null);
  }, [selectedFullDate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.scrollBehavior = 'auto';
      scrollRef.current.scrollTop = 0;
      setTimeout(() => setIsSmoothScrollEnabled(true), 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current && isCalendarExpanded && scrollRef.current.scrollTop > 50) {
        setIsCalendarExpanded(false);
      }
    };
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => el && el.removeEventListener('scroll', handleScroll);
  }, [isCalendarExpanded]);

  return (
    <div className="h-[100dvh] text-white relative font-sans overflow-hidden flex flex-col"> 
      <img src="/logo.png" className="watermark-logo" alt="" />

      {/* HEADER */}
      <header className="pt-12 px-5 flex justify-between items-start mb-2 relative z-20 flex-shrink-0">
        <div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">SAVIORA</p>
          <h1 className="text-2xl font-serif leading-tight text-white/90">
            Поговори с бессознательным, <br/> 
            <span className="font-display text-3xl block mt-1">{displayName}</span>
          </h1>
        </div>
        
        {/* АВАТАРКА-КНОПКА */}
        <button 
          onClick={() => setIsProfileOpen(true)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 active:scale-95 transition-transform mt-1 ${localAvatar}`}
        >
           <span className="text-lg font-bold text-white drop-shadow-md">
             {displayName[0]?.toUpperCase()}
           </span>
        </button>
      </header>

      {/* КАЛЕНДАРЬ */}
      <div className="px-5 relative z-20 flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 onDoubleClick={() => setIsCalendarExpanded(!isCalendarExpanded)} className="text-lg font-serif cursor-pointer select-none active:opacity-70 transition-opacity">
              {currentMonthName} {year}
            </h2>
            <div onClick={() => setIsCalendarExpanded(!isCalendarExpanded)} className="p-1 cursor-pointer">
              <ChevronDown size={16} className={`text-white/50 transition-transform duration-300 ${isCalendarExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <div className={`flex gap-4 transition-opacity duration-300 ${isCalendarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={(e) => changeMonth(-1, e)} className="p-1 active:scale-90 transition-transform"><ChevronLeft size={20} className="text-white/80" /></button>
            <button onClick={(e) => changeMonth(1, e)} className="p-1 active:scale-90 transition-transform"><ChevronRight size={20} className="text-white/80" /></button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCalendarExpanded ? 'max-h-[380px] mb-4 opacity-100' : 'max-h-[60px] mb-4 opacity-100'}`}>
          {isCalendarExpanded ? (
            <div>
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map(d => <div key={d} className="text-center text-[10px] font-bold text-white/40 uppercase select-none">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-3 justify-items-center animate-fadeIn">
                {days.map((day, i) => {
                  if (!day) return <div key={i} className="w-8 h-8" />;
                  const isSelected = day.date === selectedFullDate.getDate() && day.fullDate.getMonth() === selectedFullDate.getMonth();
                  return (
                    <div 
                      key={i}
                      onClick={(e) => { e.stopPropagation(); handleDateSelect(day); }}
                      onDoubleClick={(e) => { e.stopPropagation(); setIsCalendarExpanded(false); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer select-none ${isSelected ? 'bg-white text-black shadow-lg scale-110 z-10' : 'text-white/60 hover:bg-white/10'}`}
                    >
                      {day.date}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full pb-1 overflow-hidden">
              {weekDays.map((dayName, i) => {
                 const selectedIndex = days.findIndex(d => 
                    d && d.date === selectedFullDate.getDate() && d.fullDate.getMonth() === selectedFullDate.getMonth()
                 );
                 let startWindow = 0;
                 if (selectedIndex !== -1) startWindow = Math.floor(selectedIndex / 7) * 7;
                 
                 const dayData = days[startWindow + i];
                 
                 if (!dayData) return <div key={i} className="flex flex-col items-center gap-2 w-8"><div className="w-8 h-8"></div></div>;
                 
                 const isSelected = dayData.date === selectedFullDate.getDate() && dayData.fullDate.getMonth() === selectedFullDate.getMonth();
                 return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase select-none">{weekDays[i]}</span>
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleDateSelect(dayData); }}
                      onDoubleClick={(e) => { e.stopPropagation(); handleDateSelect(dayData); setIsCalendarExpanded(true); }}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer select-none ${isSelected ? 'bg-white text-black shadow-lg scale-100' : 'text-white/60 bg-white/5'}`}
                    >
                      {dayData.date}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div ref={scrollRef} className={`flex-1 px-5 space-y-5 relative z-10 pb-28 no-scrollbar ${isCalendarExpanded ? 'overflow-y-auto' : 'overflow-hidden'} ${isSmoothScrollEnabled ? 'scroll-smooth' : 'scroll-auto'}`}>
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-serif">Ваше состояние</h2>
            <span onClick={() => navigate('/mood')} className="text-xs text-white/40 cursor-pointer border-b border-white/20 pb-0.5 hover:text-white transition-colors">Изменить</span>
          </div>
          <GlassCard onClick={() => navigate('/mood')} className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-colors duration-300" 
                style={{ borderColor: displayMood ? displayMood.groupColor : 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                {displayMood ? <displayMood.icon sx={{ color: displayMood.groupColor, fontSize: 24 }} /> : '🌑'}
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">{displayMood ? displayMood.label : 'Выберите состояние'}</p>
                <p className="text-xs text-white/50 mt-0.5 font-medium">{displayMood ? displayMood.fullLabel : 'Как вы себя чувствуете?'}</p>
              </div>
            </div>
            <ChevronRight className="text-white/20 w-5 h-5" />
          </GlassCard>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-serif">Проверь себя</h2></div>
          <div className="bg-gradient-to-br from-indigo-500/40 to-purple-600/40 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-[24px] p-5 relative overflow-hidden active:scale-[0.99] transition-transform cursor-pointer group" onClick={() => setIsQuizOpen(true)}>
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full group-hover:bg-purple-500/30 transition-colors" />
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-lavender-500 flex items-center justify-center shadow-lg shadow-purple-600/62 text-white"><Zap fill="white" size={20} /></div>
              <span className="bg-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/5">+XP</span>
            </div>
            <div className="relative z-10 mt-2">
              <h3 className="text-xl font-serif leading-tight mb-1">Осознанность во сне</h3>
              <p className="text-xs font-medium text-white/60">Пройди квиз и узнай свой уровень</p>
            </div>
            <button className="mt-5 w-full py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-md hover:bg-white/20 transition-all shadow-lg active:scale-95" onClick={(e) => { e.stopPropagation(); setIsQuizOpen(true); }}>Начать</button>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-serif">Советы</h2><span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-md">Сегодня</span></div>
          <GlassCard onClick={() => navigate('/recommendations')} className="p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full" />
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors z-10"><BookOpen className="w-6 h-6 text-blue-300" /></div>
            <div className="flex-1 z-10"><h3 className="font-bold text-base leading-tight mb-0.5">База знаний</h3><p className="text-xs font-medium text-white/50">заходи, тут интересно</p></div>
            <ChevronRight className="text-white/20 w-5 h-5 group-hover:text-white/60 transition-colors z-10" />
          </GlassCard>
        </section>

        <div className="h-6 w-full"></div>
      </div>

      <Navigation />
      
      {/* --- МОДАЛКА КВИЗА --- */}
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} onSubmit={handleQuizSubmit} />

      {/* --- МОДАЛКА ПРОФИЛЯ --- */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)} />
          
          <div className="relative w-full sm:max-w-sm bg-[#7355af] border-t border-white/20 rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 pb-32 sm:pb-0">
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-serif font-bold text-white tracking-wide">Профиль</h3>
                <button onClick={() => setIsProfileOpen(false)} className="p-2 -mr-2 text-white/50 hover:text-white rounded-full bg-white/10 transition-colors">
                   <X size={18} />
                </button>
              </div>

              {/* Секция Аватара */}
              <div className="flex flex-col items-center mb-6">
                 {/* Аватар */}
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 mb-5 relative ${localAvatar} transition-all duration-300`}>
                    <span className="text-3xl font-bold text-white drop-shadow-md">
                      {displayName[0]?.toUpperCase()}
                    </span>
                    <div className="absolute bottom-0 right-0 p-2 bg-white text-[#7355af] rounded-full shadow-lg">
                      <Camera size={14} />
                    </div>
                 </div>
                 
                 {/* Выбор аватара */}
                 <div className="flex gap-3 mb-5 bg-white/10 p-2 rounded-2xl backdrop-blur-sm">
                   {AVATAR_PRESETS.map((grad, i) => (
                     <button 
                       key={i}
                       onClick={() => saveAvatar(grad)}
                       className={`
                         w-6 h-6 rounded-full border-2 transition-all duration-200 
                         ${grad} 
                         ${localAvatar === grad ? 'border-white scale-125 shadow-lg ring-2 ring-white/50' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'}
                       `}
                     />
                   ))}
                 </div>

                 {/* Смена имени */}
                 <div className="flex items-center gap-2 h-10">
                   {isEditingName ? (
                     <div className="flex items-center gap-2 bg-white/20 rounded-xl p-1 pl-3 border border-white/20 animate-in fade-in zoom-in">
                       <input 
                         autoFocus
                         value={tempName}
                         onChange={(e) => setTempName(e.target.value)}
                         className="bg-transparent outline-none w-32 text-center font-bold text-lg text-white placeholder-white/50"
                         placeholder="Имя"
                       />
                       <button onClick={saveName} className="p-1.5 bg-white text-[#7355af] rounded-lg shadow-md active:scale-95">
                         <Check size={14} />
                       </button>
                     </div>
                   ) : (
                     <button onClick={() => { setTempName(displayName); setIsEditingName(true); }} className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition-opacity">
                        {displayName}
                        <Edit2 size={14} className="text-white/50" />
                     </button>
                   )}
                 </div>
              </div>

              {/* Меню действий */}
              <div className="space-y-3">
                <button onClick={() => alert("Туториал скоро будет!")} className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between hover:bg-white/20 transition-colors group active:scale-[0.98]">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-full bg-blue-400/20 text-blue-200"><BookOpen size={18} /></div>
                     <span className="font-bold text-sm text-white/90">Как пользоваться?</span>
                   </div>
                   <ChevronRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                </button>

                <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between hover:bg-red-500/20 transition-colors group active:scale-[0.98]">
                   <div className="flex items-center gap-3">
                     <div className="p-2 rounded-full bg-red-400/20 text-red-200"><LogOut size={18} /></div>
                     <span className="font-bold text-sm text-red-100">Выйти из аккаунта</span>
                   </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};