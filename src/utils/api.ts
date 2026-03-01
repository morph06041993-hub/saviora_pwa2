// src/utils/api.ts

// === ТИПЫ ===

export interface Author {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
}

export interface FeedDream {
  id: string;
  title: string;
  dreamText: string;
  dreamSummary: string;
  date: number;
  published_at: number;
  likes_count: number;
  comments_count: number;
  views_count: number;
  user_liked: boolean;
  author: Author;
  blocks?: any[]; 
  tags?: string[];
  isPrivate?: boolean;
}

export interface FeedPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedResponse {
  dreams: FeedDream[];
  pagination: FeedPagination;
}

// Типы для чата
export interface ChatConvo {
  id: string;
  date: string;
  title: string;
  category: string;
  context: string;
  messages: any[];
}

export interface Insight {
  id: string;
  text: string;
  convoId: string;
  date: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  xp?: number;
}

// === МОК ДАННЫЕ И УТИЛИТЫ ===

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_AUTHORS: Author[] = [
  { id: '101', email: 'alice@dream.com', displayName: 'Алиса', avatar: null },
  { id: '102', email: 'mark@dream.com', displayName: 'Марк', avatar: null },
  { id: '1', email: 'me@saviora.com', displayName: 'Я', avatar: null },
];

const MOCK_FEED: FeedDream[] = [
  {
    id: 'd1', title: 'Полет сквозь потолок', dreamText: 'Снилось, что я лечу...', dreamSummary: '', date: Date.now(), published_at: Date.now(), likes_count: 12, comments_count: 3, views_count: 45, user_liked: false, author: MOCK_AUTHORS[0], tags: ['Осознанность'], isPrivate: false
  },
];

const MOCK_MY_DREAMS: FeedDream[] = [
  {
    id: 'm1', title: 'Зеркальный лабиринт', dreamText: 'Стены из воды...', dreamSummary: '', date: Date.now(), published_at: Date.now(), likes_count: 0, comments_count: 0, views_count: 0, user_liked: false, author: MOCK_AUTHORS[2], tags: ['Вода'], isPrivate: true
  }
];

// === ЛОГИКА СНОВ (ДНЕВНИК И ЛЕНТА) ===

export const getMockFeed = async (page = 1, limit = 10, sort = 'latest'): Promise<FeedResponse> => {
  await delay(600);
  return { dreams: MOCK_FEED, pagination: { page, limit, total: 1, totalPages: 1 } };
};

export const getMyDreams = async (): Promise<FeedDream[]> => {
  await delay(500);
  const stored = localStorage.getItem('saviora_my_dreams');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('saviora_my_dreams', JSON.stringify(MOCK_MY_DREAMS));
  return MOCK_MY_DREAMS;
};

export const getDreamById = async (id: string): Promise<FeedDream | undefined> => {
  await delay(300);
  const dreams = await getMyDreams(); // Ищем в своих
  return dreams.find(d => d.id === id); 
};

export const createDream = async (text: string, title: string): Promise<FeedDream> => {
  await delay(400);
  const newDream: FeedDream = {
    id: Date.now().toString(),
    title: title || 'Без названия',
    dreamText: text,
    dreamSummary: '',
    date: Date.now(),
    published_at: Date.now(),
    likes_count: 0, comments_count: 0, views_count: 0, user_liked: false,
    author: MOCK_AUTHORS[2],
    tags: [],
    isPrivate: true,
    blocks: []
  };
  const current = await getMyDreams();
  localStorage.setItem('saviora_my_dreams', JSON.stringify([newDream, ...current]));
  return newDream;
};

export const toggleDreamLike = async (dreamId: string, status: boolean) => {
  await delay(200); return { success: true };
};

// === ЛОГИКА ЧАТА (ВОССТАНОВЛЕНА) ===

export const getConvoById = async (dateId: string) => {
  await delay(100);
  const key = `saviora_convo_${dateId}`;
  const saved = localStorage.getItem(key);

  if (saved) return JSON.parse(saved) as ChatConvo;

  const newConvo: ChatConvo = {
    id: dateId,
    date: dateId,
    title: 'Новая беседа',
    category: '',
    context: '',
    messages: []
  };
  localStorage.setItem(key, JSON.stringify(newConvo));
  return newConvo;
};

export const sendMessage = async (convoId: string, text: string, role: 'user' | 'assistant') => {
  const key = `saviora_convo_${convoId}`;
  const saved = localStorage.getItem(key);
  
  let convo = saved ? JSON.parse(saved) : { 
    id: convoId, date: convoId, title: 'Беседа', category: '', context: '', messages: [] 
  };
  
  // ГЕНЕРИРУЕМ УНИКАЛЬНЫЙ ID (чтобы не было ошибки ключей)
  const newMessage = {
    id: Date.now().toString() + Math.random().toString().slice(2),
    text,
    sender: role,
    timestamp: new Date().toISOString()
  };
  
  convo.messages.push(newMessage);
  localStorage.setItem(key, JSON.stringify(convo));
  
  return newMessage;
};

export const updateConvoMetadata = async (convoId: string, metadata: Partial<ChatConvo>) => {
  const key = `saviora_convo_${convoId}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    const convo = JSON.parse(saved);
    const updated = { ...convo, ...metadata };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }
};

export const getAllConvos = async () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('saviora_convo_'));
  const convos = keys.map(k => JSON.parse(localStorage.getItem(k) || '{}'));
  return convos.filter(c => c.messages && c.messages.length > 0);
};

// === ИНСАЙТЫ ===
export const getInsights = async (): Promise<Insight[]> => {
  const data = localStorage.getItem('saviora_insights');
  return data ? JSON.parse(data) : [];
};

export const toggleInsight = async (msgId: string, text: string, convoId: string) => {
  const insights = await getInsights();
  const index = insights.findIndex(i => i.id === msgId);

  if (index >= 0) {
    insights.splice(index, 1);
    localStorage.setItem('saviora_insights', JSON.stringify(insights));
    return false;
  } else {
    const newInsight: Insight = {
      id: msgId,
      text,
      convoId,
      date: new Date().toLocaleDateString('ru-RU')
    };
    insights.unshift(newInsight);
    localStorage.setItem('saviora_insights', JSON.stringify(insights));
    return true;
  }
};

export const checkIsLiked = (msgId: string) => {
  const data = localStorage.getItem('saviora_insights');
  const insights = data ? JSON.parse(data) : [];
  return insights.some((i: any) => i.id === msgId);
};

// === АВТОРИЗАЦИЯ ===
export const register = async () => ({ success: true, user: { id: 1 } });
export const login = async () => ({ success: true, user: { id: 1 } });
export const addXp = async (id: number, amount: number) => ({ id, xp: amount });