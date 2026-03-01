// src/screens/quiz/QuizModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  IconButton,
  Snackbar,
  Alert,
  Collapse,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, AnimatePresence } from 'framer-motion';

// === INTERFACES ===
export interface QuizQuestion {
  type: 'choice' | 'reflection';
  text: string;
  options?: string[];
  correctIndex?: number | null;
}

export interface QuizAnswer {
  questionIndex: number;
  userAnswer: string;
  disagreed?: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  depthBonus: number;
}

interface QuizModalProps {
  quizId: string;
  questions: QuizQuestion[];
  contextTitle?: string;
  contextText?: string;
  onClose: () => void;
  onFinish: (result: QuizResult) => void;
  onSubmit: (quizId: string, answers: QuizAnswer[]) => Promise<QuizResult>;
  title?: string;
  subtitle?: string;
}

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '&.MuiSnackbar-anchorOriginBottomCenter': {
    bottom: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '420px',
  },
}));

export function QuizModal({
  quizId,
  questions,
  contextTitle,
  onClose,
  onFinish,
  onSubmit,
  title = 'Квиз',
  subtitle = 'Ответь на вопросы и получи бонусные очки глубины',
}: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'suggestion' | 'info'>('info');
  const [headerExpanded, setHeaderExpanded] = useState(true);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  // --- СТИЛИ ---
  // Фон карточек (как на Home Screen)
  const darkCardBg = 'rgba(42, 42, 53, 0.6)'; 
  const cardShadow = '0 8px 32px 0 rgba(0,0,0,0.25)';
  const glassBorder = 'rgba(255, 255, 255, 0.1)';
  
  const softPurple = 'rgba(200, 162, 235, 0.7)';
  const softYellowGlass = 'rgba(255, 243, 205, 0.15)';

  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  useEffect(() => {
    setSelectedOption(null);
    setReflectionText('');
  }, [currentIndex]);

  const handleNext = () => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'choice' && selectedOption === null) return;
    if (currentQuestion.type === 'reflection' && !reflectionText.trim()) return;

    const isChoice = currentQuestion.type === 'choice';
    const hasCorrectAnswer = currentQuestion.correctIndex !== undefined && currentQuestion.correctIndex !== null;
    const correct = isChoice && hasCorrectAnswer ? selectedOption === currentQuestion.correctIndex : true;

    const answer: QuizAnswer = {
      questionIndex: currentIndex,
      userAnswer: isChoice ? String(selectedOption) : reflectionText.trim(),
      disagreed: isChoice && hasCorrectAnswer && !correct,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isChoice) {
      if (hasCorrectAnswer) {
        if (correct) {
          setSnackbarMessage('✅ Верно!');
          setSnackbarType('success');
        } else {
          setSnackbarMessage('Возможно, стоит вернуться и пересмотреть контекст вместе с Saviora.');
          setSnackbarType('suggestion');
        }
      } else {
        setSnackbarMessage('🧠 Глубокое наблюдение!');
        setSnackbarType('info');
      }
      setSnackbarOpen(true);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
        else finishQuiz(newAnswers);
      }, 2000);
    } else {
      if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
      else finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: QuizAnswer[]) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(quizId, finalAnswers);
      onFinish(result);
    } catch (e) {
      console.error('Quiz submission error:', e);
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 520, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'relative',
      pt: 'calc(80px + env(safe-area-inset-top))',
      
      // === ФОН ПРИЛОЖЕНИЯ ПРЯМО В МОДАЛКЕ ===
      backgroundColor: '#0F0F11', 
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(123, 97, 255, 0.15) 0%, transparent 50%)',
      margin: '0 auto', 
    }}>
      
      {/* Шапка модалки */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, flexShrink: 0, zIndex: 10 }}>
        <Box>
          <Typography variant="h6" sx={{ fontFamily: 'Diphylleia, serif', fontWeight: 400, color: '#fff', fontSize: '1.2rem' }}>{title}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontFamily: 'Nunito, sans-serif' }}>{subtitle}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
      </Box>

      {/* Скролл-зона */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        px: 2, 
        pb: '150px', 
        display: 'block', 
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none',
        zIndex: 10
      }}>
        
        {/* === БЛОК ВОПРОСА В СТИЛЕ HOME SCREEN === */}
        <Box sx={{ 
          mb: 3, 
          p: 2.5, 
          background: darkCardBg, // ТЕМНЫЙ ФОН #2A2A35
          backdropFilter: 'blur(16px)', 
          border: `1px solid ${glassBorder}`, 
          borderRadius: '24px', 
          boxShadow: cardShadow
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {contextTitle || 'Вопрос'}
            </Typography>
            <IconButton size="small" onClick={() => setHeaderExpanded(!headerExpanded)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {headerExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={headerExpanded}>
            <Typography variant="body1" sx={{ color: '#fff', whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.5, mb: 2, fontFamily: 'DM Serif Text, serif' }}>
              {currentQuestion.text}
            </Typography>
            
            {(prevQuestion || nextQuestion) && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: prevQuestion && nextQuestion ? '1fr 1fr' : '1fr' }, gap: 1 }}>
                {prevQuestion && (
                  <Card elevation={0} sx={{ background: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${glassBorder}`, borderRadius: 3, color: '#fff' }}>
                    <CardActionArea onClick={() => setCurrentIndex(currentIndex - 1)}>
                      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, py: 1, px: 1.5 }}>
                        <ArrowBackIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, mt: '3px' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Nunito' }}>
                          Назад
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )}
                {nextQuestion && (
                  <Card elevation={0} sx={{ background: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${glassBorder}`, borderRadius: 3, color: '#fff' }}>
                    <CardActionArea onClick={() => setCurrentIndex(currentIndex + 1)}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75, py: 1, px: 1.5 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Nunito' }}>
                          Далее
                        </Typography>
                        <ArrowForwardIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }} />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )}
              </Box>
            )}
          </Collapse>
        </Box>

        {/* Прогресс */}
        <Box sx={{ mb: 3, px: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: 'Nunito' }}>Прогресс</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontFamily: 'Nunito' }}>{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: softPurple, borderRadius: 2 } }} />
        </Box>

        {/* Ответы */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    fullWidth
                    sx={{
                      textTransform: 'none', 
                      justifyContent: 'flex-start', 
                      textAlign: 'left', 
                      p: 2, 
                      borderRadius: '20px',
                      border: `1px solid ${selectedOption === index ? softPurple : glassBorder}`,
                      bgcolor: selectedOption === index ? 'rgba(200, 162, 235, 0.2)' : 'rgba(42, 42, 53, 0.4)', 
                      color: '#fff', 
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s',
                      fontFamily: 'Nunito',
                      '&:hover': {
                         bgcolor: selectedOption === index ? 'rgba(200, 162, 235, 0.25)' : 'rgba(42, 42, 53, 0.6)',
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: '0.95rem' }}>{option}</Typography>
                  </Button>
                ))}
              </Box>
            )}

            {currentQuestion.type === 'reflection' && (
              <Box component="textarea" value={reflectionText} onChange={(e: any) => setReflectionText(e.target.value)} placeholder="Поделись своими мыслями..."
                sx={{ 
                  width: '100%', 
                  minHeight: 140, 
                  p: 2.5, 
                  borderRadius: '24px', 
                  border: `1px solid ${glassBorder}`, 
                  bgcolor: 'rgba(42, 42, 53, 0.4)', 
                  color: '#fff', 
                  fontFamily: 'Nunito', 
                  fontSize: '1rem', 
                  outline: 'none', 
                  resize: 'none',
                  '&::placeholder': { color: 'rgba(255,255,255,0.3)' }
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* === КНОПКА БЕЗ БЕЛОЙ ЗАЛИВКИ === */}
        <Box sx={{ mt: 4 }}>
          <Button
            onClick={handleNext}
            disabled={(currentQuestion.type === 'choice' && selectedOption === null) || (currentQuestion.type === 'reflection' && !reflectionText.trim()) || isSubmitting}
            fullWidth
            sx={{ 
              py: 2, 
              borderRadius: '16px', 
              textTransform: 'none', 
              fontWeight: 700, 
              fontSize: '1rem', 
              fontFamily: 'Nunito',
              // СТЕКЛЯННЫЙ СТИЛЬ: Прозрачный фон, белая рамка
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff', 
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.15)', borderColor: '#fff' },
              '&:disabled': { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', boxShadow: 'none' } 
            }}
          >
            {isSubmitting ? 'Сохраняем...' : (currentIndex < questions.length - 1 ? 'Далее' : 'Завершить')}
          </Button>
        </Box>
      </Box>

      {/* Snackbar */}
      <StyledSnackbar open={snackbarOpen} autoHideDuration={2500} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          icon={false} 
          sx={{ 
            width: '100%', color: '#fff', backdropFilter: 'blur(20px)', border: `1px solid ${glassBorder}`, borderRadius: 3, textAlign: 'center', justifyContent: 'center',
            background: snackbarType === 'suggestion' ? softYellowGlass : darkCardBg,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            '& .MuiAlert-message': { width: '100%', p: 1, fontFamily: 'Nunito' }
          }}
        >
          {snackbarMessage}
        </Alert>
      </StyledSnackbar>
    </Box>
  );
}