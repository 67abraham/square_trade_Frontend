import { api } from './client';
import type { ShippingMethod } from '../../types';

export type BackendOrder = {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingMethod: ShippingMethod;
  createAt: string;
  user?: { name?: string | null; email: string };
  item: Array<{
    id: string;
    quantity: number;
    unitPrice?: number | null;
    selectedColor?: string | null;
    selectedSize?: string | null;
    product: { name: string; imageUrl: string[]; price: number; productLocation: string };
  }>;
};

export const getOrders = async (page = 1, limit = 20) => {
  const { data } = await api.get<{ getO: BackendOrder[]; totalPage: number }>('/order', {
    params: { page, limit },
  });
  return data;
};

export const createOrder = async (cartID: string[], shippingMethod: ShippingMethod) => {
  const { data } = await api.post<{ order: BackendOrder; message: string }>('/order/create', {
    cartID,
    shippingMethod,
  });
  return data.order;
};

export const updateOrderStatus = async (
  id: string,
  status: BackendOrder['status'],
) => {
  const { data } = await api.put(`/order/${id}/status`, undefined, { params: { status } });
  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await api.get<{ order: BackendOrder }>(`/order/${id}`);
  return data.order;
};
