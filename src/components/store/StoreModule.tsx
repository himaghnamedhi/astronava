import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { StoreNavbar } from './StoreNavbar.tsx';
import { StoreHome } from './StoreHome.tsx';
import { StoreShop } from './StoreShop.tsx';
import { StoreProductDetail } from './StoreProductDetail.tsx';
import { StoreCart } from './StoreCart.tsx';
import { StoreCheckout } from './StoreCheckout.tsx';
import { StoreOrderSuccess } from './StoreOrderSuccess.tsx';
import { AdminPanel } from './admin/AdminPanel.tsx';
import { CartDrawer } from './CartDrawer.tsx';

const ADMIN_EMAILS = ['himaghnamedhi1@gmail.com'];

export const StoreModule: React.FC = () => {
  const { activeStoreView } = useStore();
  const { user } = useAuth();
  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      {/* Top Store Sub-navigation (hidden on admin screen) */}
      {activeStoreView !== 'admin' && <StoreNavbar />}

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeStoreView === 'home' && <StoreHome />}
        {activeStoreView === 'shop' && <StoreShop />}
        {activeStoreView === 'product' && <StoreProductDetail />}
        {activeStoreView === 'cart' && <StoreCart />}
        {activeStoreView === 'checkout' && <StoreCheckout />}
        {activeStoreView === 'order-success' && <StoreOrderSuccess />}
        {activeStoreView === 'admin' && (isAdmin ? <AdminPanel /> : <StoreHome />)}
      </main>

      {/* Slide-over Quick Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
