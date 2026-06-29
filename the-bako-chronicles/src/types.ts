export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  location: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  comments: Comment[];
  likes: number;
}

export interface TravelTip {
  id: string;
  category: string;
  title: string;
  icon: string;
  summary: string;
  details: string[];
}
