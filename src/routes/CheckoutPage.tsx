import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { ScreenType } from '../types';
import { screenToPath } from '../lib/navigation';
import { useAppContext } from '../context/AppContext';
import { CheckoutView } from '../views/CheckoutView';
import { EditDeliveryModal } from '../components/EditDeliveryModal';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    session,
    cartItems,
    deliveryInfo,
    saveDeliveryInfo,
    placeOrder,
    isEditDeliveryOpen,
    openEditDelivery,
    closeEditDelivery,
    isOrderSuccessOpen,
    closeOrderSuccess,
    lastOrder
  } = useAppContext();

  const onNavigate = (screen: ScreenType) => navigate(screenToPath[screen]);

  if (!session) return <Navigate to="/login" replace />;

  return (
    <>
      <CheckoutView
        cartItems={cartItems}
        deliveryInfo={deliveryInfo}
        onEditDelivery={openEditDelivery}
        onPlaceOrder={placeOrder}
        onNavigate={onNavigate}
      />

      <EditDeliveryModal
        isOpen={isEditDeliveryOpen}
        onClose={closeEditDelivery}
        currentInfo={deliveryInfo}
        onSave={saveDeliveryInfo}
      />

      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        onClose={closeOrderSuccess}
        orderId={lastOrder?.orderNumber ?? ''}
        totalAmount={lastOrder?.totalAmount ?? 0}
        onNavigate={onNavigate}
      />
    </>
  );
};
