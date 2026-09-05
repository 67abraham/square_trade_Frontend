import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, CategoryType } from '../types';
import { Pagination } from '../components/Pagination';
import { 
  Headphones, 
  Laptop, 
  Armchair, 
  Activity, 
  SlidersHorizontal, 
  ChevronDown, 
  Heart,
  ShoppingCart,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';

interface MarketplaceViewProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => Promise<void>;
  searchQuery: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  categories,
  onSelectProduct,
  onAddToCart,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100' | '100to300' | 'above300'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceLow' | 'priceHigh'>('featured');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [cartError, setCartError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const productListRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceFilter, sortBy, searchQuery]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (productListRef.current) {
      productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const popularCategories = categories.slice(0, 4).map(category => {
    const name = category.name as CategoryType;
    const iconClass = 'w-6 h-6 md:w-8 md:h-8 text-[#0051d5]';
    const icon = /audio|headphone|sound/i.test(name)
      ? <Headphones className={iconClass} />
      : /laptop|computer/i.test(name)
        ? <Laptop className={iconClass} />
        : /furniture|chair|home/i.test(name)
          ? <Armchair className={iconClass} />
          : /sport|fitness/i.test(name)
            ? <Activity className={iconClass} />
            : <ShoppingCart className={iconClass} />;
    return { ...category, icon };
  });

  const featuredProduct = products[0];

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartError(null);
    try {
      await onAddToCart(product);
      setAddedMap(prev => ({ ...prev, [product.id]: true }));
      window.setTimeout(() => {
        setAddedMap(prev => ({ ...prev, [product.id]: false }));
      }, 1500);
    } catch (error) {
      setCartError(error instanceof Error ? error.message : 'Unable to add the product to your cart');
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subDescription && item.subDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    let matchesPrice = true;
    if (priceFilter === 'under100') matchesPrice = item.price < 100;
    if (priceFilter === '100to300') matchesPrice = item.price >= 100 && item.price <= 300;
    if (priceFilter === 'above300') matchesPrice = item.price > 300;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    return 0;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-8 font-inter">
      {cartError && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{cartError}</div>}
      {/* Hero Section */}
      <section className="mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#131b2e] text-white rounded-2xl overflow-hidden relative min-h-[220px] md:min-h-[380px] flex items-center shadow-lg"
        >
          <div className="relative z-10 p-6 md:p-12 md:w-3/5 lg:w-1/2">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Featured Product
            </motion.span>
            <h1 className="font-public-sans text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
              {featuredProduct ? `Featured: ${featuredProduct.name}` : 'Browse products available for your next order'}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mb-6 max-w-md hidden sm:block">
              Live catalog products from the backend, with search, category filters, pricing and availability.
            </p>
            {featuredProduct && <div className="flex items-center gap-3">
              <motion.button id="hero-buy-now-btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => onSelectProduct(featuredProduct)} className="bg-[#0051d5] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all shadow-md">Buy Now</motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => onAddToCart(featuredProduct)} className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-3 rounded-lg text-sm transition-all backdrop-blur-xs border border-white/20">Add Featured Product to Cart</motion.button>
            </div>}
          </div>

          {/* Abstract gradient lighting effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#131b2e] via-[#1a2542] to-[#316bf3]/80 opacity-90 z-0"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent z-0 pointer-events-none"></div>

          {featuredProduct?.image && (
            <div className="absolute right-6 lg:right-16 top-1/2 -translate-y-1/2 hidden md:block z-5 opacity-90">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.06, rotate: 2 }} transition={{ duration: 0.4 }}
                src={featuredProduct.image} alt={featuredProduct.name} className="w-64 lg:w-80 h-64 object-contain drop-shadow-2xl cursor-pointer" onClick={() => onSelectProduct(featuredProduct)}
              />
            </div>
          )}
        </motion.div>
      </section>

      {/* Popular Categories */}
      <section className="mb-8 md:mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-public-sans text-xl md:text-2xl font-bold text-[#191c1e]">
            Popular Categories
          </h2>
          {selectedCategory !== 'All' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-[#0051d5] font-semibold hover:underline"
            >
              Reset to All ({products.length})
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 md:gap-6 text-center">
          {popularCategories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <motion.button
                key={cat.name}
                id={`category-btn-${cat.name.toLowerCase()}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                className={`flex flex-col items-center gap-2 group p-2 md:p-3 rounded-xl transition-all ${
                  isSelected ? 'bg-blue-50 ring-2 ring-[#0051d5]' : 'hover:bg-[#eceef0]/60'
                }`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                  isSelected ? 'bg-[#316bf3] text-white shadow-md' : 'bg-[#eceef0] text-[#0051d5]'
                }`}>
                  {React.cloneElement(cat.icon as React.ReactElement<{ className?: string }>, {
                    className: isSelected ? 'w-6 h-6 md:w-7 md:h-7 text-white' : 'w-6 h-6 md:w-7 md:h-7 text-[#FA9D1B]'
                  })}
                </div>
                <span className={`text-xs md:text-sm font-medium ${
                  isSelected ? 'text-[#0051d5] font-bold' : 'text-[#45464d]'
                }`}>
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Filters (Desktop Bar) */}
      <section className="hidden md:flex items-center gap-3 mb-8 flex-wrap">
        <div className="relative">
          <select
            value={priceFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriceFilter(e.target.value as typeof priceFilter)} //check here
            className="px-4 py-2 border border-[#c6c6cd] rounded-full text-sm font-semibold text-[#191c1e] hover:bg-[#f2f4f6] bg-transparent appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
          >
            <option value="all">Price: All</option>
            <option value="under100">Under $10</option>
            <option value="100to300">$10 - $50</option>
            <option value="above300">Above $50</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] pointer-events-none" />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setSelectedCategory('All'); setPriceFilter('all'); setSortBy('featured'); }}
          className="px-4 py-2 border border-[#c6c6cd] rounded-full text-sm font-semibold flex items-center gap-2 transition-colors hover:bg-[#f2f4f6]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </motion.button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-[#c6c6cd] rounded-full text-xs font-semibold text-[#191c1e] bg-white focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
          >
            <option value="featured">Featured Sourcing</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Product Listing */}
      <section ref={productListRef}>
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <h2 className="font-public-sans text-xl md:text-2xl font-bold text-[#191c1e]">
              {selectedCategory === 'All' ? 'Products For You!' : `${selectedCategory} Sourcing For You!`}
            </h2>
            <p className="text-xs md:text-sm text-[#76777d] mt-0.5">
              {filteredProducts.length === 0
                ? 'No matching products found'
                : `Showing ${filteredProducts.length} catalog products`}
            </p>
          </div>
        </div>

        {/* Empty state if 0 results */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No products match your criteria</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Try adjusting your category, price range, or search term to discover available products.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setPriceFilter('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0051d5] text-white rounded-lg text-xs font-semibold hover:bg-[#003ea8] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Product Cards Grid / Vertical List */}
            <motion.div layout className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((product, idx) => {
                    const isLiked = !!likedMap[product.id];
                    const isJustAdded = !!addedMap[product.id];

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.25) }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        key={product.id}
                        id={`product-card-${product.id}`}
                        onClick={() => onSelectProduct(product)}
                        className="group flex bg-white border border-[#c6c6cd]/80 rounded-xl overflow-hidden p-3 md:flex-col md:p-4 hover:shadow-lg hover:border-[#0051d5]/50 transition-all cursor-pointer relative"
                      >
                        {/* Product Image Box */}
                        <div className="w-24 h-24 md:w-full md:h-48 bg-[#f2f4f6] rounded-lg flex-shrink-0 flex items-center justify-center relative p-2 overflow-hidden">
                          <div className="w-16 h-16 md:w-28 md:h-28 bg-blue-500/10 rounded-full blur-xl absolute"></div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-108"
                          />
                          
                          {/* Favorite Button (Desktop) */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={(e) => handleToggleLike(product.id, e)}
                            className="absolute top-2 right-2 text-[#76777d] hover:text-[#0051d5] bg-white rounded-full p-1.5 shadow-xs md:block hidden z-20"
                            title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isLiked ? 'fill-red-500 stroke-red-500 text-red-500' : ''
                              }`}
                            />
                          </motion.button>
                        </div>

                        {/* Product Info */}
                        <div className="ml-4 flex flex-col justify-between flex-grow md:ml-0 md:mt-4">
                          <div>
                            <div className="block justify-between items-start gap-2">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                                {product.category}
                              </p>
                              <h3 className="font-semibold text-sm text-[#191c1e] line-clamp-2 group-hover:text-[#0051d5] transition-colors">
                                {product.name}
                              </h3>
                            </div>

                            <p className="text-xs text-[#76777d] mt-1 line-clamp-1">
                              {product.description}
                            </p>
                           <div className="mt-3 flex items-baseline justify-between">
                              <p className="text-lg font-bold text-slate-900">
                                ${product.price.toFixed(2)}
                              </p>
                              {product.brand && (
                                <p className="text-xs font-medium text-slate-400">{product.brand}</p>
                              )}
                           </div>


                          </div>

                          {/* Add to Cart Button */}
                          <motion.button
                            id={`add-to-cart-${product.id}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`mt-3 md:mt-4 w-full px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 text-white shadow-xs bg-[#0051d5] hover:bg-blue-600 ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'border border-[#c6c6cd] text-[#191c1e] hover:bg-[#f2f4f6]'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-4 h-4 " />
                                <span>Added to Cart</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5 text-[#FA9D1B]" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </motion.div>

            {/* Bottom Pagination Bar */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredProducts.length / pageSize)}
                  totalItems={filteredProducts.length}
                  pageSize={pageSize}
                  pageSizeOptions={[4, 8, 12, 16]}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  onPageChange={handlePageChange}
                  itemLabel="products"
                />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};
