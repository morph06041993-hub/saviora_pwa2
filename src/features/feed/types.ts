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
}

export interface Comment {
  id: string;
  text: string;
  created_at: number;
  author: Author;
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