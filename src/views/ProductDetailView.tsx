import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ScreenType } from '../types';
import { 
  ChevronRight, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void | Promise<void>;
  onBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void | Promise<void>;
  onNavigate: (screen: ScreenType) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onNavigate
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const minimumOrder = product.minimumOrder ?? 1;
  const [quantity, setQuantity] = useState(minimumOrder);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAddedNotice, setShowAddedNotice] = useState(false);
  const [actionLoading, setActionLoading] = useState<'cart' | 'buy' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Gallery items fallback
  const gallery = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  const colors = product.colors ?? [];

  const activeImage = gallery[selectedImageIndex] || product.image;
  const activeColor = colors[selectedColorIndex]?.name || undefined;
  const isAvailable = product.status === 'AVAILABLE' || product.status === undefined;

  const handleAddToCart = async () => {
    if (actionLoading || !isAvailable) return;
    setActionError(null);
    setActionLoading('cart');
    try {
      await onAddToCart(product, quantity, activeColor, selectedSize || undefined);
      setShowAddedNotice(true);
      window.setTimeout(() => setShowAddedNotice(false), 2200);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to add this product to your cart');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyNow = async () => {
    if (actionLoading || !isAvailable) return;
    setActionError(null);
    setActionLoading('buy');
    try {
      await onBuyNow(product, quantity, activeColor, selectedSize || undefined);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to continue to checkout');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-8 font-inter">
      <button type="button" onClick={() => onNavigate('marketplace')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0051d5] hover:underline">← Back</button>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm text-[#45464d] mb-6">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <button
              onClick={() => onNavigate('marketplace')}
              className="hover:text-[#0051d5] transition-colors cursor-pointer"
            >
              Marketplace
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
            <button
              onClick={() => onNavigate('marketplace')}
              className="hover:text-[#0051d5] transition-colors cursor-pointer"
            >
              {product.category || 'Uncategorized'}
            </button>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
            <span className="text-[#191c1e] font-semibold">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Product View Container */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column: Product Gallery */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4">
          {/* Main Hero Image */}
          <div className="bg-white border border-[#c6c6cd] rounded-xl p-8 flex items-center justify-center h-[340px] md:h-[520px] relative overflow-hidden shadow-xs group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                src={activeImage}
                alt={`${product.name} view ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 bg-white p-2.5 rounded-full border border-[#c6c6cd] shadow-xs hover:text-[#0051d5] transition-all"
              title={isFavorite ? "Saved to Favorites" : "Save to Favorites"}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 stroke-red-500 text-red-500' : 'text-[#76777d]'
                }`}
              />
            </motion.button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {gallery.map((imgUrl, idx) => {
              const isSelected = selectedImageIndex === idx;
              return (
                <motion.button
                  key={idx}
                  id={`thumbnail-btn-${idx}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-lg p-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-2 border-[#0051d5] shadow-xs scale-95'
                      : 'border border-[#c6c6cd] hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="max-h-full object-contain"
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Product Details & Controls */}
        <div className="w-full lg:w-5/12 flex flex-col pt-2 lg:pt-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-[#0051d5] border border-blue-200">{product.status === 'AVAILABLE' ? 'Available' : 'Not available'}</span>
            <span className="text-xs text-slate-500">Product ID: {product.id}</span>
          </div>

          <h1 className="font-public-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#191c1e] mb-2">
            {product.name}
          </h1>

          <p className="text-[#45464d] text-sm md:text-base leading-relaxed mb-4">
            {product.description}
          </p>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-500">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300 text-slate-300'}`} />)}</div>
              <span className="text-xs md:text-sm text-[#45464d] font-medium">({product.reviewsCount} Reviews)</span>
            </div>
          )}

          {/* Price Header */}
          <div className="border-t border-b border-[#c6c6cd]/80 py-4 mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-public-sans text-3xl font-bold text-[#191c1e]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#76777d] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm text-[#191c1e]">Choose a Size: <span className="text-[#0051d5] font-bold">{selectedSize || 'Select'}</span></h3></div>
              <div className="flex flex-wrap gap-2">{product.sizes.map(size => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${selectedSize === size ? 'border-[#0051d5] bg-blue-50 text-[#0051d5]' : 'border-[#c6c6cd] text-[#45464d] hover:border-[#0051d5]'}`}>{size}</button>)}</div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm text-[#191c1e]">Choose a Color: <span className="text-[#0051d5] font-bold">{activeColor ?? 'Select'}</span></h3></div>
              <div className="flex gap-3 items-center">{colors.map((c, idx) => <motion.button key={c.name} type="button" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedColorIndex(idx)} aria-label={c.name} className={`w-10 h-10 rounded-full flex items-center justify-center p-0.5 transition-all relative ${selectedColorIndex === idx ? 'ring-2 ring-[#0051d5] ring-offset-2 scale-105' : 'hover:ring-1 hover:ring-slate-300'}`}><span className="block w-full h-full rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: c.hex }} /></motion.button>)}</div>
            </div>
          )}

          {actionError && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{actionError}</div>}

          {/* Quantity & Buy / Add to Cart Actions */}
          <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#191c1e] mb-2">Quantity</label>
              <div className="flex items-center border border-[#c6c6cd] rounded-md bg-white h-12 shadow-xs">
                <motion.button
                  id="qty-decrement-btn"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(Math.max(minimumOrder, quantity - 1))}
                  className="px-3.5 py-2 text-[#45464d] hover:text-[#0051d5] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <input
                  id="qty-input"
                  className="w-10 text-center text-sm font-semibold border-none focus:ring-0 bg-transparent p-0"
                  type="text"
                  readOnly
                  value={quantity}
                />
                <motion.button
                  id="qty-increment-btn"
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-[#45464d] hover:text-[#0051d5] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex-grow flex gap-3">
              <motion.button
                id="pdp-buy-now-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={!isAvailable || !!actionLoading}
                className="flex-1 bg-[#0051d5] text-white hover:bg-[#003ea8] font-semibold text-sm h-12 rounded-md transition-all shadow-xs flex items-center justify-center"
              >
                {!isAvailable ? 'Unavailable' : actionLoading === 'buy' ? 'Opening Checkout…' : 'Buy Now'}
              </motion.button>

              <motion.button
                id="pdp-add-to-cart-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!isAvailable || !!actionLoading}
                className={`flex-1 border font-semibold text-sm h-12 rounded-md transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  showAddedNotice
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-[#c6c6cd] text-[#191c1e] hover:border-[#0051d5] hover:text-[#0051d5] hover:bg-slate-50 disabled:opacity-50'
                }`}
              >
                {actionLoading === 'cart' ? <span>Adding…</span> : showAddedNotice ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </motion.div>
                ) : (
                  <span>Add to Cart</span>
                )}
              </motion.button>
            </div>
          </div>

          <div className="border border-[#c6c6cd] rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="p-4 flex gap-4 border-b border-[#c6c6cd] items-start">
              <Truck className="w-5 h-5 text-[#0051d5] mt-0.5 flex-shrink-0" />
              <div><h4 className="font-semibold text-sm text-[#191c1e] mb-1">Product Location</h4><p className="text-xs text-[#45464d]">{product.productLocation || 'Location not specified'}</p></div>
            </div>
            <div className="p-4 flex gap-4 items-start">
              <RotateCcw className="w-5 h-5 text-[#0051d5] mt-0.5 flex-shrink-0" />
              <div><h4 className="font-semibold text-sm text-[#191c1e] mb-1">Minimum Order</h4><p className="text-xs text-[#45464d]">{product.minimumOrder ?? 1} unit{(product.minimumOrder ?? 1) === 1 ? '' : 's'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
