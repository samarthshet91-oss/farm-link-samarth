import { User, CropListing, BuyerRequest } from './types';

export const APP_NAME = '';

// Mock Data for Demo Purposes
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Appleseed', email: 'john@farm.com', password: '123', role: 'farmer', location: 'Punjab, India' },
  { id: 'u2', name: 'Fresh Mart Ltd', email: 'buyer@market.com', password: '123', role: 'buyer', location: 'Mumbai, India' },
  { id: 'u3', name: 'Admin User', email: 'admin@farmlink.com', password: '123', role: 'admin' },
];

export const MOCK_LISTINGS: CropListing[] = [
  {
    id: 'l1',
    farmerId: 'u1',
    farmerName: 'John Appleseed',
    cropName: 'Organic Avocados',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 250,
    location: 'Bangalore, KA',
    qualityGrade: 'A',
    description: 'Freshly harvested Hass avocados. Organic certified.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    status: 'active',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'l2',
    farmerId: 'u1',
    farmerName: 'John Appleseed',
    cropName: 'Sweet Corn',
    quantity: 1200,
    unit: 'ears',
    pricePerUnit: 15,
    location: 'Pune, MH',
    qualityGrade: 'B',
    description: 'Sweet yellow corn, bulk harvest.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    status: 'active',
    createdAt: Date.now() - 200000,
  }
];

export const MOCK_REQUESTS: BuyerRequest[] = [
  {
    id: 'r1',
    buyerId: 'u2',
    buyerName: 'Fresh Mart Ltd',
    cropName: 'Organic Avocados',
    quantityNeeded: 200,
    maxBudget: 60000,
    location: 'Mumbai, MH',
    status: 'open',
    createdAt: Date.now() - 50000,
  }
];