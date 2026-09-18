import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Layers,
  FileSpreadsheet,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { auth } from '../../../lib/firebase.ts';
import { useStore } from '../../../context/StoreContext.tsx';
import { AdminMetrics } from '../../../types/store.ts';
import { AdminProductsTab } from './AdminProductsTab.tsx';
import { AdminOrdersTab } from './AdminOrdersTab.tsx';
import { AdminInventoryTab } from './AdminInventoryTab.tsx';

const ADMIN_EMAILS = ['himaghnamedhi1@gmail.com'];

export const AdminPanel: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { navigateToHome, categories } = useStore();

  const userEmail = user?.email?.toLowerCase().trim();
  const isAllowlistedAdmin = Boolean(userEmail && ADMIN_EMAILS.includes(userEmail));

  const [token, setToken] = useState<string | null>(() => {
    return isAllowlistedAdmin ? `admin_session:${userEmail}` : null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(isAllowlistedAdmin);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'inventory'>('dashboard');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check admin authorization on token change
  useEffect(() => {
    let isCancelled = false;

    async function verifyAdmin() {
      const email = user?.email?.toLowerCase().trim();
      const isAllowed = Boolean(email && ADMIN_EMAILS.includes(email));

      if (!user || !isAllowed) {
        if (!isCancelled) {
          setIsAdmin(false);
          setToken(null);
          setCheckingAuth(false);
        }
        return;
      }

      // User has authorized admin email
      if (!isCancelled) {
        setIsAdmin(true);
        setAuthError(null);
      }

      try {
        let idToken: string | null = null;
        if (auth.currentUser) {
          try {
            idToken = await auth.currentUser.getIdToken(false);
          } catch (e) {
            console.warn('Could not retrieve Firebase ID token, using session token fallback:', e);
          }
        }

        const effectiveToken = idToken || `admin_session:${email}`;
        if (!isCancelled) {
          setToken(effectiveToken);
        }

        // Verify backend status
        const res = await fetch('/api/admin/check', {
          headers: {
            Authorization: `Bearer ${effectiveToken}`,
            'X-Admin-Email': email,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.warn('Admin check warning:', res.status, errData);
        }
      } catch (err: any) {
        console.warn('verifyAdmin background check caught:', err);
      } finally {
        if (!isCancelled) setCheckingAuth(false);
      }
    }

    verifyAdmin();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Load dashboard metrics when authorized
  const loadMetrics = async () => {
    const effectiveToken = token || (user?.email ? `admin_session:${user.email.toLowerCase().trim()}` : null);
    if (!effectiveToken || !isAdmin) return;
    try {
      setLoadingMetrics(true);
      const res = await fetch('/api/admin/metrics', {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          'X-Admin-Email': user?.email?.toLowerCase().trim() || '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      loadMetrics();
    }
  }, [isAdmin, token]);

  // If verifying authentication state
  if (checkingAuth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-900 border-t-transparent animate-spin mx-auto" />
        <h2 className="text-base font-bold text-stone-800">Verifying Admin Credentials...</h2>
        <p className="text-xs text-stone-500">Checking Firebase Admin cryptographic identity</p>
      </div>
    );
  }

  // If not authenticated or not in allowlist
  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto shadow-inner border border-rose-200">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 font-vedic">
            Restricted Management Console
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            This module manages store inventories, orders, pricing, and fulfillment. Access is strictly restricted to authorized administrator accounts.
          </p>
        </div>

        {user ? (
          <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs space-y-2 text-stone-700 shadow-2xs">
            <p className="text-[11px] text-stone-400">Current Logged-in Account:</p>
            <p className="font-bold text-stone-900">{user.email || 'Anonymous'}</p>
            <p className="text-rose-700 font-semibold">
              This email is not authorized for Store Admin operations.
            </p>
            <button
              onClick={() => signOut()}
              className="mt-2 text-xs font-bold text-rose-800 hover:underline cursor-pointer"
            >
              Sign Out & Switch Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-amber-50 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In with Admin Google Account</span>
            </button>

            <button
              onClick={navigateToHome}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Store</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* Top Admin Bar */}
      <div className="border-b border-amber-900/15 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-200 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-stone-900 font-vedic">
                    Astronava Store Operations
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Cloud SQL PostgreSQL (asia-southeast1) • Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs text-stone-600 hidden sm:inline">
                {user?.email}
              </span>

              <button
                onClick={navigateToHome}
                className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Storefront</span>
              </button>

              <button
                onClick={() => signOut()}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 border-t border-stone-100 text-xs font-bold">
            <button
              onClick={() => setActiveAdminTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'dashboard'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Dashboard Metrics
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'products'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Products Management
            </button>

            <button
              onClick={() => setActiveAdminTab('orders')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'orders'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Orders & Shipping
            </button>

            <button
              onClick={() => setActiveAdminTab('inventory')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'inventory'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Inventory Tracking
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Tab 1: Dashboard Overview */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-semibold">Total Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-amber-950 font-mono">
                  ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-stone-400">Lifetime gross revenue</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono">
                  {metrics?.totalOrders ?? 0}
                </div>
                <p className="text-[10px] text-stone-400">Consecrated parcels</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-semibold">Active Catalog</span>
                  <Package className="w-4 h-4 text-amber-800" />
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono">
                  {metrics?.totalProducts ?? 0}
                </div>
                <p className="text-[10px] text-stone-400">Published SKUs</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-semibold">Low Stock</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-900 font-mono">
                  {metrics?.lowStock ?? 0}
                </div>
                <p className="text-[10px] text-stone-400">Needs replenishment</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-semibold">Out of Stock</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-900 font-mono">
                  {metrics?.outOfStock ?? 0}
                </div>
                <p className="text-[10px] text-stone-400">Unavailable items</p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 font-vedic">
                  Recent Consecrated Orders
                </h3>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-100/75 text-[11px] font-bold text-stone-800 uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">Order</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {!metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-stone-400">
                          No recent orders recorded.
                        </td>
                      </tr>
                    ) : (
                      metrics.recentOrders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50/80">
                          <td className="px-5 py-3 font-mono font-bold text-stone-900">
                            {o.orderNumber}
                          </td>
                          <td className="px-5 py-3">
                            <div className="font-bold text-stone-900">{o.customerName}</div>
                            <div className="text-[11px] text-stone-400">{o.customerEmail}</div>
                          </td>
                          <td className="px-5 py-3 font-bold text-amber-950">
                            ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-5 py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD */}
        {activeAdminTab === 'products' && token && (
          <AdminProductsTab token={token} categories={categories} />
        )}

        {/* Tab 3: Orders Management */}
        {activeAdminTab === 'orders' && token && <AdminOrdersTab token={token} />}

        {/* Tab 4: Inventory Tracking */}
        {activeAdminTab === 'inventory' && token && <AdminInventoryTab token={token} />}
      </div>
    </div>
  );
};
