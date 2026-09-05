import { api } from './client';

export interface CreateProductPayload {
  name: string;
  brand?: string | null;
  tags?: string[];
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }>;
  categoryId: string;
  imageUrl: string[];
  price: number;
  productLocation: string;
  minimumOrder: number;
  description: string;
  status?: 'AVAILABLE' | 'NOT_AVAILABLE';
}

export const createProduct = async (payload: CreateProductPayload) => {
  const { data } = await api.post('/product/create', payload);
  return data;
};

export const updateProduct = async (id: string, payload: CreateProductPayload) => {
  const { data } = await api.put(`/product/update/${id}`, payload);
  return data;
};
export const updateProductStatus = async (id: string, payload: CreateProductPayload) => {
  const { data } = await api.put(`/product/updateStatus/${id}`, {status: payload.status});
  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/product/del/${id}`);
  return data;
};

export const generateProductDescription = async (input: {
  name: string;
  brand?: string;
  category?: string;
  specifications?: string;
  imageUrl?: string;
}) => {
  const { data } = await api.post<{ description: string }>('/product/generate-description', input);
  return data.description;
};
