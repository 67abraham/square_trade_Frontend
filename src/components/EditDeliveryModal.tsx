import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { DeliveryInfo } from '../types';
import { X, MapPin, Check } from 'lucide-react';

interface EditDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInfo: DeliveryInfo;
  onSave: (info: DeliveryInfo) => Promise<void>;
}

export const EditDeliveryModal: React.FC<EditDeliveryModalProps> = ({
  isOpen,
  onClose,
  currentInfo,
  onSave
}) => {
  const [formData, setFormData] = useState<DeliveryInfo>(currentInfo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setFormData(currentInfo);
  }, [currentInfo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setSaving(true);
    try { await onSave(formData); onClose(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to save delivery information'); }
    finally { setSaving(false); }
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 z-10"
          >
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0051d5]" />
                <h3 className="font-public-sans font-bold text-lg text-slate-900">
                  Edit Delivery Information
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-inter text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Zip / Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                  />
                </div>
              </div>

              {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-lg font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  {saving ? 'Saving…' : 'Save Delivery Details'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
