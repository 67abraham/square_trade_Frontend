import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getOrderById, updateOrderStatus, type BackendOrder } from '../lib/api/orders';

export const AdminOrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { session, authLoading } = useAppContext();
  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true); setError(null);
    try { setOrder(await getOrderById(id)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load order'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [id]);
  if (authLoading) return <div className="min-h-screen grid place-items-center text-slate-500">Checking your session…</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== 'ADMIN') return <Navigate to="/" replace />;
  if (loading) return <div className="min-h-screen grid place-items-center text-slate-500">Loading order…</div>;
  if (!order) return <main className="min-h-screen bg-[#f7f9fb] p-6"><div className="mx-auto max-w-5xl"><button onClick={() => navigate('/admin')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">← Back to orders</button><div className="rounded-xl bg-white p-10 text-center"><p className="font-semibold">{error ?? 'Order not found'}</p></div></div></main>;

  const changeStatus = async (status: BackendOrder['status']) => {
    if (status === order.status || saving) return;
    setSaving(true); setError(null);
    try { await updateOrderStatus(order.id, status); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to update order'); }
    finally { setSaving(false); }
  };

  return <main className="min-h-screen bg-[#f7f9fb] p-5 md:p-10">
    <div className="mx-auto max-w-6xl">
      <button onClick={() => navigate('/admin')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"><ArrowLeft className="h-4 w-4" />Back to orders</button>
      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order details</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{order.orderNumber}</h1><p className="mt-1 text-sm text-slate-500">Placed {new Date(order.createAt).toLocaleString()}</p></div>
        <div className="flex items-center gap-2"><select value={order.status} disabled={saving} onChange={e => void changeStatus(e.target.value as BackendOrder['status'])} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold"><option value="PENDING">PENDING</option><option value="PREPARING">PREPARING</option><option value="SHIPPED">SHIPPED</option><option value="DELIVERED">DELIVERED</option><option value="CANCELLED">CANCELLED</option></select><button onClick={() => void load()} disabled={loading} className="rounded-lg border border-slate-300 bg-white p-2"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-1"><h2 className="text-lg font-bold text-slate-900">Customer</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-slate-500">Name</dt><dd className="font-semibold">{order.user?.name || 'Not provided'}</dd></div><div><dt className="text-xs text-slate-500">Email</dt><dd className="font-semibold break-all">{order.user?.email || 'Not provided'}</dd></div><div><dt className="text-xs text-slate-500">Shipping method</dt><dd className="font-semibold">{order.shippingMethod}</dd></div></dl></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2"><h2 className="text-lg font-bold text-slate-900">Products</h2><div className="mt-4 divide-y divide-slate-100">{order.item.map(item => <div key={item.id} className="flex gap-4 py-4 first:pt-0"><div className="h-20 w-20 shrink-0 rounded-xl bg-slate-50 p-2"><img src={item.product.imageUrl[0]} alt={item.product.name} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-900">{item.product.name}</h3><p className="mt-1 text-xs text-slate-500">Quantity: {item.quantity} · Unit price: ${Number(item.unitPrice ?? item.product.price).toFixed(2)}</p>{(item.selectedColor || item.selectedSize) && <p className="mt-1 text-xs text-slate-500">{[item.selectedColor && `Color: ${item.selectedColor}`, item.selectedSize && `Size: ${item.selectedSize}`].filter(Boolean).join(' · ')}</p>}</div><p className="font-bold text-slate-900">${(Number(item.unitPrice ?? item.product.price) * item.quantity).toFixed(2)}</p></div>)}</div><div className="mt-4 flex justify-end border-t pt-4"><div className="text-right"><p className="text-xs text-slate-500">Total order price</p><p className="text-2xl font-bold text-[#0051d5]">${order.totalAmount.toFixed(2)}</p></div></div></section>
      </div>
    </div>
  </main>;
};
