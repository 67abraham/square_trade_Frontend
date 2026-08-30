import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type{ CartItem } from '../types';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (item: CartItem, delta: number) => void;
  onRemoveItem: (item: CartItem) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalCount = cartItems.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0051d5]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-public-sans font-bold text-lg text-slate-900 leading-none">
                      Procurement Cart
                    </h2>
                    <p className="text-xs text-slate-500 font-inter mt-0.5">
                      {totalCount} {totalCount === 1 ? 'item' : 'items'} ready for sourcing
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 min-h-[300px]"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 stroke-1 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-700 text-base">Your cart is empty</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs">
                      Review products and add items to your procurement cart.
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={`${item.id ?? item.product.id}-${item.selectedColor ?? ''}-${item.selectedSize ?? ''}`}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.22 }}
                        className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex gap-3.5 items-start hover:border-slate-300 transition-colors shadow-2xs"
                      >
                        <div className="w-18 h-18 bg-white rounded-lg p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="max-h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-semibold text-slate-900 truncate font-inter">
                              {item.product.name}
                            </h3>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => onRemoveItem(item)}
                              className="text-slate-400 hover:text-red-500 p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          {item.selectedColor && (
                            <p className="text-xs text-slate-500 mt-0.5 font-inter">
                              Color: <span className="text-slate-700 font-medium">{item.selectedColor}</span>
                            </p>
                          )}
                          {item.selectedSize && (
                            <p className="text-xs text-slate-500 mt-0.5 font-inter">
                              Size: <span className="text-slate-700 font-medium">{item.selectedSize}</span>
                            </p>
                          )}
                          {item.product.status === 'NOT_AVAILABLE' && (
                            <p className="text-xs font-semibold text-red-600 mt-1">No longer available — remove this item before checkout.</p>
                          )}
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center border border-slate-300 rounded-md bg-white shadow-2xs">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => onUpdateQuantity(item, -1)} disabled={item.product.status === 'NOT_AVAILABLE'}
                                className="px-2 py-1 text-slate-500 hover:text-slate-800"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                              <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => onUpdateQuantity(item, 1)} disabled={item.product.status === 'NOT_AVAILABLE'}
                                className="px-2 py-1 text-slate-500 hover:text-slate-800"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                            <span className="font-bold text-slate-900 font-inter text-sm">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer & Checkout CTA */}
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 border-t border-slate-200 bg-slate-50 space-y-4"
                >
                  <div className="space-y-1.5 text-sm font-inter">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Due</span>
                      <span className="text-lg text-[#0051d5]">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {cartItems.some(item => item.product.status === 'NOT_AVAILABLE' || item.product.inStock === false) && (
                    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      Remove unavailable items before checkout.
                    </div>
                  )}
                  <motion.button
                    id="cart-proceed-to-checkout"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={cartItems.some(item => item.product.status === 'NOT_AVAILABLE' || item.product.inStock === false)}
                    onClick={() => {
                      onClose();
                      onProceedToCheckout();
                    }}
                    className="w-full bg-[#0051d5] hover:bg-[#003ea8] text-white py-3 px-4 rounded-lg font-inter font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
