import React, { useEffect, useRef, useState } from 'react';
import type { Product, ScreenType, Category, CategoryType } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { Plus, Upload, Info, Check, Image as ImageIcon, LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

interface CreateProductViewProps {
  categories: Category[];
  onAddProduct: (product: Product) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  onGenerateDescription: (input: { name: string; brand: string; category: string; specifications: string; imageUrl?: string }) => Promise<string>;
  user: { name?: string | null; email: string; image?: string | null };
  onLogout: () => Promise<void>;
  onNavigate: (screen: ScreenType) => void;
}

export const CreateProductView: React.FC<CreateProductViewProps> = ({
  categories,
  onAddProduct,
  onUploadImage,
  onGenerateDescription,
  user,
  onLogout,
  onNavigate
}) => {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [minimumOrder, setMinimumOrder] = useState('1');
  const [productLocation, setProductLocation] = useState('');
  const [sizesInput, setSizesInput] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>(['#111827']);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string>('');
  const [publishCategory, setPublishCategory] = useState<CategoryType>('');
  const [categoryId, setCategoryId] = useState('');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorSwatches = [
    { hex: '#111827', name: 'Black' },
    { hex: '#A855F7', name: 'Purple' },
    { hex: '#3B82F6', name: 'Blue' },
    { hex: '#06B6D4', name: 'Cyan' },
    { hex: '#22C55E', name: 'Green' },
    { hex: '#EAB308', name: 'Yellow' },
    { hex: '#EF4444', name: 'Red' },
    { hex: '#EC4899', name: 'Pink' }
  ];

  useEffect(() => {
    if (!categoryId && categories[0]) { setCategoryId(categories[0].id); setPublishCategory(categories[0].name); }
  }, [categories, categoryId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true); setError(null);
    try {
      const remaining = Array.from(files).slice(0, Math.max(0, 4 - imageUrls.length));
      if (!remaining.length) { setError('You can upload a maximum of 4 images'); return; }
      const urls = await Promise.all(remaining.map(onUploadImage));
      setImageUrls(prev => [...prev, ...urls]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload image'); }
    finally { setIsUploading(false); }
  };

  const handleGenerateDescription = async () => {
    if (!productName.trim()) { setError('Enter a product name first'); return; }
    setIsGenerating(true); setError(null);
    try {
      const generated = await onGenerateDescription({ name: productName.trim(), brand, category: publishCategory, specifications: description, imageUrl: imageUrls[0] });
      setDescription(generated);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to generate description'); }
    finally { setIsGenerating(false); }
  };

  const handlePublish = async (status: 'Published' | 'Hidden' = 'Published') => {
    setError(null);
    const priceNum = Number(salePrice);
    if (!productName.trim() || !categoryId || !Number.isFinite(priceNum) || priceNum <= 0) { setError('Product name, category and a valid price are required'); return; }
    if (imageUrls.length === 0) { setError('Upload at least one product image before publishing'); return; }
    try {
      const minimumOrderNum = Number(minimumOrder);
      if (!Number.isInteger(minimumOrderNum) || minimumOrderNum < 1) { setError('Minimum order must be a whole number greater than 0'); return; }
      if (!productLocation.trim()) { setError('Product location is required'); return; }
      const product: Product = {
        id: '', name: productName.trim(), brand: brand.trim(), description: description.trim(), price: priceNum,
        rating: 0, reviewsCount: 0, category: publishCategory, categoryId, image: imageUrls[0], galleryImages: imageUrls,
        sizes: [...new Set(sizesInput.split(',').map(size => size.trim()).filter(Boolean))], colors: colorSwatches.filter(c => selectedColors.includes(c.hex)).map(c => ({ name: c.name, hex: c.hex })),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean), minimumOrder: minimumOrderNum, productLocation: productLocation.trim(), status: status === 'Published' ? 'AVAILABLE' : 'NOT_AVAILABLE', inStock: status === 'Published',
      };
      await onAddProduct(product);
      setIsSavedToast(true);
      setTimeout(() => { setIsSavedToast(false); onNavigate('marketplace'); }, 900);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to create product'); }
  };

  const handleReset = () => {
    setProductName(''); setBrand(''); setDescription(''); setSalePrice(''); setMinimumOrder('1'); setProductLocation(''); setSizesInput(''); setSelectedColors(['#111827']); setImageUrls([]); setTags(''); setError(null);
  };

  return (
    <div className="h-screen flex bg-gray-100 text-gray-800 font-inter overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1d21] text-white flex flex-col justify-between h-full flex-shrink-0 relative z-20 shadow-xl overflow-hidden py-6">
        <div className="flex-1 overflow-y-auto no-scrollbar px-4">
          {/* Logo */}
          <div className="mb-8 px-2">
            <button
              onClick={() => onNavigate('marketplace')}
              className="flex items-center text-left cursor-pointer hover:opacity-90 transition-opacity"
              title="Return to Marketplace"
            >
              <BrandLogo variant="horizontal" theme="dark" size="sm" showSubtitle={true} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 text-sm">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-[#2a2d31] hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 opacity-70" />
              <span>Dashboard</span>
            </button>

            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Store Management
              </p>
            </div>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#2a2d31] text-white font-semibold transition-colors"
            >
              <Package className="w-5 h-5 text-blue-400" />
              <span>Products</span>
            </button>

            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-[#2a2d31] hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5 opacity-70" />
              <span>Order Management</span>
            </button>

            

            

            

            

            
          </nav>
        </div>

        <div className="px-4 py-3 mx-4 bg-[#2a2d31] rounded-xl flex items-center justify-between border border-gray-700">
          <div className="flex items-center gap-3 min-w-0">
            {user.image ? <img alt="User avatar" className="w-8 h-8 rounded-full object-cover" src={user.image} /> : <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-xs font-bold">{(user.name || user.email).slice(0, 1).toUpperCase()}</div>}
            <div className="min-w-0"><p className="text-sm font-medium text-white truncate">{user.name || 'Administrator'}</p><p className="text-xs text-gray-400 truncate">{user.email}</p></div>
          </div>
          <button onClick={() => void onLogout()} className="text-gray-400 hover:text-white" title="Sign out"><LogOut className="w-4 h-4" /></button>
        </div>
      </aside>

      {/* Main Form Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 z-10">
          <h1 className="text-2xl font-bold font-public-sans text-gray-900">
            Create a New Product
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Product</span>
            </button>
          </div>
        </header>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Column (Main Form) */}
            <div className="flex-1 space-y-6">
              {/* General Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
                <h2 className="text-lg font-semibold font-public-sans text-gray-900 mb-5">
                  General Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      id="create-product-name-input"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2.5 px-3 border"
                      placeholder="e.g. Industrial Steel Beam"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2.5 px-3 border" placeholder="Brand (optional)" type="text" />
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <button
                      type="button"
                      onClick={() => void handleGenerateDescription()}
                      className="text-xs text-[#0066ff] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isGenerating ? 'Generating…' : 'Generate with AI'}</span>
                    </button>
                  </div>
                  <textarea
                    id="create-product-desc-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-3 px-3 border resize-none"
                    placeholder="Detailed product specifications..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-1.5 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {/* <p>Current listing state: <strong>{visibility}</strong></p> */}
                    <p>Images: <strong>{imageUrls.length}</strong> uploaded</p>
                    <p>Category: <strong>{publishCategory || 'Not selected'}</strong></p>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">$</span></div>
                      <input id="create-product-price-input" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="pl-7 w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2.5 border" placeholder="100.00" type="number" min="0.01" step="0.01" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order</label>
                    <input value={minimumOrder} onChange={(e) => setMinimumOrder(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2.5 px-3 border" type="number" min="1" step="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Location</label>
                    <input value={productLocation} onChange={(e) => setProductLocation(e.target.value)} className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2.5 px-3 border" placeholder="e.g. Monrovia, Liberia" type="text" />
                  </div>
                </div>
              </div>

              {/* Variants Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Sizes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2.5 px-3 border"
                    placeholder="e.g. Small, Medium, Large or 36 EU, 38 EU"
                    type="text"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Separate each available size with a comma.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Colors
                  </label>
                  <div className="flex gap-2.5 items-center flex-wrap">
                    {colorSwatches.map((col) => {
                      const isSelected = selectedColors.includes(col.hex);
                      return (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setSelectedColors(prev => prev.includes(col.hex) ? prev.filter(value => value !== col.hex) : [...prev, col.hex])}
                          className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                            isSelected
                              ? 'border-white ring-2 ring-[#0066ff] scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: col.hex }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar Cards) */}
            <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
              {/* Tag Card */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
                <label className="block text-sm font-semibold text-gray-900 mb-2 font-public-sans">
                  Tag
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2 px-3 border"
                  placeholder="Type and enter (comma separated)"
                  type="text"
                />
              </div>

              {/* Product Image Card */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
                <label className="block text-sm font-semibold text-gray-900 mb-3 font-public-sans">
                  Product Image
                </label>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(e) => void handleFiles(e.target.files)} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 bg-gray-50 text-center hover:bg-gray-100 transition-colors disabled:opacity-60">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500 leading-tight">{isUploading ? 'Uploading to Cloudflare R2…' : <>Choose product images<br /><span className="text-[#0066ff] font-medium">click to browse</span></>}</p>
                </button>
                {imageUrls.length > 0 && <div className="grid grid-cols-2 gap-2 mt-3">{imageUrls.map((url, index) => <div key={url} className="relative aspect-square bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"><img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-contain"/><button type="button" onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 rounded-full bg-white/90 px-1.5 text-xs text-red-600 shadow">×</button></div>)}</div>}

                <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                  <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p>Images are uploaded to Cloudflare R2 before the product is created.</p>
                </div>
              </div>
              {/* Publish Category Card */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
                <label className="block text-sm font-semibold text-gray-900 mb-3 font-public-sans">
                  Publish Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => { const selected = categories.find(c => c.id === e.target.value); setCategoryId(e.target.value); setPublishCategory(selected?.name ?? ''); }}
                  className="w-full rounded-lg border-gray-300 shadow-xs focus:border-[#0066ff] focus:ring-[#0066ff] text-sm py-2 px-3 border mb-3 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>

                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p>Select a category that will be the parent of the current one.</p>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="max-w-6xl mx-auto rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {/* Footer Actions */}
          <div className="max-w-6xl mx-auto mt-8 flex justify-between items-center pb-8 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => onNavigate('marketplace')}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition-colors"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void handlePublish('Hidden')}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-xs transition-colors"
              >
                Save as Hidden
              </button>

              <button
                id="publish-product-btn"
                type="button"
                onClick={() => void handlePublish('Published')}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#0066ff] hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>

          {/* Published Feedback Toast */}
          {isSavedToast && (
            <div className="fixed bottom-6 right-6 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200 z-50">
              <Check className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm font-public-sans">Product saved successfully</p>
                <p className="text-xs text-emerald-100">The product is now available in the marketplace.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
