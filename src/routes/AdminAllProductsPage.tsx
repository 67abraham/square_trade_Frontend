import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Package, RefreshCw, Trash2, X } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { useAppContext } from "../context/AppContext";
import {
  deleteProduct,
  type CreateProductPayload,
  updateProduct,
} from "../lib/api/admin";
import type { Product } from "../types";

const splitValues = (value: string) => [
  ...new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];
const productPayload = (
  product: Product,
  status: "AVAILABLE" | "NOT_AVAILABLE",
): CreateProductPayload | null => {
  if (
    !product.categoryId ||
    !product.productLocation ||
    !(product.galleryImages?.length || product.image)
  )
    return null;
  return {
    name: product.name,
    brand: product.brand || null,
    description: product.description,
    categoryId: product.categoryId,
    imageUrl: product.galleryImages ?? [product.image],
    price: product.price,
    minimumOrder: product.minimumOrder ?? 1,
    productLocation: product.productLocation,
    tags: product.tags ?? [],
    sizes: product.sizes ?? [],
    colors: product.colors?.map((color) => ({
      name: color.name,
      hex: color.hex,
    })),
    status,
  };
};

const ProductEditor: React.FC<{
  product: Product;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}> = ({ product, categories, onClose, onSaved }) => {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand ?? "");
  const [description, setDescription] = useState(product.description);
  const [categoryId, setCategoryId] = useState(product.categoryId ?? "");
  const [price, setPrice] = useState(String(product.price));
  const [minimumOrder, setMinimumOrder] = useState(
    String(product.minimumOrder ?? 1),
  );
  const [location, setLocation] = useState(product.productLocation ?? "");
  const [imageUrls, setImageUrls] = useState(
    (product.galleryImages ?? [product.image]).join("\n"),
  );
  const [tags, setTags] = useState((product.tags ?? []).join(", "));
  const [sizes, setSizes] = useState((product.sizes ?? []).join(", "));
  const [status, setStatus] = useState<"AVAILABLE" | "NOT_AVAILABLE">(
    product.status === "NOT_AVAILABLE" ? "NOT_AVAILABLE" : "AVAILABLE",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedImages = imageUrls
      .split(/[,\n]/)
      .map((url) => url.trim())
      .filter(Boolean);
    const parsedPrice = Number(price);
    const parsedMinimum = Number(minimumOrder);
    if (
      !name.trim() ||
      !description.trim() ||
      !categoryId ||
      !location.trim() ||
      !parsedImages.length ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedMinimum) ||
      parsedMinimum < 1
    ) {
      setError(
        "Complete all required fields and provide at least one image URL.",
      );
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProduct(product.id, {
        name: name.trim(),
        brand: brand.trim() || null,
        description: description.trim(),
        categoryId,
        imageUrl: parsedImages,
        price: parsedPrice,
        minimumOrder: parsedMinimum,
        productLocation: location.trim(),
        tags: splitValues(tags),
        sizes: splitValues(sizes),
        colors: product.colors?.map((color) => ({
          name: color.name,
          hex: color.hex,
        })),
        status,
      });
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <form
        onSubmit={save}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit product</h2>
            <p className="text-sm text-slate-500">
              Update details or availability.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium">
            Brand
            <input
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium">
            Category
            <select
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Availability
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as typeof status)
              }
              className="mt-1 w-full rounded-lg border p-2.5"
            >
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Not available</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Price
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium">
            Minimum order
            <input
              required
              type="number"
              min="1"
              value={minimumOrder}
              onChange={(event) => setMinimumOrder(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Location
            <input
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Description
            <textarea
              required
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Image URLs{" "}
            <span className="font-normal text-slate-500">
              (one per line or comma-separated)
            </span>
            <textarea
              required
              rows={3}
              value={imageUrls}
              onChange={(event) => setImageUrls(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium">
            Sizes <span className="font-normal text-slate-500">(optional)</span>
            <input
              value={sizes}
              onChange={(event) => setSizes(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
          <label className="text-sm font-medium">
            Tags <span className="font-normal text-slate-500">(optional)</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5"
            />
          </label>
        </div>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="rounded-lg bg-[#0051d5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminAllProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, authLoading, products, categories, refreshProducts } =
    useAppContext();
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const [pending, setPending] = useState<Record<string, "status" | "delete" | undefined>>({});

  useEffect(() => {
    if (session?.user.role === "ADMIN") void refreshProducts();
  }, [session?.user.role, refreshProducts]);

  if (authLoading)
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        Please wait…
      </div>
    );
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== "ADMIN") return <Navigate to="/" replace />;

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const visibleProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshProducts();
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (
    product: Product,
    status: "AVAILABLE" | "NOT_AVAILABLE",
  ) => {
    if (pending[product.id]) return; // already mid-action on this product — ignore repeat clicks
    const payload = productPayload(product, status);
    if (!payload) {
      setError("This product is missing required data and cannot be updated.");
      return;
    }
    setError(null);
    setPending((prev) => ({ ...prev, [product.id]: "status" }));
    try {
      await updateProduct(product.id, payload);
      await refreshProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to change product status",
      );
    } finally {
      setPending((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }
  };

  const remove = async (product: Product) => {
    if (pending[product.id]) return;
    if (
      !window.confirm(
        `Remove ${product.name} from the marketplace? It will be archived to preserve order history.`,
      )
    )
      return;
    setError(null);
    setPending((prev) => ({ ...prev, [product.id]: "delete" }));
    try {
      await deleteProduct(product.id);
      await refreshProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete product");
    } finally {
      setPending((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] p-5 font-inter md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/admin")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </button>
            <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage available and not-available catalog products.
            </p>
          </div>
          <button
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{products.length} products</p>
          <div className="flex gap-3 text-xs font-semibold">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              {products.filter((p) => p.status !== "NOT_AVAILABLE").length} available
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
              {products.filter((p) => p.status === "NOT_AVAILABLE").length} not available
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center text-slate-500">
            <Package className="mx-auto mb-3 h-10 w-10" />
            No products found.
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => {
                const unavailable = product.status === "NOT_AVAILABLE";
                const isStatusPending = pending[product.id] === "status";
                const isDeletePending = pending[product.id] === "delete";
                const isBusy = isStatusPending || isDeletePending;

                return (
                  <article
                    key={product.id}
                    onClick={() => !isBusy && setEditing(product)}
                    className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all ${isBusy ? "cursor-wait opacity-70" : "cursor-pointer hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"}`}
                  >
                    {isBusy && (
                      <div className="absolute inset-0 z-10 grid place-items-center bg-white/60 backdrop-blur-[1px]">
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      </div>
                    )}

                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center">
                          <Package className="h-10 w-10 text-slate-300" />
                        </div>
                      )}
                      <span
                        className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${unavailable ? "bg-slate-800/90 text-white" : "bg-emerald-500/95 text-white"}`}
                      >
                        {unavailable ? "Not_Available" : "Available"}
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                        {product.category}
                      </p>
                      <h2 className="mt-0.5 line-clamp-1 font-bold text-slate-900">
                        {product.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {product.description || "No product description provided."}
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

                    <div className="flex gap-2 border-t border-slate-100 p-3 pt-3">
                      <button
                        disabled={isBusy}
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditing(product);
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={(event) => {
                          event.stopPropagation();
                          void changeStatus(product, unavailable ? "AVAILABLE" : "NOT_AVAILABLE");
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {isStatusPending ? "…" : unavailable ? "Enable" : "Disable"}
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={(event) => {
                          event.stopPropagation();
                          void remove(product);
                        }}
                        title="Archive product"
                        className="rounded-lg border border-red-200 px-3 py-2 text-red-700 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-7 border-t">
              <Pagination
                currentPage={Math.min(currentPage, totalPages)}
                totalPages={totalPages}
                totalItems={products.length}
                pageSize={pageSize}
                pageSizeOptions={[6, 9, 12, 18]}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                onPageChange={setCurrentPage}
                itemLabel="products"
              />
            </div>
          </>
        )}
      </div>
      {editing && (
        <ProductEditor
          key={editing.id}
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={refreshProducts}
        />
      )}
    </main>
  );
};