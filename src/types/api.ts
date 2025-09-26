export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface WardrobeItem {
  id: string;
  userId: string;
  title: string;
  category: "TOP" | "BOTTOM" | "OUTERWEAR" | "FOOTWEAR" | "ACCESSORY";
  color?: string;
  season?: string;
  imageUrl: string;
  thumbnailUrl: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedItems {
  items: WardrobeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateItemRequest {
  title: string;
  category: string;
  color?: string;
  season?: string;
  notes?: string;
  image: File;
}

export interface UpdateItemRequest {
  title?: string;
  category?: string;
  color?: string;
  season?: string;
  notes?: string;
  image?: File;
}

export interface QueryItemsRequest {
  category?: string;
  color?: string;
  season?: string;
  search?: string;
  page?: number;
  limit?: number;
}
