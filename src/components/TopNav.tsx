import React from 'react';
import type { ScreenType } from '../types';
import { BrandLogo } from './BrandLogo';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Bell
} from 'lucide-react';

interface TopNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userRole: 'admin' | 'buyer' | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  userRole
}) => {
  return (
    <>
      {/* Top Navigation (Desktop) */}
      <header className="hidden md:flex bg-white sticky top-0 border-b border-[#c6c6cd]/50 shadow-xs justify-between items-center w-full px-6 lg:px-12 py-3.5 z-40">
        <div className="flex items-center gap-8 max-w-7xl w-full mx-auto justify-between">
          <div className="flex items-center gap-8">
            <button
              id="desktop-nav-logo"
              onClick={() => onNavigate('marketplace')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <BrandLogo variant="horizontal" size="md" />
            </button>

            <nav className="flex items-center gap-2 lg:gap-4">
              <button
                id="nav-marketplace"
                onClick={() => onNavigate('marketplace')}
                className={`font-semibold px-3 py-2 rounded-md font-inter text-sm transition-colors ${
                  currentScreen === 'marketplace'
                    ? 'text-[#0051d5] font-bold border-b-2 border-[#0051d5] rounded-b-none'
                    : 'text-[#45464d] hover:text-[#0051d5]'
                }`}
              >
                Marketplace
              </button>
              
              <button
                id="nav-logistics"
                onClick={() => onNavigate('orders')}
                className="text-[#45464d] hover:text-[#0051d5] hover:bg-[#eceef0]/60 transition-colors px-3 py-2 rounded-md font-inter font-semibold text-sm"
              >
                Orders
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]" />
              <input
                id="desktop-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#f2f4f6] border border-[#c6c6cd] rounded-full text-sm font-inter focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5] w-56 xl:w-64 transition-all"
                placeholder="Search Product..."
                type="text"
              />
            </div>

            <button
              id="desktop-cart-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 text-[#45464d] hover:text-[#0051d5] transition-colors p-2 rounded-lg relative hover:bg-[#f2f4f6]"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden xl:inline font-inter font-semibold text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0051d5] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="desktop-account-btn"
              onClick={() => onNavigate(userRole ? 'orders' : 'auth-login')}
              className="flex items-center gap-2 text-[#45464d] hover:text-[#0051d5] transition-colors p-2 rounded-lg hover:bg-[#f2f4f6]"
              title={userRole ? 'My Orders' : 'Sign in'}
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline font-inter font-semibold text-sm">{userRole ? 'My Orders' : 'Account'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 bg-white z-40 px-4 py-3 border-b border-[#c6c6cd]/40 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <button 
            id="mobile-logo-btn"
            onClick={() => onNavigate('marketplace')} 
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <BrandLogo variant="horizontal" size="sm" showSubtitle={false} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              id="mobile-cart-btn"
              onClick={onOpenCart} 
              className="p-2 text-[#45464d] relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#0051d5] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              id="mobile-notifications-btn"
              onClick={() => onNavigate('orders')}
              className="p-2 text-[#45464d]"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" />
          <input
            id="mobile-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c6c6cd]/60 rounded-lg text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#0051d5]"
            placeholder="Search products..."
            type="text"
          />
        </div>
      </div>
    </>
  );
};
