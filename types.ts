export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: UserRole;
  avatar?: string;
  location?: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  imageUrl?: string;
  description: string;
  qualityGrade?: 'A' | 'B' | 'C';
  status: 'active' | 'sold';
  createdAt: number;
}

export interface BuyerRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  cropName: string;
  quantityNeeded: number;
  maxBudget: number;
  location: string;
  status: 'open' | 'fulfilled';
  createdAt: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  listingId: string;
  cropName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: number;
  address: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastUpdated: number;
}