import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { StoreHome } from './StoreHome.tsx';
import { StoreShop } from './StoreShop.tsx';
import { StoreProductDetail } from './StoreProductDetail.tsx';
import { StoreCart } from './StoreCart.tsx';
import { StoreCheckout } from './StoreCheckout.tsx';
import { StoreOrderSuccess } from './StoreOrderSuccess.tsx';
import { StoreWishlist } from './StoreWishlist.tsx';
import { StoreUserProfile } from './StoreUserProfile.tsx';
import { CartDrawer } from './CartDrawer.tsx';

export const StoreModule: React.FC = () => {
  const { activeStoreView } = useStore();

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] w-full">
      {/* Main View Switcher */}
      <div className="flex-1 w-full">
        {activeStoreView === 'home' && <StoreHome />}
        {activeStoreView === 'shop' && <StoreShop />}
        {activeStoreView === 'product' && <StoreProductDetail />}
        {activeStoreView === 'cart' && <StoreCart />}
        {activeStoreView === 'checkout' && <StoreCheckout />}
        {activeStoreView === 'order-success' && <StoreOrderSuccess />}
        {activeStoreView === 'wishlist' && <StoreWishlist />}
        {activeStoreView === 'profile' && <StoreUserProfile />}
      </div>

      {/* Slide-over Quick Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
