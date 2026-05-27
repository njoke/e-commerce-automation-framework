export interface User {
  id: string;
  username: string;
  role: 'standard' | 'locked' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  rating: number;
}

export interface CartItem {
  itemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

export interface CheckoutPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardNumber?: string;
  items?: CartItem[];
}
