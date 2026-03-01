import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './features/auth/AuthProvider';
import { FeedbackModal } from './components/FeedbackModal'; // <--- Импорт модалки

// Импорт экранов
import { HomeScreen } from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthScreen from './screens/AuthScreen';
import MoodSelectionScreen from './screens/MoodSelectionScreen';
import MoodDetailScreen from './screens/MoodDetailScreen';
import { ChatScreen } from './screens/ChatScreen';
import RecommendationsScreen from './screens/advices/RecommendationsScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { FeedScreen } from './features/feed/FeedScreen';
import { SleepScreen } from './screens/sleep/SleepScreen';
import { DreamDetailScreen } from './screens/sleep/DreamDetailScreen';
import { DreamAnalysisScreen } from './screens/sleep/DreamAnalysisScreen';
import { StatsScreen } from './screens/StatsScreen';

// Заглушка
const PlaceholderScreen = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center text-white relative font-sans bg-[#09090b]">
    <div className="text-center">
      <h1 className="text-3xl font-serif mb-2">{title}</h1>
      <p className="text-white/50">Страница в разработке</p>
    </div>
  </div>
);

// Компонент защиты роутов
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-[#0F0F11]">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // === ЛОГИКА: ВСЕГДА ОТКРЫВАТЬ ХОУМ СКРИН ПРИ ЗАГРУЗКЕ ===
  useEffect(() => {
    // Ждем, пока загрузится авторизация
    if (!loading && user) {
      // Перенаправляем на '/' если это первая загрузка приложения
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); 

  if (loading) {
    return <div className="min-h-screen bg-[#0F0F11]" />;
  }

  return (
    <>
      {/* 
          ВСТАВЛЯЕМ МОДАЛКУ ЗДЕСЬ.
          Она будет поверх всех экранов благодаря z-index в самом компоненте.
          Покажется только если пользователь авторизован (так как она внутри App, а App рендерится всегда),
          но логика внутри FeedbackModal сама решит, когда ей всплыть.
      */}
      {user && <FeedbackModal />}

      <Routes>
        <Route path="/auth" element={!user ? <AuthScreen /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />

        {/* ГЛАВНАЯ */}
        <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        
        {/* ЛЕНТА */}
        <Route path="/feed" element={<ProtectedRoute><FeedScreen /></ProtectedRoute>} />

        {/* ЧАТ */}
        <Route path="/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
        <Route path="/chat/:dateId" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><InsightsScreen /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryScreen /></ProtectedRoute>} />

        {/* НАСТРОЕНИЕ */}
        <Route path="/mood" element={<ProtectedRoute><MoodSelectionScreen /></ProtectedRoute>} />
        <Route path="/mood/:categoryId" element={<ProtectedRoute><MoodDetailScreen /></ProtectedRoute>} />

        {/* СОВЕТЫ */}
        <Route path="/recommendations" element={<ProtectedRoute><RecommendationsScreen /></ProtectedRoute>} />

        {/* СТАТИСТИКА */}
        <Route path="/stats" element={<ProtectedRoute><StatsScreen /></ProtectedRoute>} />

        {/* СОН (ДНЕВНИК) */}
        <Route path="/sleep" element={<ProtectedRoute><SleepScreen /></ProtectedRoute>} />
        <Route path="/dream/:id" element={<ProtectedRoute><DreamDetailScreen /></ProtectedRoute>} />
        <Route path="/dream/:id/analysis" element={<ProtectedRoute><DreamAnalysisScreen /></ProtectedRoute>} />
        
        {/* Редирект для старых ссылок */}
        <Route path="/journal" element={<Navigate to="/feed" replace />} />

        {/* Любой неизвестный путь -> На главную */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;