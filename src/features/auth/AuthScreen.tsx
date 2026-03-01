import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider'; // Твой хук

const AuthScreen = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth(); // Берем функцию и ошибку из хука
  
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setLocalLoading(true);
    const success = await login(email, password); // Реальный запрос
    setLocalLoading(false);

    if (success) {
      // Если успех, App.tsx сам перекинет на главную, так как user обновится
      // Но для надежности можно и так:
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden text-white font-sans">
      <img src="/logo.png" className="watermark-logo" alt="" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#764ba2] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        
        <div className={`text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-4xl font-bold tracking-[0.2em] mb-3 font-serif">SAVIORA</h1>
          <p className="text-white/60 font-serif italic font-bold text-base mb-12">
            Здесь сны говорят. <br/> Мы – помогаем слушать
          </p>
        </div>

        <div className={`w-full space-y-4 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[200px] opacity-0'}`}>
          
          {/* ОТОБРАЖЕНИЕ ОШИБКИ */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-sm text-red-200">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md focus-within:bg-white/10 transition-colors">
            <Mail className="text-white/40" size={20} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none placeholder:text-white/20 text-white font-sans" 
            />
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md focus-within:bg-white/10 transition-colors">
            <Lock className="text-white/40" size={20} />
            <input 
              type="password" 
              placeholder="Пароль" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none placeholder:text-white/20 text-white font-sans" 
            />
          </div>

          <button 
            onClick={handleLogin}
            disabled={localLoading}
            className="w-full py-4 bg-gradient-to-r from-[#6974dc] to-[#7355af] rounded-2xl font-bold text-lg text-white shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {localLoading ? 'Вход...' : 'Войти'}
            {!localLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="text-center pt-4">
            <p className="text-white/40 text-sm">
              Нет аккаунта?{' '}
              <span onClick={() => navigate('/register')} className="text-white font-bold cursor-pointer hover:underline">
                Создать
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;