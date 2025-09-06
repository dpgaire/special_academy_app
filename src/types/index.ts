export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<{ success: boolean }>;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  courseCount?: number;
  imageUrl?: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  description?: string;
  itemCount?: number;
  categoryId: string;
}

export interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'youtube_url';
  contentUrl: string;
  youtube_url: string;
  file_path: string;
  duration?: number; // in minutes
  subcategoryId: string;
}

export type RootStackParamList = {
  Login: undefined;
  Categories: undefined;
  Subcategories: { categoryName: string };
  Items: { subcategoryName: string };
  ContentWebView: { title: string; contentUrl: string };
  Settings: undefined;
};

