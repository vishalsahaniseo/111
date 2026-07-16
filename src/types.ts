import { Timestamp } from 'firebase/firestore';

export interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featureImage: string;
  status: 'draft' | 'published';
  publishedAt: Timestamp | null;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: 'owner' | 'administrator' | 'editor' | 'author' | 'contributor';
  avatar: string;
}

export interface Settings {
  id?: string;
  siteTitle: string;
  siteDescription: string;
  coverImage: string;
}
