import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { ScreenType } from '../types';
import { screenToPath } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { TopNav } from '../components/TopNav';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

export const ShopLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    userRole
  } = useAppContext();

  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);
  const cartCount = cartItems.length;

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav
        currentScreen="marketplace"
        onNavigate={onNavigate}
        cartCount={cartCount}
        onOpenCart={openCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <Outlet />
      </div>

      <Footer onNavigate={onNavigate} />
      <MobileBottomNav currentScreen="marketplace" onNavigate={onNavigate} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={() => {
          closeCart();
          navigate('/checkout');
        }}
      />
    </div>
  );
};
