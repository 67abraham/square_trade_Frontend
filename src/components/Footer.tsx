import React from 'react';
import { BrandLogo } from './BrandLogo';
import type { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#191c1e] text-white py-12 px-6 md:px-12 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo variant="horizontal" theme="dark" size="md" />
          </div>
          <p className="text-slate-400 text-sm font-inter leading-relaxed">
            A focused B2B marketplace for sourcing products and managing orders.
          </p>

        </div>

        <div>
          <h4 className="font-inter font-semibold text-sm text-white mb-4 uppercase tracking-wider">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400 font-inter">

            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-blue-400 transition-colors">
                Marketplace
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-inter font-semibold text-sm text-white mb-4 uppercase tracking-wider">
            Solutions
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400 font-inter">
            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-blue-400 transition-colors">
                Procurement Marketplace
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-blue-400 transition-colors">
                Order Tracking
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-blue-400 transition-colors">
                Browse Catalog
              </button>
            </li>

          </ul>
        </div>

        <div>
          <h4 className="font-inter font-semibold text-sm text-white mb-4 uppercase tracking-wider">
            Support
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400 font-inter">
            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-blue-400 transition-colors">
                Help Center
              </button>
            </li>

            <li>
              <button onClick={() => onNavigate('auth-login')} className="hover:text-blue-400 transition-colors">
                Account Security
              </button>
            </li>
            <li>
              <span className="text-xs text-slate-500 block pt-1">
                24/7 Global Desk: support@squaretrade.com
              </span>
            </li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-4 mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-inter gap-4">
          <p>© 2026 Square Trade Sourcing. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Secure session cookies</span>
            <span>Order tracking</span>
            <span>WhatsApp support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
