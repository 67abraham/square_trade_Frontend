import React, { useState, useEffect } from 'react';
import type { Order, ScreenType } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { Pagination } from '../components/Pagination';
import { LayoutDashboard, Package, ShoppingCart, CreditCard, TrendingUp, AlertTriangle, PlusCircle, RotateCcw, FileCheck2, Truck, LogOut } from 'lucide-react';

interface AdminDashboardViewProps {
  orders: Order[];
  productCount: number;
  onRefresh: () => Promise<void>;
  onUpdateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  user: { name?: string | null; email: string; image?: string | null };
  onLogout: () => Promise<void>;
  onNavigate: (screen: ScreenType) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  orders,
  productCount,
  onRefresh,
  onUpdateOrderStatus,
  user,
  onLogout,
  onNavigate
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setActiveNav] = useState('Dashboard');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(5);

  useEffect(() => {
    setOrderCurrentPage(1);
  }, [filterStatus]);

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const paginatedOrders = filteredOrders.slice(
    (orderCurrentPage - 1) * orderPageSize,
    orderCurrentPage * orderPageSize
  );

  return (
    <div className="flex h-screen bg-[#f7f9fb] text-[#191c1e] font-inter overflow-hidden">
      {/* SideNavBar (Desktop Fixed / Responsive) */}
      <aside className="bg-[#111111] text-white w-64 lg:w-[280px] flex-shrink-0 flex flex-col py-6 z-30 shadow-xl">
        {/* Logo */}
        <div className="px-5 mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="Return to Marketplace"
          >
            <BrandLogo variant="horizontal" theme="dark" size="sm" showSubtitle={true} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <button onClick={() => { setActiveNav('Dashboard'); document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-white/15 text-white font-semibold shadow-xs">
            <LayoutDashboard className="w-5 h-5 text-blue-400" /><span>Dashboard</span>
          </button>
          <div className="pt-5 pb-2 px-4 text-[11px] font-bold text-white/40 uppercase tracking-widest">Store Management</div>
          <button onClick={() => onNavigate('admin-create-product')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors group">
            <PlusCircle className="w-4 h-4 text-white/60 group-hover:text-blue-400" /><span>Add Products</span><span className="ml-auto bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold">+ New</span>
          </button>
          <button onClick={() => { setActiveNav('Orders'); document.getElementById('admin-orders')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <ShoppingCart className="w-4 h-4 text-white/60" /><span>Order Management</span>
          </button>
          <button onClick={() => { setActiveNav('Orders'); document.getElementById('admin-orders')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            <Package className="w-4 h-4 text-white/60" /><span>All Products</span>
          </button>
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {user.image ? <img alt="User avatar" className="w-10 h-10 rounded-full border border-white/20 object-cover" src={user.image} /> : <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 grid place-items-center text-sm font-bold">{(user.name || user.email).slice(0, 1).toUpperCase()}</div>}
            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-white truncate font-inter">{user.name || 'Administrator'}</p><p className="text-xs text-white/50 truncate font-inter">{user.email}</p></div>
            <button onClick={() => void onLogout()} className="text-white/50 hover:text-white transition-colors p-1" title="Sign Out"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f7f9fb]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
            <div>
              <h1 className="font-public-sans text-2xl md:text-3xl font-bold text-[#191c1e]">
                Dashboard Overview
              </h1>
              <p className="text-sm text-[#45464d] mt-1">
                Live catalog and order metrics from the backend.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('admin-create-product')}
                className="bg-[#0051d5] hover:bg-[#003ea8] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Product</span>
              </button>

              <button onClick={async () => { setIsRefreshing(true); try { await onRefresh(); } finally { setIsRefreshing(false); } }} disabled={isRefreshing} className="px-3.5 py-2 bg-white border border-[#c6c6cd] rounded-lg text-xs font-semibold text-[#45464d] flex items-center gap-2 shadow-xs hover:bg-slate-50 disabled:opacity-60">
                <RotateCcw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing…' : 'Refresh orders'}</span>
              </button>
            </div>
          </div>

          {/* Bento Grid Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1: Order Value */}
            <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 relative overflow-hidden shadow-xs group hover:border-[#0051d5]/40 transition-all">
              <div className="absolute top-3 right-3 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-16 h-16 text-[#0051d5]" />
              </div>
              <p className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-2 font-inter">
                Order Value
              </p>
              <h3 className="font-public-sans text-4xl font-bold text-[#191c1e] mb-4">
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-teal-800 bg-[#6bd8cb]/30 px-2 py-0.5 rounded text-xs font-bold font-inter">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-700" /> {orders.length} orders
                </span>
                <span className="text-xs text-[#45464d] font-inter">in current result set</span>
              </div>
            </div>

            {/* Metric 2: Active Orders */}
            <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 relative overflow-hidden shadow-xs group hover:border-[#0051d5]/40 transition-all">
              <div className="absolute top-3 right-3 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileCheck2 className="w-16 h-16 text-[#0051d5]" />
              </div>
              <p className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-2 font-inter">
                Active Orders
              </p>
              <h3 className="font-public-sans text-4xl font-bold text-[#191c1e] mb-4">
                {orders.filter(order => !['DELIVERED', 'CANCELLED'].includes(order.status)).length}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center text-[#191c1e] bg-[#e6e8ea] px-2.5 py-0.5 rounded text-xs font-semibold font-inter">
                  {orders.filter(order => order.status === 'PENDING').length} Pending
                </span>
              </div>
            </div>

            {/* Metric 3: Pending Deliveries */}
            <div className="bg-white border border-[#c6c6cd] rounded-xl p-6 relative overflow-hidden shadow-xs group hover:border-[#0051d5]/40 transition-all">
              <div className="absolute top-3 right-3 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Truck className="w-16 h-16 text-[#0051d5]" />
              </div>
              <p className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-2 font-inter">
                Pending Deliveries
              </p>
              <h3 className="font-public-sans text-4xl font-bold text-[#191c1e] mb-4">
                {orders.filter(order => ['SHIPPED', 'PREPARING'].includes(order.status)).length}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-0.5 rounded text-xs font-bold font-inter">
                  <AlertTriangle className="w-3.5 h-3.5" /> {orders.filter(order => order.status === 'CANCELLED').length} Cancelled
                </span>
              </div>
            </div>
          </div>

          {/* Lower Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Recent Orders Table (2 cols) */}
            <div id="admin-orders" className="lg:col-span-2 bg-white border border-[#c6c6cd] rounded-xl overflow-hidden shadow-xs flex flex-col">
              <div className="p-5 border-b border-[#c6c6cd] flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="font-public-sans text-lg font-bold text-[#191c1e]">
                    Recent Orders
                  </h3>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    {filteredOrders.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="text-xs font-semibold text-[#0051d5] hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse font-inter">
                  <thead className="bg-[#f2f4f6] border-b border-[#c6c6cd] text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-5">Order ID</th>
                      <th className="py-3 px-5">Shipping</th>
                      <th className="py-3 px-5">Amount</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#eceef0] bg-white">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                          No procurement orders found for the selected status.
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => {
                        let statusBadgeClass = "bg-[#e0e3e5] text-[#45464d]";
                        if (order.status === 'PREPARING' || order.status === 'PENDING') {
                          statusBadgeClass = "bg-[#6bd8cb]/30 text-teal-800 font-bold";
                        } else if (order.status === 'CANCELLED') {
                          statusBadgeClass = "bg-[#ffdad6] text-[#93000a] font-bold";
                        } else if (order.status === 'DELIVERED') {
                          statusBadgeClass = "bg-slate-100 text-slate-700 font-medium";
                        } else if (order.status === 'SHIPPED') {
                          statusBadgeClass = "bg-blue-50 text-blue-700 font-medium";
                        }

                        return (
                          <tr
                            key={order.orderNumber}
                            className="hover:bg-[#f2f4f6] transition-colors group cursor-pointer"
                          >
                            <td className="py-3.5 px-5 font-semibold text-[#0051d5] group-hover:underline">
                              {order.orderNumber}
                            </td>
                            <td className="py-3.5 px-5 font-medium text-[#191c1e]">
                              {order.shippingMethod}
                            </td>
                            <td className="py-3.5 px-5 font-bold text-[#191c1e]">
                              ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3.5 px-5">
                              <select
                                value={order.status}
                                onChange={async e => { await onUpdateOrderStatus(order.id, e.target.value as Order['status']); }}
                                className={`px-2 py-1 rounded text-[11px] uppercase tracking-wider border border-transparent ${statusBadgeClass}`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="PREPARING">PREPARING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-5 text-right text-xs text-[#45464d]">
                              {order.date}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              {filteredOrders.length > 0 && (
                <div className="px-5 py-2 border-t border-[#eceef0] bg-slate-50/50">
                  <Pagination
                    currentPage={orderCurrentPage}
                    totalPages={Math.ceil(filteredOrders.length / orderPageSize)}
                    totalItems={filteredOrders.length}
                    pageSize={orderPageSize}
                    pageSizeOptions={[5, 10, 15]}
                    onPageSizeChange={(newSize) => {
                      setOrderPageSize(newSize);
                      setOrderCurrentPage(1);
                    }}
                    onPageChange={(page) => setOrderCurrentPage(page)}
                    itemLabel="orders"
                    variant="compact"
                  />
                </div>
              )}
            </div>

            <div className="bg-white border border-[#c6c6cd] rounded-xl p-5 shadow-xs flex flex-col">
              <h3 className="font-public-sans text-lg font-bold text-[#191c1e] mb-4">Catalog</h3>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Published products</p>
                <p className="text-4xl font-bold mt-2 text-slate-900">{productCount}</p>
                <p className="text-xs text-slate-500 mt-2">Products currently returned by the marketplace catalog API.</p>
              </div>
              <button onClick={() => onNavigate('admin-create-product')} className="w-full mt-auto py-2.5 border border-[#c6c6cd] rounded-lg font-semibold text-xs text-[#191c1c] hover:bg-[#f2f4f6] hover:border-[#0051d5] transition-all">Create a product</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
