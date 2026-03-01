import { useState, useEffect, useCallback, useRef } from 'react';
import { getMockFeed, toggleDreamLike } from '../../utils/api'; 

// ОПРЕДЕЛЯЕМ ТИПЫ ЛОКАЛЬНО (чтобы не зависеть от API)
export interface FeedDream {
  id: string;
  title: string;
  dreamText: string;
  published_at: number;
  likes_count: number;
  comments_count: number;
  views_count: number;
  user_liked: boolean;
  author: { displayName: string; avatar: string | null };
  tags?: string[];
}

export function useFeed() {
  const [dreams, setDreams] = useState<FeedDream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentSortRef = useRef('latest');

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMockFeed(1, 10, currentSortRef.current);
      setDreams(data.dreams);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  const changeSort = useCallback((newSort: string) => {
    currentSortRef.current = newSort;
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    fetchFeed();
  }, []);

  const toggleLike = async (dreamId: string) => {
    setDreams((prev) => prev.map((d) => d.id === dreamId ? { ...d, user_liked: !d.user_liked, likes_count: d.user_liked ? d.likes_count - 1 : d.likes_count + 1 } : d));
    await toggleDreamLike(dreamId, false);
  };

  return { dreams, loading, error, changeSort, toggleLike, currentSort: currentSortRef.current };
}