import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, X, ArrowRight, Lightbulb, Atom,
  Eye, Zap, Hand, Pill, 
  Shield, Ghost, HeartPulse, Wind, 
  Sun, Moon, Move, 
  GlassWater, Tag, RotateCw, Clock,
  Coffee
} from 'lucide-react';

// === 1. ДАННЫЕ ===

type CategoryId = 'lucid' | 'nightmare' | 'biohacking' | 'memory';

interface Tip {
  id: string;
  category: CategoryId;
  title: string;
  subtitle: string;
  essence: string;
  science: string;
  tag: 'Easy' | 'Medium' | 'Hardcore';
  icon: any;
  cardGradient: string; // Оставляем для совместимости, но используем borderColor
  borderColor: string;
  tagColor: string;
  textColor: string; // Новый цвет для заголовков внутри модалки
}

const CATEGORIES: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'lucid', label: 'Осознанность' },
  { id: 'nightmare', label: 'Укрощение' },
  { id: 'biohacking', label: 'Биохакинг' },
  { id: 'memory', label: 'Память' },
];

const RECOMMENDATIONS: Tip[] = [
  // 📂 Папка 1: «Режиссёрская версия»
  {
    id: 'ssild', category: 'lucid', title: 'Техника SSILD', subtitle: 'Чувственность как ключ к реальности',
    essence: 'Вы просыпаетесь через 4–5 часов (как в WBTB), ложитесь обратно и начинаете циклы фокусировки: 5 секунд на зрение (темнота за веками), 5 на слух (шум комнаты), 5 на тактильность (одеяло). Затем циклы удлиняются до 30 секунд.',
    science: 'Эта техника перегружает сенсорную кору, удерживая сознание на плаву, пока тело проваливается в сон. Исследования показывают высокую эффективность именно для новичков.',
    tag: 'Medium', icon: Eye, 
    cardGradient: 'bg-gradient-to-br from-[#3f2b20]/90 to-[#18100c]/90', 
    borderColor: 'border-[#8a5d48]', 
    tagColor: 'bg-[#5c3d2e] text-[#ffdcc9]',
    textColor: 'text-[#d6a485]'
  },
  {
    id: 'vild', category: 'lucid', title: 'Техника VILD', subtitle: 'Инкубация сюжета',
    essence: 'Перед сном вы не просто хотите осознаться, а визуализируете конкретный сон, который хотите увидеть. Вы строите сцену, в которой обязательно проводите проверку реальности.',
    science: 'Использование механизма «намеренной репетиции». Это смесь гипноза и мнемоники. Вы создаете «триггер» внутри воображаемого сценария.',
    tag: 'Medium', icon: Zap, 
    cardGradient: 'bg-gradient-to-br from-[#4a3b1d]/90 to-[#1a150a]/90', 
    borderColor: 'border-[#9e7d3e]', 
    tagColor: 'bg-[#665229] text-[#ffeebb]',
    textColor: 'text-[#e6c275]'
  },
  {
    id: 'fild', category: 'lucid', title: 'Техника FILD', subtitle: 'Сыграть ноктюрн на простыне',
    essence: 'Проснувшись посреди ночи, вы начинаете едва заметно шевелить указательным и средним пальцами, словно играете на невидимом пианино. Движения должны быть микроскопическими.',
    science: 'Это техника «якорения». Микромоторика удерживает фокус внимания, не давая мозгу полностью отключиться, пока тело входит в сонный паралич и прямой вход в сон (WILD).',
    tag: 'Hardcore', icon: Hand, 
    cardGradient: 'bg-gradient-to-br from-[#451e1e]/90 to-[#1a0a0a]/90', 
    borderColor: 'border-[#a34646]', 
    tagColor: 'bg-[#6b2e2e] text-[#ffcccc]',
    textColor: 'text-[#f08686]'
  },
  {
    id: 'galantamin', category: 'lucid', title: 'Галантамин', subtitle: 'Матрица требует таблетку',
    essence: 'Прием добавок с галантамином (экстракт подснежника) во время ночного пробуждения.',
    science: 'Это ингибитор холинэстеразы. Он повышает уровень ацетилхолина в мозге, что критически важно для REM-фазы. Клинические испытания показали рост вероятности ОС.',
    tag: 'Hardcore', icon: Pill, 
    cardGradient: 'bg-gradient-to-br from-[#591c30]/90 to-[#1f0a10]/90', 
    borderColor: 'border-[#bf3c66]', 
    tagColor: 'bg-[#802a46] text-[#ffcce0]',
    textColor: 'text-[#ff7da6]'
  },

  // 📂 Папка 2: «Укрощение Химер»
  {
    id: 'safe-place', category: 'nightmare', title: 'Безопасное место', subtitle: 'Ваш личный бункер',
    essence: 'В бодрствовании вы конструируете в деталях место абсолютной безопасности. Когда во сне нарастает тревога, вы тренируетесь телепортироваться туда, а не бороться с монстром.',
    science: 'Основано на техниках стабилизации при травматерапии. Снижает уровень кортизола во сне.',
    tag: 'Easy', icon: Shield, 
    cardGradient: 'bg-gradient-to-br from-[#2e2a5b]/90 to-[#100f1f]/90', 
    borderColor: 'border-[#6058bf]', 
    tagColor: 'bg-[#433d80] text-[#dcdcff]',
    textColor: 'text-[#9c94ff]'
  },
  {
    id: 'paradox', category: 'nightmare', title: 'Парадоксальная интенция', subtitle: 'Смотри страху в глаза',
    essence: 'Если вы боитесь не уснуть из-за кошмаров, ваша задача — стараться не спать изо всех сил.',
    science: 'Виктор Франкл завещал. Снимает тревогу ожидания. Когда вы перестаете бороться за сон, сон приходит сам.',
    tag: 'Medium', icon: Ghost, 
    cardGradient: 'bg-gradient-to-br from-[#3b204d]/90 to-[#150a1c]/90', 
    borderColor: 'border-[#8e4cb5]', 
    tagColor: 'bg-[#5e3478] text-[#f3d9ff]',
    textColor: 'text-[#cd8aff]'
  },
  {
    id: 'pmr', category: 'nightmare', title: 'Релаксация PMR', subtitle: 'Отпустить зажимы',
    essence: 'Поочередное сильное напряжение и расслабление групп мышц (от стоп до лица) перед сном.',
    science: 'Снижает физиологическое возбуждение (arousal), которое является топливом для ночных кошмаров.',
    tag: 'Easy', icon: Move, 
    cardGradient: 'bg-gradient-to-br from-[#2a2a4a]/90 to-[#0c0c14]/90', 
    borderColor: 'border-[#5b5b9e]', 
    tagColor: 'bg-[#3d3d6b] text-[#dcdcf5]',
    textColor: 'text-[#9faae3]'
  },
  {
    id: 'breath', category: 'nightmare', title: 'Дыхание 4-7-8', subtitle: 'Взлом системы',
    essence: 'Вдох на 4, задержка на 7, выдох на 8. Успокаивает мгновенно.',
    science: 'Этот ритм принудительно замедляет сердцебиение, сигнализируя амигдале (центру страха), что опасность миновала.',
    tag: 'Easy', icon: Wind, 
    cardGradient: 'bg-gradient-to-br from-[#334155]/90 to-[#0f172a]/90', 
    borderColor: 'border-[#6d82a1]', 
    tagColor: 'bg-[#475569] text-[#e2e8f0]',
    textColor: 'text-[#b0c4de]'
  },

  // 📂 Папка 3: «Искусство Горизонтали»
  {
    id: 'nsdr', category: 'biohacking', title: 'Протокол NSDR', subtitle: 'Сон внутри бодрствования',
    essence: '20 минут сканирования тела под аудиогид днем (Йога-нидра).',
    science: 'Эндрю Губерман популяризировал это. Восстанавливает дофамин и компенсирует недосып лучше, чем кофе.',
    tag: 'Easy', icon: HeartPulse, 
    cardGradient: 'bg-gradient-to-br from-[#1a3d33]/90 to-[#081411]/90', 
    borderColor: 'border-[#3a856f]', 
    tagColor: 'bg-[#26594a] text-[#ccffee]',
    textColor: 'text-[#7fffd4]'
  },
  {
    id: 'light', category: 'biohacking', title: 'Управление светом', subtitle: 'Закат солнца вручную',
    essence: 'Использование ламп с красным спектром вечером и яркого холодного света (10 000 люкс) сразу после пробуждения.',
    science: 'Свет — главный датчик времени для мозга. Утренний свет запускает таймер выброса кортизола.',
    tag: 'Medium', icon: Sun, 
    cardGradient: 'bg-gradient-to-br from-[#3d361a]/90 to-[#141208]/90', 
    borderColor: 'border-[#8c7c3d]', 
    tagColor: 'bg-[#5e5329] text-[#fffee0]',
    textColor: 'text-[#f0e68c]'
  },
  {
    id: 'shuffle', category: 'biohacking', title: 'Когнитивная перестановка', subtitle: 'Запутать мозг',
    essence: 'Вы придумываете случайное слово (например, «БАНАН») и визуализируете слова на каждую букву: Б — бабушка, булка... А — ананас...',
    science: 'Это имитирует микро-сон и фрагментацию мыслей. Мозг думает: «О, пошел бред, значит, мы засыпаем» — и выключает свет.',
    tag: 'Easy', icon: Moon, 
    cardGradient: 'bg-gradient-to-br from-[#2a3d3d]/90 to-[#0a1414]/90', 
    borderColor: 'border-[#598282]', 
    tagColor: 'bg-[#3b5757] text-[#d0f5f5]',
    textColor: 'text-[#afeeee]'
  },
  {
    id: 'blanket', category: 'biohacking', title: 'Тяжелое одеяло', subtitle: 'Объятия без обязательств',
    essence: 'Одеяло весом 10–15% от массы вашего тела.',
    science: 'Стимулирует выработку серотонина и снижает активность симпатической нервной системы (Deep Pressure Stimulation).',
    tag: 'Easy', icon: Coffee, 
    cardGradient: 'bg-gradient-to-br from-[#3d2a2a]/90 to-[#140a0a]/90', 
    borderColor: 'border-[#855b5b]', 
    tagColor: 'bg-[#593d3d] text-[#f5d0d0]',
    textColor: 'text-[#ffa07a]'
  },

  // 📂 Папка 4: «Охота на Символы»
  {
    id: 'water', category: 'memory', title: 'Стакан воды', subtitle: 'Метод Павлова',
    essence: 'Перед сном выпиваете полстакана воды с мыслью: «Я запомню сон». Утром допиваете остальное.',
    science: 'Ритуализация намерения + легкое наполнение мочевого пузыря провоцирует микро-пробуждение в конце цикла сна.',
    tag: 'Easy', icon: GlassWater, 
    cardGradient: 'bg-gradient-to-br from-[#1a2f4d]/90 to-[#080f1a]/90', 
    borderColor: 'border-[#3d6eb3]', 
    tagColor: 'bg-[#294a78] text-[#d9e8ff]',
    textColor: 'text-[#87cefa]'
  },
  {
    id: 'tagging', category: 'memory', title: 'Тэггинг сна', subtitle: 'Хэштеги для подсознания',
    essence: 'Проснувшись, не пытайтесь вспомнить сюжет целиком. Сначала выхватите одну эмоцию или один цвет. «Страх», «Зеленый».',
    science: 'Память ассоциативна. Одно «якорное» ощущение вытягивает за собой всю нейронную цепь воспоминания.',
    tag: 'Easy', icon: Tag, 
    cardGradient: 'bg-gradient-to-br from-[#1a1f4d]/90 to-[#080a1a]/90', 
    borderColor: 'border-[#4351bf]', 
    tagColor: 'bg-[#2d3680] text-[#d9dbff]',
    textColor: 'text-[#add8e6]'
  },
  {
    id: 'side', category: 'memory', title: 'Правополушарный сон', subtitle: 'Спим на правильном боку',
    essence: 'Попробуйте спать на правом боку для более спокойных снов, и на левом — для эмоциональных.',
    science: 'Влияние гравитации и кровообращения на качество сна. Можно предложить пользователям поэкспериментировать.',
    tag: 'Easy', icon: RotateCw, 
    cardGradient: 'bg-gradient-to-br from-[#20204d]/90 to-[#0a0a1a]/90', 
    borderColor: 'border-[#4f4fbf]', 
    tagColor: 'bg-[#353580] text-[#dedeff]',
    textColor: 'text-[#b0c4de]'
  },
  {
    id: 'cycles', category: 'memory', title: '90-минутные циклы', subtitle: 'Серфинг по волнам',
    essence: 'Ставить будильник кратно 90 минутам (время полного цикла сна). 6 часов, 7.5 часов, 9 часов.',
    science: 'Пробуждение в конце цикла гарантирует, что вы выйдете из быстрой фазы (REM), когда сон еще свеж в памяти.',
    tag: 'Medium', icon: Clock, 
    cardGradient: 'bg-gradient-to-br from-[#203a4d]/90 to-[#0a121a]/90', 
    borderColor: 'border-[#4f8ebf]', 
    tagColor: 'bg-[#355f80] text-[#def1ff]',
    textColor: 'text-[#87cefa]'
  },
];

