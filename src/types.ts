export type ScreenType =
  | 'marketplace'
  | 'product-detail'
  | 'checkout'
  | 'orders'
  | 'admin-dashboard'
  | 'admin-all-products'
  | 'admin-create-product'
  | 'auth-login';

export type CategoryType = string;

export interface Category { id: string; name: string; tag: string; createAt?: string; }

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  subDescription?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  categoryId?: string;
  image: string;
  galleryImages?: string[];
  colors?: { name: string; hex: string; bgClass?: string }[];
  sizes?: string[];
  tags?: string[];
  availabilityNote?: string;
  status?: 'AVAILABLE' | 'NOT_AVAILABLE' | 'Published' | 'Schedule' | 'Hidden';
  supplier?: string;
  inStock?: boolean;
  minimumOrder?: number;
  productLocation?: string;
}

export interface CartItem { id?: string; product: Product; quantity: number; selectedColor?: string; selectedSize?: string; }

export type ShippingMethod = 'Ship' | 'Flight';

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingMethod: ShippingMethod;
  date: string;
  customerName?: string | null;
  customerEmail?: string;
  items: Array<{ name: string; quantity: number; price: number; image?: string; selectedColor?: string; selectedSize?: string }>;
}

export interface DeliveryInfo { name: string; address: string; city: string; zipCode: string; mobile: string; email: string; }
