import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider';

const AuthScreen = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6875dc] to-[#7355af] text-white font-sans flex flex-col justify-center items-center px-6 relative overflow-hidden">
      
      {/* Логотип на фоне */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <img 
            src="/logo.png" 
            alt="" 
            className="w-[80vw] max-w-[500px] opacity-[0.15] blur-sm" 
            onError={(e) => e.currentTarget.style.display = 'none'} 
         />
      </div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        
        {/* Хедер */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold tracking-[0.2em] text-white mb-4">
            SAVIORA
          </h1>
          <p className="text-white/80 font-serif italic text-lg leading-relaxed opacity-90">
            Здесь сны говорят.<br />
            Мы — помогаем слушать.
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-white text-xs p-3 rounded-2xl text-center backdrop-blur-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* EMAIL */}
            <div className="relative group">
              {/* Z-10 ПОДНИМАЕТ ИКОНКУ НАД ИНПУТОМ */}
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                <Mail size={20} className="text-white/80" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-3xl py-4 pl-14 pr-6 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-md relative z-0"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                <Lock size={20} className="text-white/80" />
              </div>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-3xl py-4 pl-14 pr-6 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-md relative z-0"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7c86e9] to-[#8d70c9] border border-white/20 text-white font-bold rounded-3xl py-4 mt-6 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <span className="text-lg">Войти</span>}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-white/60 text-sm font-medium">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-white font-bold hover:opacity-80 transition-opacity ml-1">
              Создать
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;