
export enum ViewMode {
  QUICK_PICK = 'QUICK_PICK',
  EXPLORE = 'EXPLORE',
  REELS = 'REELS'
}

export interface RedditComment {
  emoji: string; // "🔥" or "⚠️"
  text: string;
  author: string;
  upvotes: string;
}

export interface ReviewData {
  imdbRating: number;
  rtScore: number; // Percentage
  redditTrending: boolean;
  redditComments?: RedditComment[];
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  matchScore: number; // 0-100
  imageUrl: string;
  reviews: ReviewData;
  category: 'recommended' | 'taste_cluster' | 'popular' | 'standard';
}

export interface TasteCluster {
  name: string;
  tags: string[];
}
