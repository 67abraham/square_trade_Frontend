import { api } from './client';
import type { Category, Product } from '../../types';

interface BackendProduct {
  id: string;
  name: string;
  brand?: string | null;
  tags?: string[];
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }> | null;
  categoryId: string;
  imageUrl: string[];
  price: number;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  description: unknown;
  minimumOrder: number;
  productLocation: string;
  createAt: string;
  category?: { id: string; name: string; tag: string };
}

interface ProductResponse {
  getAllProd: BackendProduct[];
  totalPage: number;
  skip: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const descriptionToText = (description: unknown): string => {
  if (typeof description === 'string') return description;
  if (description && typeof description === 'object') {
    const value = description as Record<string, unknown>;
    if (typeof value.text === 'string') return value.text;
    if (typeof value.description === 'string') return value.description;
    return Object.values(value).filter(value => typeof value === 'string').join(' ');
  }
  return '';
};

const toProduct = (product: BackendProduct): Product => ({
  id: product.id,
  name: product.name,
  brand: product.brand ?? '',
  description: descriptionToText(product.description),
  price: product.price,
  rating: 0,
  reviewsCount: 0,
  category: product.category?.name ?? 'Uncategorized',
  categoryId: product.categoryId,
  tags: product.tags ?? [],
  sizes: product.sizes ?? [],
  colors: product.colors ?? [],
  image: product.imageUrl?.[0] ?? '',
  galleryImages: product.imageUrl ?? [],
  minimumOrder: product.minimumOrder,
  productLocation: product.productLocation,
  status: product.status,
  inStock: product.status === 'AVAILABLE',
});

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export const getProducts = async (params: ProductQuery = {}) => {
  const { data } = await api.get<ProductResponse>('/product', { params });
  return {
    products: data.getAllProd.map(toProduct),
    totalPage: data.totalPage,
    hasNextPage: data.hasNextPage,
    hasPrevPage: data.hasPrevPage,
  };
};

export const getProduct = async (id: string) => {
  const { data } = await api.get<BackendProduct>(`/product/${id}`);
  return toProduct(data);
};

export const getCategories = async () => {
  const { data } = await api.get<Category[]>('/category');
  return data;
};
