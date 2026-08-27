import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ScreenType } from '../types';
import { screenToPath } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { CreateProductView } from '../views/CreateProductView';
import { createProduct, generateProductDescription } from '../lib/api/admin';
import { api } from '../lib/api/client';
import { authClient } from '../lib/auth-client';

const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('Unable to read image'));
  reader.readAsDataURL(file);
});

export const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, categories, refreshProducts } = useAppContext();
  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);

  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== 'ADMIN') return <Navigate to="/" replace />;

  const uploadImage = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) throw new Error('Only JPEG, PNG, WebP and GIF images are allowed');
    if (file.size > 5 * 1024 * 1024) throw new Error('Each image must be 5MB or smaller');
    const data = await fileToDataUrl(file);
    const response = await api.post<{ url: string }>('/product/upload-image', { fileName: file.name, contentType: file.type, data });
    return response.data.url;
  };

  return <CreateProductView
    user={session.user}
    onLogout={async () => { await authClient.signOut(); navigate('/login'); }}
    categories={categories}
    onUploadImage={uploadImage}
    onGenerateDescription={generateProductDescription}
    onAddProduct={async product => {
      await createProduct({
        name: product.name,
        brand: product.brand,
        tags: product.tags,
        sizes: product.sizes,
        colors: product.colors,
        categoryId: product.categoryId!,
        imageUrl: product.galleryImages ?? [product.image],
        price: product.price,
        productLocation: product.productLocation ?? '',
        minimumOrder: product.minimumOrder ?? 1,
        description: product.description,
        status: product.status === 'NOT_AVAILABLE' ? 'NOT_AVAILABLE' : 'AVAILABLE',
      });
      await refreshProducts();
    }}
    onNavigate={onNavigate}
  />;
};
