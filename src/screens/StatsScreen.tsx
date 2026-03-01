import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { 
  Brain, GraduationCap, Moon, CheckCircle2, 
  Sparkles, Palette, MessageCircle, TrendingUp, 
  Trophy, Target, Hourglass, HeartCrack, Activity, Calendar
} from 'lucide-react';

// === МОКОВЫЕ ДАННЫЕ С ЦВЕТАМИ ===

const TILES = [
  // Добавил поля color (для иконки) и bg (для фона иконки)
  { label: 'Снов', value: '12', sub: '+2 за неделю', icon: Moon, color: 'text-blue-300', bg: 'bg-blue-500/20' },
  { label: 'Осознанных', value: '3', sub: '25% от всех', icon: ZapIcon, color: 'text-amber-300', bg: 'bg-amber-500/20' },
  { label: 'Ср. настроение', value: '4.2', sub: 'Нормально', icon: Activity, color: 'text-emerald-300', bg: 'bg-emerald-500/20' },
  { label: 'Стрик', value: '5 дн.', sub: 'Так держать', icon: Calendar, color: 'text-pink-300', bg: 'bg-pink-500/20' },
];

const LEVEL_DATA = {
  current: 'Философ',
  xp: 1460,
  maxXp: 1500,
  next: 'Гуру',
  tasks: '2/50 снов'
};

const MOOD_STATS = [
  { label: 'Усталость', count: '1 раз', percent: '10%', icon: Hourglass, color: 'bg-orange-400' },
  { label: 'Пустота', count: '1 раз', percent: '10%', icon: HeartCrack, color: 'bg-slate-400' },
  { label: 'Тревога', count: '2 раза', percent: '20%', icon: TrendingUp, color: 'bg-red-400' },
  { label: 'Радость', count: '5 раз', percent: '50%', icon: Sparkles, color: 'bg-yellow-400' },
];

const ACHIEVEMENTS = [
  { label: 'Первый сон', icon: Target },
  { label: 'Первая мысль', icon: Brain },
  { label: 'Первый образ', icon: Palette },
  { label: 'Первый диалог', icon: MessageCircle },
];

const TIME_RANGES = ['7 д', '30 д', '60 д', '1 год'];
const CHART_DATA = [20, 45, 30, 50, 40, 60, 55]; 

// Хелпер для иконки
function ZapIcon(props: any) { return <TrendingUp {...props} /> } 

export const StatsScreen = () => {
  const [activeRange, setActiveRange] = useState('30 д');

  const generatePath = () => {
    const max = 100;
    const width = 100;
    const stepX = width / (CHART_DATA.length - 1);
    const points = CHART_DATA.map((val, i) => `${i * stepX},${100 - val}`);
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans pb-24 relative overflow-hidden flex flex-col">
      
      {/* ФОН (Пятна) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
       <img src="/logo.png" className="watermark-logo" alt="" />

      {/* HEADER */}
      <header className="pt-12 px-5 pb-4 z-20 shrink-0 sticky top-0 bg-gradient-to-b from-[#6875dc]/90 to-[#6875dc]/0 backdrop-blur-sm">
        <h1 className="text-2xl font-serif font-bold">Дашборд</h1>
      </header>

      {/* CONTENT SCROLL */}
      <div className="flex-1 overflow-y-auto px-5 space-y-6 no-scrollbar pb-24">
        
        {/* 1. УРОВЕНЬ */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[32px] p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            {/* Иконка уровня с мягким розовым фоном */}
            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-white/5 shadow-inner">
              <Brain size={28} className="text-pink-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold text-white/90">{LEVEL_DATA.current}</h2>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/50">{LEVEL_DATA.xp} / {LEVEL_DATA.maxXp} XP</span>
                <span className="text-pink-200 font-medium bg-pink-500/10 px-2 py-0.5 rounded-lg">Lvl 4</span>
              </div>
            </div>
          </div>
          
          {/* Прогресс бар (Цветной градиент) */}
          <div className="h-2 w-full bg-black/20 rounded-full mb-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 w-[95%] shadow-[0_0_10px_rgba(236,72,153,0.4)]" />
          </div>
          <p className="text-[10px] text-white/40 text-right">до {LEVEL_DATA.next}: 40 XP</p>
        </div>

        {/* 2. ПЛИТКИ (TILES GRID) */}
        <div className="grid grid-cols-2 gap-3">
          {TILES.map((tile, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-[24px] p-4 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                {/* Цветная подложка иконки */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tile.bg}`}>
                  <tile.icon size={14} className={tile.color} />
                </div>
                {/* Точка цвета иконки */}
                <div className={`w-1.5 h-1.5 rounded-full opacity-50 ${tile.bg.replace('/20', '')}`} />
              </div>
              <p className="text-2xl font-bold font-serif mb-0.5">{tile.value}</p>
              <p className="text-[10px] text-white/40">{tile.label}</p>
            </div>
          ))}
        </div>

        {/* 3. ГРАФИК */}
        <div className="bg-white/5 border border-white/5 rounded-[32px] p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold font-serif">Активность</h3>
            <div className="flex bg-black/20 p-0.5 rounded-lg">
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${
                    activeRange === range ? 'bg-white/20 text-white' : 'text-white/40'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-32 w-full relative">
             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Линия мягкого зеленого цвета (MINT) */}
                <path d={generatePath()} fill="none" stroke="#82c5aa" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                
                {/* Точки */}
                {CHART_DATA.map((val, i) => (
                   <circle key={i} cx={(i * (100 / (CHART_DATA.length - 1)))} cy={100-val} r="3" fill="#34ab7b" stroke="#312e81" strokeWidth="0.5" />
                ))}
             </svg>
          </div>
        </div>

        {/* 4. НАСТРОЕНИЯ (Скролл) */}
        <div>
          <h3 className="text-base font-bold font-serif mb-3 px-1">Эмоции</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {MOOD_STATS.map((stat, i) => (
              <div key={i} className="min-w-[120px] bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <stat.icon size={16} className="text-white/60" />
                  <span className="text-[10px] text-white/40">{stat.percent}</span>
                </div>
                <p className="text-sm font-medium">{stat.label}</p>
                {/* Цветной прогресс бар */}
                <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className={`h-full w-[50%] ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ДОСТИЖЕНИЯ */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Trophy size={18} className="text-yellow-400" />
            <h3 className="text-base font-bold font-serif">Достижения</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map((ach, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                {/* Золотая иконка */}
                <ach.icon size={14} className="text-amber-200/70" />
                <span className="text-xs text-white/80">{ach.label}</span>
              </div>
            ))}
            <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs text-white/40">+4</div>
          </div>
        </div>

      </div>

      <Navigation />
    </div>
  );
};