import { Product } from '@/contexts/CartContext';
import robotToyPremium from '@/assets/robot-toy-premium.jpg';
import catToyPremium from '@/assets/cat-toy-premium.jpg';
import puzzleFeederPremium from '@/assets/puzzle-feeder-premium.jpg';
import laserToyPremium from '@/assets/laser-toy-premium.jpg';

// API Configuration - Use import.meta.env for Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API endpoints
const ENDPOINTS = {
  PRODUCTS: '/products',
  CART: '/cart',
  CART_SYNC: '/cart/sync',
};

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Product API functions
export const productAPI = {
  // Fetch all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const products = await apiCall(ENDPOINTS.PRODUCTS);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data if API fails
      return getMockProducts();
    }
  },

  // Fetch product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const product = await apiCall(`${ENDPOINTS.PRODUCTS}/${id}`);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const products = await apiCall(`${ENDPOINTS.PRODUCTS}/search?q=${encodeURIComponent(query)}`);
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
};

// Cart API functions
export const cartAPI = {
  // Sync cart with backend (for logged-in users)
  syncCart: async (cartItems: any[]): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        return false; // No token, skip sync
      }

      await apiCall(ENDPOINTS.CART_SYNC, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      });
      
      return true;
    } catch (error) {
      console.error('Error syncing cart:', error);
      return false;
    }
  },

  // Get user's cart from backend
  getUserCart: async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        return [];
      }

      const cart = await apiCall(ENDPOINTS.CART, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return cart.items || [];
    } catch (error) {
      console.error('Error fetching user cart:', error);
      return [];
    }
  },
};

// Mock data for development/testing
const getMockProducts = (): Product[] => [
  {
    id: '1',
    name: 'SmartPlay Robot Companion',
    price: 149.99,
    originalPrice: 199.99,
    image: robotToyPremium,
    category: 'Interactive Robots',
    description: 'An advanced AI-powered robot companion that adapts to your pet\'s behavior and provides hours of interactive entertainment.',
    features: [
      'AI-powered adaptive play modes',
      'Motion sensors and obstacle avoidance',
      'LED light patterns for visual stimulation',
      'Rechargeable battery (8+ hours)',
      'Safe, durable materials',
      'App connectivity for remote control'
    ],
    rating: 5,
    reviews: 127,
    isNew: true,
  },
  {
    id: '2',
    name: 'FelineBot Interactive Cat Toy',
    price: 89.99,
    image: catToyPremium,
    category: 'Cat Toys',
    description: 'A high-tech interactive toy designed specifically for cats, featuring feathers, motion sensors, and unpredictable movement patterns.',
    features: [
      'Automatic motion detection',
      'Replaceable feather attachments',
      'Silent motor operation',
      'Timer-based play sessions',
      'Battery level indicator',
      'Washable components'
    ],
    rating: 5,
    reviews: 89,
  },
  {
    id: '3',
    name: 'BrainBoost Puzzle Feeder',
    price: 69.99,
    originalPrice: 89.99,
    image: puzzleFeederPremium,
    category: 'Smart Feeders',
    description: 'Transform mealtime into a mental workout with this innovative puzzle feeder.',
    features: [
      'Adjustable difficulty levels',
      'Multiple feeding compartments',
      'Non-slip base design',
      'Easy to clean and fill',
      'Slows down eating pace',
      'Suitable for all pet sizes'
    ],
    rating: 4,
    reviews: 203,
  },
  {
    id: '4',
    name: 'AutoLaser Pro Pet Entertainment',
    price: 75.99,
    image: laserToyPremium,
    category: 'Cat Toys',
    description: 'Professional-grade automatic laser toy with multiple play patterns and safety features.',
    features: [
      '5 different laser patterns',
      'Auto shut-off safety timer',
      'Silent operation mode',
      'Wall or floor mounting',
      'Remote control included',
      'Pet-safe laser technology'
    ],
    rating: 5,
    reviews: 156,
  },
  {
    id: '5',
    name: 'Smart Treat Dispenser',
    price: 95.99,
    image: puzzleFeederPremium,
    category: 'Smart Feeders',
    description: 'WiFi-enabled treat dispenser with camera and two-way audio.',
    features: [
      'HD camera with night vision',
      'Two-way audio communication',
      'Scheduled treat dispensing',
      'Mobile app control',
      'Treat portion control',
      'Cloud video storage'
    ],
    rating: 4,
    reviews: 234,
  },
  {
    id: '6',
    name: 'Interactive Ball Launcher',
    price: 129.99,
    originalPrice: 159.99,
    image: robotToyPremium,
    category: 'Interactive Robots',
    description: 'Automatic ball launcher that keeps dogs entertained for hours.',
    features: [
      '3 distance settings (10-30ft)',
      'Motion safety sensors',
      'Weatherproof design',
      'Rechargeable battery',
      'Compatible with standard tennis balls',
      'Training mode for new pets'
    ],
    rating: 5,
    reviews: 178,
    isNew: true,
  },
];

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}; 