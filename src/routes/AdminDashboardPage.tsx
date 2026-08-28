import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ScreenType } from '../types';
import { screenToPath } from '../lib/navigation';
import { updateOrderStatus } from '../lib/api/orders';
import { useAppContext } from '../context/AppContext';
import { AdminDashboardView } from '../admin/AdminDashboardView';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, authLoading, orders, products, refreshOrders, logout } = useAppContext();
  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);

  if (authLoading) return <div className="min-h-screen grid place-items-center text-slate-500">Checking your session…</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (session.user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return <AdminDashboardView
    user={session.user}
    onLogout={async () => { await logout(); navigate('/login'); }}
    orders={orders}
    productCount={products.length}
    onRefresh={refreshOrders}
    onUpdateOrderStatus={async (id, status) => { await updateOrderStatus(id, status); await refreshOrders(); }}
    onNavigate={onNavigate}
    onSelectOrder={(id) => navigate(`/admin/orders/${id}`)}
  />;
};
