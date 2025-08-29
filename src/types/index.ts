export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  size: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemData {
  name: string;
  description?: string;
  category: string;
  color: string;
  size: string;
  image?: File;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  category?: string;
  color?: string;
  size?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: {
    top?: Item;
    bottom?: Item;
    shoes?: Item;
    accessories?: Item;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OutfitSelection {
  top?: Item;
  bottom?: Item;
  shoes?: Item;
  accessories?: Item;
}

export type ClothingCategory = "top" | "bottom" | "shoes" | "accessories";
