import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ShopLayout } from './layout/ShopLayout';
import { MarketplacePage } from './routes/MarketplacePage';
import { ProductDetailPage } from './routes/ProductDetailPage';
import { CheckoutPage } from './routes/CheckoutPage';
import { AdminDashboardPage } from './routes/AdminDashboardPage';
import { AdminAllProductsPage } from './routes/AdminAllProductsPage';
import { CreateProductPage } from './routes/CreateProductPage';
import { AuthLoginPage } from './routes/AuthLoginPage';
import { OrdersPage } from './routes/OrdersPage';
import { ResetPasswordPage } from './routes/ResetPasswordPage';
import { AdminOrderDetailsPage } from './routes/AdminOrderDetailsPage';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Storefront pages share the top nav / footer / cart drawer chrome */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>

        {/* These pages render their own full-page chrome (checkout header,
            dashboard sidebar, auth screen) so they sit outside ShopLayout. */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/all_products" element={<AdminAllProductsPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
        <Route path="/admin/create-product" element={<CreateProductPage />} />
        <Route path="/login" element={<AuthLoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Unknown routes fall back to the marketplace */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
