import React from 'react';
import type { ScreenType } from '../types';
import { Home, Search, PackageCheck, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-[#c6c6cd] rounded-t-xl shadow-lg flex justify-around items-center px-3 py-2 pb-3">
      {/* Home */}
      <button
        id="mobile-nav-home"
        onClick={() => onNavigate('marketplace')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
          currentScreen === 'marketplace'
            ? 'text-[#0051d5] font-semibold'
            : 'text-[#45464d] hover:bg-[#eceef0]'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-xs font-inter">Home</span>
      </button>

      {/* Search / Marketplace Details */}
      <button
        id="mobile-nav-search"
        onClick={() => onNavigate('marketplace')}
        className={`flex flex-col items-center justify-center transition-all ${
          currentScreen === 'marketplace' || currentScreen === 'product-detail'
            ? 'bg-[#316bf3] text-white rounded-full px-4 py-1 shadow-xs scale-100'
            : 'text-[#45464d] hover:bg-[#eceef0] p-1.5 rounded-lg'
        }`}
      >
        <Search className="w-4 h-4 mb-0.5" />
        <span className="text-xs font-inter font-medium">Search</span>
      </button>

      {/* Orders */}
      <button
        id="mobile-nav-orders"
        onClick={() => onNavigate('orders')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
          currentScreen === 'orders'
            ? 'text-[#0051d5] font-semibold'
            : 'text-[#45464d] hover:bg-[#eceef0]'
        }`}
      >
        <PackageCheck className="w-5 h-5 mb-0.5" />
        <span className="text-xs font-inter">Orders</span>
      </button>

      {/* Profile / Auth */}
      <button
        id="mobile-nav-profile"
        onClick={() => onNavigate('auth-login')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
          currentScreen === 'auth-login'
            ? 'text-[#0051d5] font-semibold'
            : 'text-[#45464d] hover:bg-[#eceef0]'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-xs font-inter">Profile</span>
      </button>
    </nav>
  );
};
