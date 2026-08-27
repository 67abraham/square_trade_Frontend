import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { CartItem, DeliveryInfo, ScreenType } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { 
  ArrowLeft, 
  Edit3,
  Lock
} from 'lucide-react';

interface CheckoutViewProps {
  cartItems: CartItem[];
  deliveryInfo: DeliveryInfo;
  onEditDelivery: () => void;
  onPlaceOrder: () => Promise<void>;
  onNavigate: (screen: ScreenType) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  deliveryInfo,
  onEditDelivery,
  onPlaceOrder,
  onNavigate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalAmount = rawSubtotal;



  const handlePlaceOrder = async () => {
    if (!cartItems.length || isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try { await onPlaceOrder(); }
    catch (error) { setSubmitError(error instanceof Error ? error.message : 'Unable to place order'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen text-[#191c1e] font-inter">
      {/* Top Header for Checkout */}
      <header className="bg-white border-b border-[#c6c6cd] py-4 px-6 md:px-12 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
          >
            <BrandLogo variant="horizontal" size="md" />
          </button>

          <motion.button
            id="checkout-back-to-cart-btn"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-2 text-[#0051d5] hover:text-[#003ea8] font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </motion.button>
        </div>
      </header>

      {/* Main Checkout Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-public-sans text-3xl font-bold text-[#191c1e]">
            Checkout
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-800">Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Review Item & Delivery Info */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Review Item And Shipping */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-[#c6c6cd] p-6 shadow-xs"
            >
              <h2 className="font-public-sans text-xl font-bold text-[#191c1e] mb-4 pb-4 border-b border-[#c6c6cd]">
                Review Item And Shipping
              </h2>

              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.id ?? item.product.id}-${item.selectedColor ?? ""}-${item.selectedSize ?? ""}`} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
                      <div className="w-20 h-20 bg-[#f2f4f6] rounded-lg p-2 flex-shrink-0 flex items-center justify-center border border-slate-200">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-sm text-[#191c1e]">
                            {item.product.name}
                          </h3>
                          {item.selectedColor && (
                            <p className="text-xs text-[#45464d] mt-1">Color: {item.selectedColor}</p>
                          )}
                          {item.selectedSize && (
                            <p className="text-xs text-[#45464d] mt-1">Size: {item.selectedSize}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-[#191c1e]">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-[#45464d] mt-1">
                            Quantity: {String(item.quantity).padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-semibold text-slate-800">Your cart is empty.</p>
                  <p className="text-xs text-slate-500 mt-1">Add a product to your cart before continuing to checkout.</p>
                  <button type="button" onClick={() => onNavigate('marketplace')} className="mt-4 inline-flex items-center justify-center rounded-md bg-[#0051d5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003ea8]">Browse Products</button>
                </div>
              )}
            </motion.section>

            {/* Delivery Information */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl border border-[#c6c6cd] p-6 shadow-xs"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#c6c6cd]">
                <h2 className="font-public-sans text-xl font-bold text-[#191c1e]">
                  Delivery Information
                </h2>
                <motion.button
                  id="edit-delivery-info-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onEditDelivery}
                  className="px-4 py-1.5 border border-[#c6c6cd] rounded-lg text-[#191c1e] text-xs font-semibold hover:bg-[#eceef0] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Information</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-[#45464d] mb-1">Name:</span>
                  <span className="text-[#191c1e] font-semibold">{deliveryInfo.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#45464d] mb-1">Address:</span>
                  <span className="text-[#191c1e] font-semibold">{deliveryInfo.address}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#45464d] mb-1">City:</span>
                  <span className="text-[#191c1e] font-semibold">{deliveryInfo.city}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#45464d] mb-1">Zip Code:</span>
                  <span className="text-[#191c1e] font-semibold">{deliveryInfo.zipCode}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#45464d] mb-1">Mobile:</span>
                  <span className="text-[#191c1e] font-semibold">{deliveryInfo.mobile}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#45464d] mb-1">Email:</span>
                  <span className="text-[#191c1e] font-semibold">{deliveryInfo.email}</span>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Order Summary & Payment Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white rounded-xl border border-[#c6c6cd] p-6 shadow-xs"
            >
              <h2 className="font-public-sans text-xl font-bold text-[#191c1e] mb-4">
                Order Summary
              </h2>

              {/* Order Method */}
              <h3 className="font-semibold text-sm text-[#191c1e] mt-4 mb-3">Order Method</h3>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                After placing the order, use the generated Order Number to contact the admin on WhatsApp. No payment gateway is used at this stage.
              </div>

              {cartItems.some(item => item.product.status === 'NOT_AVAILABLE' || item.product.inStock === false) && (
                <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  One or more items are no longer available. Remove them from your cart before placing the order.
                </div>
              )}

              {/* Pricing Totals */}
              <div className="border-t border-[#c6c6cd] pt-4 space-y-1.5 text-xs text-[#45464d]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#191c1e]">${rawSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-sm md:text-base font-bold text-[#191c1e] pt-2 border-t border-[#c6c6cd]">
                  <span>Total Amount:</span>
                  <span className="text-lg text-[#0051d5]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {submitError && (
                <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {submitError}
                </div>
              )}

              {/* Place Order CTA */}
              <motion.button
                id="place-order-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartItems.length === 0 || cartItems.some(item => item.product.status === 'NOT_AVAILABLE' || item.product.inStock === false)}
                className="w-full bg-[#0051d5] text-white hover:bg-[#003ea8] py-3 rounded-md font-semibold text-sm transition-all shadow-sm mt-5 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Place Order</span>
                )}
              </motion.button>
            </motion.section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#191c1e] text-white py-12 px-6 md:px-12 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold font-public-sans text-white">
              Square Trade Sourcing
            </div>
            <p className="text-xs text-slate-400">
              © 2026 Square Trade Sourcing. All Rights Reserved.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white mb-2 font-inter">Company</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400 font-inter">
              <button onClick={() => onNavigate('marketplace')} className="text-left hover:text-blue-400">About Us</button>
              <button onClick={() => onNavigate('marketplace')} className="text-left hover:text-blue-400">Procurement Solutions</button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white mb-2 font-inter">Legal</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400 font-inter">
              <button onClick={() => onNavigate('marketplace')} className="text-left hover:text-blue-400">Privacy Policy</button>
              <button onClick={() => onNavigate('marketplace')} className="text-left hover:text-blue-400">Terms of Service</button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white mb-2 font-inter">Support</h4>
            <div className="flex flex-col gap-2 text-xs text-slate-400 font-inter">
              <button onClick={() => onNavigate('orders')} className="text-left hover:text-blue-400">Order Tracking</button>
              <button onClick={() => onNavigate('marketplace')} className="text-left hover:text-blue-400">Help Center</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
