import React, { useState } from 'react';
import { SellerWelcomePage } from './SellerWelcomePage';
import { SellerRegistrationPage } from './SellerRegistrationPage';
import { SellerDashboard } from './SellerDashboard';
import { SellerInventoryTab } from './SellerInventoryTab';
import { useAuth } from '../../../context/AuthContext';
import { Store, LayoutDashboard, Package, ShoppingBag, LogOut, Sparkles } from 'lucide-react';

export const SellerPortalRoot: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'register' | 'dashboard' | 'products' | 'orders'>('welcome');
  const { user, openAuthModal, signOut } = useAuth();

  const handleSignIn = () => {
    if (user) {
      setView('dashboard');
    } else {
      openAuthModal('Sign in to access your Astronava Seller Portal account');
    }
  };

  if (view === 'register') {
    return <SellerRegistrationPage onBack={() => setView('welcome')} />;
  }

  if (view === 'dashboard' || view === 'products' || view === 'orders' || user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col">
        {/* Branded Navigation Header */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center font-bold shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold font-vedic text-stone-950 tracking-wider">
                  ASTRONAVA <span className="text-amber-700 font-normal text-xs">Seller Portal</span>
                </span>
              </div>
            </div>

            <nav className="hidden sm:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setView('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  view === 'dashboard' ? 'bg-amber-900 text-amber-50 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setView('products')}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  view === 'products' ? 'bg-amber-900 text-amber-50 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Products</span>
              </button>
              <button
                onClick={() => setView('orders')}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  view === 'orders' ? 'bg-amber-900 text-amber-50 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order Management</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{user?.email || 'Verified Merchant'}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-6">
          {view === 'products' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-black font-vedic text-stone-950">My Products Inventory</h2>
              <SellerInventoryTab token="demo" />
            </div>
          ) : view === 'orders' ? (
            <div className="space-y-6 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
              <h2 className="text-2xl font-black font-vedic text-stone-950">Order Management &amp; Fulfillment</h2>
              <p className="text-xs text-stone-500">Manage customer orders, view shipping status, and update tracking details.</p>
              <div className="p-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-400 text-xs">
                No pending customer orders to fulfill at the moment.
              </div>
            </div>
          ) : (
            <SellerDashboard />
          )}
        </main>
      </div>
    );
  }

  return (
    <SellerWelcomePage
      onSignIn={handleSignIn}
      onCreateAccount={() => setView('register')}
    />
  );
};
