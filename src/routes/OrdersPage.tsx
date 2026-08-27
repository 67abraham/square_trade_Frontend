import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PackageCheck, RefreshCw, MessageCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const statusSteps = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED'] as const;

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, authLoading, orders, refreshOrders } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (session) void refreshOrders(); }, [session, refreshOrders]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-slate-500">Checking your session…</div>;
  if (!session) return <Navigate to="/login" replace />;

  const refresh = async () => { setLoading(true); try { await refreshOrders(); } finally { setLoading(false); } };
  const whatsapp = import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER;
  const whatsappUrl = (orderNumber: string) => {
    if (!whatsapp) return '';
    return `https://wa.me/${String(whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I want an update on Order ${orderNumber}.`)}`;
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 md:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-bold text-slate-900">My Orders</h1><p className="text-sm text-slate-500 mt-1">Track every order and status update in one place.</p></div>
          <button onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-blue-500 disabled:opacity-60"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
        </div>
        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center"><PackageCheck className="w-12 h-12 mx-auto text-slate-300 mb-4"/><h2 className="text-lg font-semibold">No orders yet</h2><p className="text-sm text-slate-500 mt-1 mb-6">Your completed orders will appear here.</p><button onClick={() => navigate('/')} className="bg-[#0051d5] text-white rounded-lg px-5 py-2.5 text-sm font-semibold">Browse marketplace</button></div>
        ) : <div className="space-y-5">{orders.map(order => {
          const current = statusSteps.indexOf(order.status);
          return <article key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
              <div><p className="text-xs text-slate-500">Order number</p><h2 className="font-bold text-blue-700 text-lg">{order.orderNumber}</h2><p className="text-xs text-slate-500 mt-1">Placed {order.date}</p></div>
              <div className="flex items-center gap-3"><span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-bold">{order.status}</span>{whatsapp && <a href={whatsappUrl(order.orderNumber)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-2 text-xs font-semibold"><MessageCircle className="w-4 h-4"/>Contact admin</a>}</div>
            </div>
            <div className="py-6">{order.status === 'CANCELLED' ? <p className="text-sm font-semibold text-red-600">This order has been cancelled.</p> : <div className="grid grid-cols-4 gap-2">{statusSteps.map((step, index) => <div key={step} className="text-center"><div className={`h-2 rounded-full mb-2 ${index <= current ? 'bg-blue-600' : 'bg-slate-200'}`}/><span className={`text-[11px] font-semibold ${index <= current ? 'text-blue-700' : 'text-slate-400'}`}>{step}</span></div>)}</div>}</div>
            <div className="flex flex-wrap gap-4">{order.items.map((item, index) => <div key={`${order.id}-${index}`} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3"><div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">{item.image && <img src={item.image} alt="" className="max-w-full max-h-full object-contain"/>}</div><div><p className="text-sm font-semibold">{item.name}</p><p className="text-xs text-slate-500">Qty {item.quantity} · ${item.price.toFixed(2)}</p>{(item.selectedColor || item.selectedSize) && <p className="text-[11px] text-slate-400 mt-1">{[item.selectedColor && `Color: ${item.selectedColor}`, item.selectedSize && `Size: ${item.selectedSize}`].filter(Boolean).join(' · ')}</p>}</div></div>)}</div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between text-sm"><span className="text-slate-500">Total</span><strong>${order.totalAmount.toFixed(2)}</strong></div>
          </article>;
        })}</div>}
      </div>
    </main>
  );
};
