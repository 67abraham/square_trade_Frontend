import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Product, ScreenType } from '../types';
import { screenToPath } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { getProduct } from '../lib/api/catalog';
import { ProductDetailView } from '../views/ProductDetailView';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useAppContext();
  const [product, setProduct] = useState<Product | null>(() => products.find(p => p.id === id) ?? null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = products.find(p => p.id === id);
    if (existing) { setProduct(existing); setLoading(false); return; }
    setLoading(true);
    void getProduct(id).then(setProduct).catch(err => setError(err instanceof Error ? err.message : 'Product not found')).finally(() => setLoading(false));
  }, [id, products]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-slate-500">Loading product…</div>;
  if (error || !product) return <Navigate to="/" replace />;

  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);
  return <ProductDetailView product={product} onAddToCart={(p, quantity, color, size) => addToCart(p, quantity, color, size)} onBuyNow={async (p, quantity, color, size) => { await addToCart(p, quantity, color, size); navigate('/checkout'); }} onNavigate={onNavigate} />;
};
