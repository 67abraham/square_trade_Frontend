import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { ScreenType } from '../types';
import { CheckCircle2, ArrowRight, Package, MessageCircle } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  totalAmount: number;
  onNavigate: (screen: ScreenType) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderId,
  totalAmount,
  onNavigate
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
              className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <h3 className="font-public-sans font-bold text-2xl text-slate-900 mb-1">
              Order Placed Successfully!
            </h3>
            <p className="text-slate-500 font-inter text-sm mb-6">
              Your order has been created and is ready for admin confirmation.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 text-left space-y-2 text-sm font-inter">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-bold text-[#0051d5]">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Total:</span>
                <span className="font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Status:</span>
                <span className="text-teal-600 font-semibold">Pending confirmation</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER && (
                <a
                  href={`https://wa.me/${String(import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER).replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I want to confirm Order ${orderId}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-inter font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order Number on WhatsApp</span>
                </a>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onNavigate('orders');
                }}
                className="w-full bg-[#0051d5] hover:bg-[#003ea8] text-white py-2.5 px-4 rounded-lg font-inter font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Package className="w-4 h-4" />
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onNavigate('marketplace');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg font-inter font-medium text-sm transition-colors"
              >
                Continue Shopping
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
