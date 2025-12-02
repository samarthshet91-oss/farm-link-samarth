import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CropListing, BuyerRequest, ChatRoom, ChatMessage, UserRole, Order, OrderStatus } from '../types';
import { MOCK_USERS, MOCK_LISTINGS, MOCK_REQUESTS } from '../constants';

interface StoreContextType {
  user: User | null;
  users: User[];
  listings: CropListing[];
  requests: BuyerRequest[];
  chatRooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  cart: CropListing[];
  orders: Order[];
  login: (identifier: string, password: string, role: UserRole) => boolean;
  signup: (name: string, identifier: string, password: string, role: UserRole) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addListing: (listing: CropListing) => void;
  addRequest: (request: BuyerRequest) => void;
  sendMessage: (roomId: string, text: string) => void;
  createChat: (otherUserId: string) => string;
  purchaseListing: (listingId: string, quantity: number) => void;
  addToCart: (item: CropListing) => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize users from localStorage if available, otherwise use mocks.
  // CHANGED KEY TO 'farmlink_users_v2' TO RESET DATA AND FIX LOGIN ISSUES
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('farmlink_users_v2');
      if (saved) {
        return JSON.parse(saved);
      }
      return MOCK_USERS;
    } catch (e) {
      return MOCK_USERS;
    }
  });

  const [user, setUser] = useState<User | null>(null);
  
  // Persist users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('farmlink_users_v2', JSON.stringify(users));
  }, [users]);

  const [listings, setListings] = useState<CropListing[]>(MOCK_LISTINGS);
  const [requests, setRequests] = useState<BuyerRequest[]>(MOCK_REQUESTS);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [cart, setCart] = useState<CropListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = (identifier: string, password: string, role: UserRole) => {
    const id = identifier.trim().toLowerCase(); 
    const pass = password.trim();

    // Simple and robust matching
    const foundUser = users.find(u => {
      const emailMatch = u.email && u.email.toLowerCase() === id;
      const phoneMatch = u.phoneNumber && u.phoneNumber === id;
      return (emailMatch || phoneMatch) && u.password === pass;
    });
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (name: string, identifier: string, password: string, role: UserRole) => {
    const rawId = identifier.trim();
    const pass = password.trim();
    const isEmail = rawId.includes('@');

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email: isEmail ? rawId : '',
      phoneNumber: !isEmail ? rawId : '',
      password: pass,
      role,
      location: 'Unknown'
    };
    
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const addListing = (listing: CropListing) => {
    setListings(prev => [listing, ...prev]);
  };

  const addRequest = (request: BuyerRequest) => {
    setRequests(prev => [request, ...prev]);
  };

  const purchaseListing = (listingId: string, quantity: number) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const newQty = l.quantity - quantity;
        return { 
          ...l, 
          quantity: Math.max(0, newQty), 
          status: newQty <= 0 ? 'sold' : 'active' 
        };
      }
      return l;
    }));
  };

  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    purchaseListing(order.listingId, order.quantity);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addToCart = (item: CropListing) => {
    setCart(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const createChat = (otherUserId: string) => {
    if (!user) return '';
    const existing = chatRooms.find(r => r.participants.includes(user.id) && r.participants.includes(otherUserId));
    if (existing) return existing.id;

    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      participants: [user.id, otherUserId],
      lastUpdated: Date.now(),
    };
    setChatRooms(prev => [...prev, newRoom]);
    return newRoom.id;
  };

  const sendMessage = (roomId: string, text: string) => {
    if (!user) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: Date.now()
    };
    
    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), msg]
    }));
    
    setChatRooms(prev => prev.map(r => r.id === roomId ? { ...r, lastMessage: text, lastUpdated: Date.now() } : r));
  };

  return (
    <StoreContext.Provider value={{
      user, users, listings, requests, chatRooms, messages, cart, orders,
      login, signup, logout, updateProfile, addListing, addRequest, sendMessage, createChat, purchaseListing, addToCart, placeOrder, updateOrderStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};