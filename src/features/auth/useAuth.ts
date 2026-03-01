import { useState } from 'react';
import * as api from '../../utils/api';

const STORAGE_KEY_USER = 'saviora_current_user';

export function useAuth() {
  // 1. При загрузке пытаемся достать юзера из памяти
  const [user, setUser] = useState<api.User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (!saved || saved === 'undefined') return null;
      return JSON.parse(saved);
    } catch (e) {
      // Если данные сломались — чистим их
      localStorage.removeItem(STORAGE_KEY_USER);
      return null;
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- ВХОД ---
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Пытаемся войти через API
      const data = await api.login(email, password);
      
      if (data && data.user) {
        // УСПЕХ: Сохраняем юзера в память и в стейт
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        // Для совместимости со старым кодом
        localStorage.setItem('saviora_is_logged_in', 'true'); 
        setUser(data.user);
        return true;
      } else {
        throw new Error('Неверный ответ сервера');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ошибка входа');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- РЕГИСТРАЦИЯ ---
  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.register(email, password, name);
      
      if (data && data.user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        localStorage.setItem('saviora_is_logged_in', 'true');
        setUser(data.user);
        return true;
      } else {
        throw new Error('Неверный ответ сервера');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ошибка регистрации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- ВЫХОД ---
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem('saviora_is_logged_in');
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
}