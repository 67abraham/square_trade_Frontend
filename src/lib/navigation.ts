import type { ScreenType } from '../types';

export const screenToPath: Record<ScreenType, string> = {
  marketplace: '/',
  'product-detail': '/',
  checkout: '/checkout',
  orders: '/orders',
  'admin-dashboard': '/admin',
  'admin-all-products': '/admin/all_products',
  'admin-create-product': '/admin/create-product',
  'auth-login': '/login',
};

export const productPath = (productId: string) => `/product/${productId}`;
