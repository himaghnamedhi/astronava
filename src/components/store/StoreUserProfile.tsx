import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  ShieldCheck,
  LogOut,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  ShoppingBag,
  Clock,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { StoreOrderHistory } from './StoreOrderHistory.tsx';

export const StoreUserProfile: React.FC = () => {
  const { user, signOut, openAuthModal } = useAuth();
  const {
    wishlistCount,
    navigateToWishlist,
    navigateToShop,
    navigateToHome,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'account'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <button
          onClick={navigateToHome}
          className="hover:text-amber-900 transition-colors cursor-pointer"
        >
          Store Home
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-amber-900 font-bold">User Profile & Orders</span>
      </div>

      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-900 to-amber-700 p-0.5 shadow-md">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-8 h-8 text-amber-900/70" />
                  )}
                </div>
              </div>
              {user && (
                <div
                  title="Google Verified"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-2xs"
                >
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-vedic">
                  {user ? user.displayName || 'Vedic Seeker' : 'Store Guest'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {user ? 'Verified Member' : 'Guest Mode'}
                </span>
              </div>

              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{user?.email || 'Sign in to access synchronized orders and wishlist'}</span>
              </p>
            </div>
          </div>

          {/* Auth Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-xl border border-stone-300 hover:border-rose-300 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('Sign in to access your profile and order history')}
                className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-stone-100 pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-950 text-amber-100 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History & Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-amber-950 text-amber-100 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Wishlist ({wishlistCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'account'
                ? 'bg-amber-950 text-amber-100 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Vedic Authenticity & Support</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <StoreOrderHistory onBrowseStore={navigateToShop} />
        </div>
      )}

      {/* Tab Content 2: Wishlist Overview */}
      {activeTab === 'wishlist' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-stone-900 font-vedic">
                Bookmarked Artifacts
              </h2>
              <p className="text-xs text-stone-500">
                You have {wishlistCount} item(s) saved in your consecrated wishlist.
              </p>
            </div>

            <button
              onClick={navigateToWishlist}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Full Wishlist</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div className="text-xs text-stone-600">
                <p className="font-bold text-stone-900">Cloud Synchronized Wishlist</p>
                <p>Bookmarked items are stored securely in Firestore and accessible anytime.</p>
              </div>
            </div>

            <button
              onClick={navigateToWishlist}
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-amber-800 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Manage Saved Items
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 3: Vedic Authenticity & Care */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-stone-900 font-vedic">
              Vedic Store Guarantees & Support
            </h2>
            <p className="text-xs text-stone-500">
              Information regarding order sanctification, lab reports, and aftercare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900">Lab Certifications</h3>
              <p className="text-stone-600 leading-relaxed">
                All ratnas and rudraksha beads are independently certified by government-accredited gemological laboratories.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900">Prana Pratishtha Puja</h3>
              <p className="text-stone-600 leading-relaxed">
                Every ordered artifact undergoes individual chanting and energization under correct planetary hora prior to dispatch.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-900">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900">Customer Support</h3>
              <p className="text-stone-600 leading-relaxed">
                Have questions regarding your order or astrological suitability? Reach our team anytime via email or WhatsApp support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
