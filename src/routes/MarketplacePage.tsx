import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, ScreenType } from '../types';
import { screenToPath, productPath } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { MarketplaceView } from '../views/MarketplaceView';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, addToCart, searchQuery } = useAppContext();

  const onSelectProduct = (product: Product) => navigate(productPath(product.id));
  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);

  return (
    <MarketplaceView
      products={products}
      categories={categories}
      onSelectProduct={onSelectProduct}
      onAddToCart={product => addToCart(product, 1)}
      onNavigate={onNavigate}
      searchQuery={searchQuery}
    />
  );
};