// === 2. КОМПОНЕНТ ===

const RecommendationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  const filtered = activeCategory === 'all'
    ? RECOMMENDATIONS
    : RECOMMENDATIONS.filter(rec => rec.category === activeCategory);

  useEffect(() => {
    if (selectedTip) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedTip]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans flex flex-col">
      
      {/* HEADER + TABS */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-[#6875dc] to-[#6d6bca] shadow-lg shadow-[#6875dc]/20">
        <div className="pt-12 pb-4 px-5 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-wide">Картотека</h1>
            <p className="text-xs text-white/50 uppercase tracking-widest font-medium">База знаний</p>
          </div>
        </div>

        <div className="px-5 pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`
                  px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                  ${activeCategory === cat.id 
                    ? 'bg-white text-black border-white shadow-lg' 
                    : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'}
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 px-5 pt-4 pb-20 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filtered.map((rec) => (
          <div 
            key={rec.id}
            onClick={() => setSelectedTip(rec)}
            className={`
              group relative overflow-hidden rounded-[32px] p-6 
              bg-black/20 backdrop-blur-md 
              border-2 ${rec.borderColor} 
              cursor-pointer active:scale-[0.98] transition-transform shadow-lg 
              h-[160px] flex flex-col justify-between
            `}
          >
            
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/90">
                 <rec.icon size={20} strokeWidth={1.5} />
              </div>
              <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${rec.tagColor}`}>
                {rec.tag}
              </span>
            </div>

            <div className="mt-1">
              <h3 className="text-xl font-serif font-bold text-white mb-1 leading-tight line-clamp-1">
                {rec.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-medium line-clamp-2">
                {rec.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 group-hover:text-white/80 transition-colors">
              <span>Изучить</span>
              <ArrowRight size={12} />
            </div>

          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedTip && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setSelectedTip(null)} 
          />
          
          <div className={`
            relative w-full sm:max-w-md h-[85vh] 
            bg-[#18181b]/95 backdrop-blur-xl 
            rounded-t-[40px] sm:rounded-[40px] 
            border-t-2 sm:border-2 ${selectedTip.borderColor}
            shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden
          `}>
            
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setSelectedTip(null)} 
              className="absolute right-6 top-6 p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* Скроллируемая область */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Шапка внутри скролла (чтобы уезжала наверх) */}
              <div className="px-8 pt-12 pb-6 flex flex-col items-center text-center">
                 <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/10 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]`}>
                    <selectedTip.icon size={40} strokeWidth={1} />
                 </div>
                 
                 <h2 className="text-3xl font-serif font-bold text-white mb-3 leading-tight">
                   {selectedTip.title}
                 </h2>

                 <div className="flex flex-wrap justify-center gap-2 opacity-90">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10 ${selectedTip.tagColor} bg-opacity-20`}>
                      {selectedTip.tag}
                    </span>
                 </div>
              </div>

              {/* Контент */}
              <div className="px-6 pb-6 space-y-8">
                
                {/* Блок Суть - минималистичный */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${selectedTip.textColor} opacity-80`}>
                    <Lightbulb size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Суть</h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed font-serif pl-4 border-l-2 border-white/10">
                    {selectedTip.essence}
                  </p>
                </div>

                {/* Блок Наука - минималистичный */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${selectedTip.textColor} opacity-60`}>
                    <Atom size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Наука</h3>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed pl-4 border-l-2 border-white/5">
                    {selectedTip.science}
                  </p>
                </div>

                {/* Пустота для скролла */}
                <div className="h-20"></div>
              </div>
            </div>
            
            {/* Футер с кнопкой */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#18181b] via-[#18181b] to-transparent">
              <button 
                onClick={() => setSelectedTip(null)} 
                className={`w-full py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/5 active:scale-[0.98] transition-all font-serif backdrop-blur-sm`}
              >
                Понятно
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsScreen;