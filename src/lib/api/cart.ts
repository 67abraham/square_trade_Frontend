import { api } from './client';
import type { Product } from '../../types';

interface BackendCartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  product: {
    id?: string;
    name: string;
    imageUrl: string[];
    price: number;
    description: unknown;
    brand?: string | null;
    tags?: string[];
    sizes?: string[];
    colors?: Array<{ name: string; hex: string }> | null;
    minimumOrder?: number;
    productLocation?: string;
    status?: 'AVAILABLE' | 'NOT_AVAILABLE';
    category?: { name: string };
  };
}

const descriptionToText = (description: unknown): string => {
  if (typeof description === 'string') return description;
  if (description && typeof description === 'object') {
    const values = Object.values(description as Record<string, unknown>);
    return values.filter((v): v is string => typeof v === 'string').join(' ');
  }
  return '';
};

const toProduct = (item: BackendCartItem): Product => ({
  id: item.productId,
  name: item.product.name,
  brand: item.product.brand ?? '',
  description: descriptionToText(item.product.description),
  price: item.product.price,
  rating: 0,
  reviewsCount: 0,
  category: item.product.category?.name ?? 'Uncategorized',
  image: item.product.imageUrl?.[0] ?? '',
  galleryImages: item.product.imageUrl ?? [],
  tags: item.product.tags ?? [],
  sizes: item.product.sizes ?? [],
  colors: item.product.colors ?? [],
  minimumOrder: item.product.minimumOrder ?? 1,
  productLocation: item.product.productLocation ?? '',
  status: item.product.status,
  inStock: item.product.status === 'AVAILABLE',
});

export interface BackendBillingInfo {
  id: string;
  userId: string;
  fullName: string;
  city: string;
  county: string;
  currentAddress: string;
  contact: string;
  country: string;
  zipCode?: string | null;
}

export interface CartResponse {
  getAllCart: BackendCartItem[];
  totalPrice: number;
  billingAddress?: BackendBillingInfo[];
}

export const getCart = async () => {
  const { data } = await api.get<CartResponse>('/cartItem', { params: { page: 1, limit: 100 } });
  return {
    items: data.getAllCart.map(item => ({
      id: item.id,
      product: toProduct(item),
      quantity: item.quantity,
      selectedColor: item.selectedColor ?? undefined,
      selectedSize: item.selectedSize ?? undefined,
    })),
    billingAddress: data.billingAddress?.[0],
  };
};

export const createCartItem = async (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
  const { data } = await api.post('/cartItem/create', { productId, quantity, selectedColor, selectedSize });
  return data;
};

export const deleteCartItem = async (id: string) => {
  await api.delete('/cartItem/del', { data: { id } });
};

export const updateCartItem = async (id: string, quantity: number, signal?: AbortSignal) => {
  const { data } = await api.put(`/cartItem/${id}`, { quantity }, { signal });
  return data;
};
