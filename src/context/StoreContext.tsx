import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Category, Order, WishlistItem } from '../types/store.ts';
import { useAuth } from './AuthContext.tsx';
import {
  saveWishlistItemToFirestore,
  removeWishlistItemFromFirestore,
  subscribeUserWishlist,
} from '../lib/firebase.ts';

export type StoreView = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-success' | 'admin' | 'wishlist' | 'profile';

interface ShopFilters {
  categorySlug?: string;
  planet?: string;
  zodiac?: string;
  certification?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  activeStoreView: StoreView;
  selectedProductSlug: string | null;
  lastCompletedOrder: Order | null;
  shopFilters: ShopFilters;
  categories: Category[];
  loadingCategories: boolean;
  appliedCoupon: {
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null;

  // Wishlist
  wishlist: WishlistItem[];
  wishlistCount: number;
  isWishlisted: (productId: number | string) => boolean;
  toggleWishlist: (product: {
    id: number;
    slug: string;
    name: string;
    price: string | number;
    salePrice?: string | number | null;
    primaryImage?: string;
    categoryName?: string;
    stock?: number;
  }) => Promise<boolean>;
  removeFromWishlist: (productId: number | string) => Promise<void>;
  moveToCartFromWishlist: (item: WishlistItem) => void;

  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  navigateToHome: () => void;
  navigateToShop: (categorySlug?: string, extraFilters?: Partial<ShopFilters>) => void;
  navigateToProduct: (slug: string) => void;
  navigateToCart: () => void;
  navigateToCheckout: () => void;
  navigateToAdmin: () => void;
  navigateToWishlist: () => void;
  navigateToProfile: () => void;
  setOrderSuccess: (order: Order) => void;
  setShopFilters: React.Dispatch<React.SetStateAction<ShopFilters>>;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  refreshCategories: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'astronava_store_cart_v1';
const WISHLIST_STORAGE_KEY = 'astronava_store_wishlist_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeStoreView, setActiveStoreView] = useState<StoreView>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      if (
        p === '/admin' ||
        p === '/store/admin' ||
        search.get('view') === 'admin' ||
        search.get('admin') === 'true' ||
        search.get('admin') === '1'
      ) {
        return 'admin';
      }
      if (search.get('view') === 'wishlist') return 'wishlist';
      if (search.get('view') === 'profile' || search.get('view') === 'orders') return 'profile';
    }
    return 'home';
  });

  // Listen for browser navigation changes to admin
  useEffect(() => {
    const handleUrlCheck = () => {
      const p = window.location.pathname.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      if (
        p === '/admin' ||
        p === '/store/admin' ||
        search.get('view') === 'admin' ||
        search.get('admin') === 'true' ||
        search.get('admin') === '1'
      ) {
        setActiveStoreView('admin');
      }
    };
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, []);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [shopFilters, setShopFilters] = useState<ShopFilters>({
    sortBy: 'popular',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist with Firebase Firestore and LocalStorage
  useEffect(() => {
    if (!user?.uid) {
      // Offline / guest: save to localStorage
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (e) {
        console.warn('Could not persist wishlist to localStorage', e);
      }
      return;
    }

    // Authenticated user: subscribe to real-time Firestore wishlist updates
    const unsubscribe = subscribeUserWishlist(
      user.uid,
      (firestoreItems) => {
        const mappedItems: WishlistItem[] = firestoreItems.map((fi) => ({
          id: fi.id,
          userId: fi.userId,
          productId: fi.productId,
          productSlug: fi.productSlug,
          name: fi.name,
          price: fi.price,
          salePrice: fi.salePrice,
          imageUrl: fi.imageUrl,
          categoryName: fi.categoryName,
          inStock: fi.inStock,
          createdAt: fi.createdAt ? (fi.createdAt.toDate ? fi.createdAt.toDate().toISOString() : String(fi.createdAt)) : new Date().toISOString(),
        }));
        setWishlist(mappedItems);
        try {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(mappedItems));
        } catch {}
      },
      (err) => {
        console.warn('Firestore wishlist subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Check if an item is bookmarked
  const isWishlisted = useCallback(
    (productId: number | string): boolean => {
      const numId = Number(productId);
      const strId = String(productId);
      return wishlist.some((item) => item.productId === numId || item.id === strId);
    },
    [wishlist]
  );

  // Toggle wishlist state
  const toggleWishlist = async (product: {
    id: number;
    slug: string;
    name: string;
    price: string | number;
    salePrice?: string | number | null;
    primaryImage?: string;
    categoryName?: string;
    stock?: number;
  }): Promise<boolean> => {
    const numId = Number(product.id);
    const currentlyInWishlist = isWishlisted(numId);

    if (currentlyInWishlist) {
      await removeFromWishlist(numId);
      return false;
    } else {
      const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const salePriceNum =
        product.salePrice !== undefined && product.salePrice !== null
          ? typeof product.salePrice === 'string'
            ? parseFloat(product.salePrice)
            : product.salePrice
          : undefined;

      const newItem: WishlistItem = {
        id: String(product.id),
        userId: user?.uid,
        productId: numId,
        productSlug: product.slug,
        name: product.name,
        price: priceNum || 0,
        salePrice: salePriceNum,
        imageUrl: product.primaryImage,
        categoryName: product.categoryName,
        inStock: product.stock !== undefined ? product.stock > 0 : true,
        createdAt: new Date().toISOString(),
      };

      setWishlist((prev) => {
        const next = [newItem, ...prev.filter((i) => i.productId !== numId)];
        try {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });

      if (user?.uid) {
        try {
          await saveWishlistItemToFirestore(user.uid, {
            productId: numId,
            productSlug: product.slug,
            name: product.name,
            price: priceNum || 0,
            salePrice: salePriceNum,
            imageUrl: product.primaryImage,
            categoryName: product.categoryName,
            inStock: product.stock !== undefined ? product.stock > 0 : true,
          });
        } catch (e) {
          console.warn('Could not save wishlist to Firestore:', e);
        }
      }
      return true;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId: number | string): Promise<void> => {
    const numId = Number(productId);
    setWishlist((prev) => {
      const next = prev.filter((i) => i.productId !== numId && i.id !== String(productId));
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    if (user?.uid) {
      try {
        await removeWishlistItemFromFirestore(user.uid, productId);
      } catch (e) {
        console.warn('Could not remove wishlist from Firestore:', e);
      }
    }
  };

  // Move from wishlist to cart
  const moveToCartFromWishlist = (item: WishlistItem) => {
    addToCart({
      id: `${item.productId}-base`,
      productId: item.productId,
      productName: item.name,
      slug: item.productSlug,
      sku: `PROD-${item.productId}`,
      price: item.salePrice || item.price,
      originalPrice: item.salePrice ? item.price : null,
      quantity: 1,
      imageUrl:
        item.imageUrl ||
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      stock: 10,
    });
    removeFromWishlist(item.productId);
  };

  const wishlistCount = wishlist.length;

  // Load categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch('/api/store/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load store categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cart operations
  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === newItem.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const currentQty = updated[existingIdx].quantity;
        const availableStock = updated[existingIdx].stock;
        const nextQty = Math.min(availableStock, currentQty + newItem.quantity);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: nextQty,
        };
        return updated;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: Math.min(item.stock, quantity),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Navigation handlers
  const navigateToHome = () => {
    setActiveStoreView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = (categorySlug?: string, extraFilters?: Partial<ShopFilters>) => {
    setShopFilters((prev) => ({
      ...prev,
      categorySlug: categorySlug !== undefined ? categorySlug : prev.categorySlug,
      ...(extraFilters || {}),
    }));
    setActiveStoreView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setActiveStoreView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCart = () => {
    setIsCartOpen(false);
    setActiveStoreView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setIsCartOpen(false);
    setActiveStoreView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setIsCartOpen(false);
    setActiveStoreView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWishlist = () => {
    setIsCartOpen(false);
    setActiveStoreView('wishlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProfile = () => {
    setIsCartOpen(false);
    setActiveStoreView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setOrderSuccess = (order: Order) => {
    setLastCompletedOrder(order);
    clearCart();
    setActiveStoreView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/store/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        return { success: false, error: data.error || 'Invalid coupon code' };
      }
      setAppliedCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discountAmount: data.discountAmount,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Coupon verification failed' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        activeStoreView,
        selectedProductSlug,
        lastCompletedOrder,
        shopFilters,
        categories,
        loadingCategories,
        appliedCoupon,
        wishlist,
        wishlistCount,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        moveToCartFromWishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        navigateToHome,
        navigateToShop,
        navigateToProduct,
        navigateToCart,
        navigateToCheckout,
        navigateToAdmin,
        navigateToWishlist,
        navigateToProfile,
        setOrderSuccess,
        setShopFilters,
        applyCoupon,
        removeCoupon,
        refreshCategories: fetchCategories,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
