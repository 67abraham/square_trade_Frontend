import { api } from './client';

export type BackendOrder = {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingMethod: string;
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

export const createOrder = async (cartID: string[], shippingMethod = 'WHATSAPP') => {
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
