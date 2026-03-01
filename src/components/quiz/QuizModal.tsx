import React, { useState, useEffect } from 'react';
import { X, Check, Brain, Trophy, Star, ArrowRight } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

// Типы данных из старого кода
interface Question {
  id: number;
  type: 'choice' | 'reflection';
  text: string;
  options?: { text: string; isCorrect: boolean }[];
  hint?: string;
}

// Вопросы (Logic preserved)
const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'choice',
    text: 'Что является самым надежным тестом на реальность во сне?',
    options: [
      { text: 'Посмотреть на свои руки или часы', isCorrect: true },
      { text: 'Попробовать взлететь', isCorrect: false },
      { text: 'Громко закричать', isCorrect: false },
      { text: 'Ущипнуть себя', isCorrect: false },
    ],
  },
  {
    id: 2,
    type: 'choice',
    text: 'Какая фаза сна наиболее благоприятна для Осознанных Сновидений?',
    options: [
      { text: 'Глубокий сон (Delta)', isCorrect: false },
      { text: 'Быстрый сон (REM)', isCorrect: true },
      { text: 'Поверхностный сон', isCorrect: false },
    ],
  },
  {
    id: 3,
    type: 'reflection',
    text: 'Опишите ваше намерение на следующую ночь. Зачем вам осознанность?',
    hint: 'Чем детальнее ответ, тем выше шанс (и бонусные очки!)',
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [score, setScore] = useState(0);
  const [reflectionDepth, setReflectionDepth] = useState(0); // 0 to 100
  const [showResult, setShowResult] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({});
      setScore(0);
      setShowResult(false);
      setReflectionText('');
      setReflectionDepth(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep) / QUESTIONS.length) * 100;

  // Логика выбора ответа (Choice)
  const handleOptionClick = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 10);
    
    // Небольшая задержка для анимации клика
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        finishQuiz();
      }
    }, 200);
  };

  // Логика текстового ответа (Reflection)
  const handleReflectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setReflectionText(text);
    // Простая эвристика глубины: 1 очко за каждые 2 символа, макс 20 бонусных очков
    const depth = Math.min(Math.floor(text.length / 2), 20); 
    setReflectionDepth(depth);
  };

  const handleNextReflection = () => {
    setScore((prev) => prev + reflectionDepth);
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Финальный подсчет с учетом текущего шага
    let finalScore = score;
    // Если последний шаг был рефлексией, очки уже добавлены в handleNextReflection, 
    // но если это был выбор - он добавился в handleOptionClick.
    // Тут упростим: просто показываем результат.
    
    setShowResult(true);
  };

  const handleCloseResult = () => {
    onSubmit(score); // Отправляем результат в родительский компонент
    onClose();
  };

  // --- RENDER ---

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#7355af] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Осознанность</h2>
              {!showResult && (
                 <p className="text-xs text-white/50">Вопрос {currentStep + 1} из {QUESTIONS.length}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!showResult ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div 
                  className="h-full bg-orange-500 transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <h3 className="mb-6 text-xl font-medium text-white/90 leading-relaxed">
                {currentQuestion.text}
              </h3>

              {/* Варианты ответа */}
              {currentQuestion.type === 'choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option.isCorrect)}
                      className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:bg-orange-500/20 hover:border-orange-500/50 active:scale-[0.98]"
                    >
                      <span className="text-sm font-medium text-white/80 group-hover:text-white">{option.text}</span>
                      <ArrowRight size={16} className="text-white/0 transition-all group-hover:text-orange-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Текстовое поле */}
              {currentQuestion.type === 'reflection' && (
                <div className="space-y-4">
                  <textarea
                    value={reflectionText}
                    onChange={handleReflectionChange}
                    placeholder="Напишите здесь..."
                    className="h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                  />
                  
                  {/* Бонус индикатор */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-white/40">Чем глубже ответ, тем больше бонус</span>
                     <span className="flex items-center gap-1 text-xs font-bold text-orange-400">
                        +{reflectionDepth} XP
                     </span>
                  </div>

                  <button
                    onClick={handleNextReflection}
                    disabled={reflectionText.length < 5}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Далее
                  </button>
                </div>
              )}
            </>
          ) : (
            // Result View
            <div className="flex flex-col items-center py-4 text-center animate-in zoom-in duration-300">
              <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full"></div>
                 <Trophy size={64} className="text-orange-400 relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Квиз завершен!</h3>
              <p className="text-white/60 mb-8 max-w-[200px]">Вы отлично поработали над своей осознанностью.</p>

              <div className="mb-8 flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-8 py-4 ring-1 ring-white/10">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="text-3xl font-bold text-white">+{score}</span>
                <span className="text-sm font-medium text-white/50">XP</span>
              </div>

              <button
                onClick={handleCloseResult}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-transform active:scale-95"
              >
                Забрать награду
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};