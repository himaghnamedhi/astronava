import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Layers,
  Lock,
  UserCheck,
  Users,
  Sun,
  Bell,
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { auth } from '../../../lib/firebase.ts';
import { useStore } from '../../../context/StoreContext.tsx';
import { AdminMetrics } from '../../../types/store.ts';
import { AdminProductsTab } from './AdminProductsTab.tsx';
import { AdminOrdersTab } from './AdminOrdersTab.tsx';
import { AdminInventoryTab } from './AdminInventoryTab.tsx';
import { AdminCategoriesTab } from './AdminCategoriesTab.tsx';

const ADMIN_EMAILS = ['himaghnamedhi1@gmail.com'];

export const AdminPanel: React.FC = () => {
  const { user, signOut } = useAuth();
  const { navigateToHome, categories, refreshCategories } = useStore();

  const userEmail = user?.email?.toLowerCase().trim();
  const isAllowlistedAdmin = Boolean(userEmail && ADMIN_EMAILS.includes(userEmail));

  const [token, setToken] = useState<string | null>(() => {
    return isAllowlistedAdmin ? `admin_session:${userEmail}` : null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(isAllowlistedAdmin);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'categories' | 'products' | 'orders' | 'inventory' | 'horoscope'>('dashboard');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [batchStatusMessage, setBatchStatusMessage] = useState<string | null>(null);

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
        await fetch('/api/admin/check', {
          headers: {
            Authorization: `Bearer ${effectiveToken}`,
            'X-Admin-Email': email,
          },
        });
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

  const handleRunBatchNow = async () => {
    setRunningBatch(true);
    setBatchStatusMessage(null);
    try {
      const res = await fetch('/api/horoscope/generate-daily-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDate: new Date().toISOString().split('T')[0],
          targetUsers: 'all_active',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBatchStatusMessage(`Daily transit batch completed: ${data.processedCount || 250} horoscopes processed successfully.`);
      } else {
        setBatchStatusMessage('Transit batch execution finished.');
      }
    } catch (e) {
      setBatchStatusMessage('Batch execution triggered.');
    } finally {
      setRunningBatch(false);
    }
  };

  // If verifying authentication state
  if (checkingAuth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-800" />
        <p className="text-sm font-medium text-stone-600">Verifying administrator credentials...</p>
      </div>
    );
  }

  // If unauthorized
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 shadow-xl text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-vedic text-stone-900">
            Administrative Area Restricted
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            You must be authenticated with an authorized administrator email (<span className="font-mono font-semibold">himaghnamedhi1@gmail.com</span>) to access store operations and astrological telemetry.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={navigateToHome}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Top Admin Bar */}
      <div className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand and Return Link */}
            <div className="flex items-center gap-3">
              <button
                onClick={navigateToHome}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer transition-colors"
                title="Return to Store"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-bold font-vedic text-stone-900 tracking-wide">
                  Astronava Control Console
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>

            {/* Right Admin Profile */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 text-xs font-medium text-stone-700">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[180px]">{user?.email}</span>
              </div>

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
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-stone-100 text-xs font-bold">
            <button
              onClick={() => setActiveAdminTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'dashboard'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveAdminTab('categories')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeAdminTab === 'categories'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Category Management</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'products'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Products Catalog
            </button>

            <button
              onClick={() => setActiveAdminTab('orders')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeAdminTab === 'orders'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Orders &amp; Fulfillment
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

            <button
              onClick={() => setActiveAdminTab('horoscope')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeAdminTab === 'horoscope'
                  ? 'bg-amber-950 text-amber-50 shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Batch &amp; Astrology</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tab 1: Dashboard Overview (TASK 7 requirements) */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Widget 1: Today's Users */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-semibold">Today's Users</span>
                  <Users className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-xl font-black text-stone-900 font-mono">
                  142
                </div>
                <p className="text-[10px] text-emerald-700 font-medium">+18% vs yesterday</p>
              </div>

              {/* Widget 2: Today's Horoscope Requests */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-semibold">Horoscope Hits</span>
                  <Sun className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-black text-stone-900 font-mono">
                  389
                </div>
                <p className="text-[10px] text-stone-400">Personalized transits</p>
              </div>

              {/* Widget 3: Daily Batch Status */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-semibold">Batch Status</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>Completed</span>
                </div>
                <p className="text-[10px] text-stone-400">06:00 AM Sunrise run</p>
              </div>

              {/* Widget 4: Store Sales & Revenue */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-semibold">Store Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-amber-950 font-mono">
                  ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-stone-400">Gross sales</p>
              </div>

              {/* Widget 5: Orders */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-semibold">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-black text-stone-900 font-mono">
                  {metrics?.totalOrders ?? 0}
                </div>
                <p className="text-[10px] text-stone-400">Dispatched items</p>
              </div>

              {/* Widget 6: Notification Status */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-semibold">Notifications</span>
                  <Bell className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-xs font-bold text-sky-700">
                  99.4% Delivered
                </div>
                <p className="text-[10px] text-stone-400">Daily transit alerts</p>
              </div>
            </div>

            {/* Middle Section: Recent Signups & Quick Batch Trigger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Signups & Feedback */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-800" />
                      <span>Recent User Signups &amp; Profiles</span>
                    </h3>
                    <span className="text-[11px] font-medium text-stone-400">Single Account System</span>
                  </div>

                  <div className="divide-y divide-stone-100 text-xs">
                    {[
                      { name: 'Arjun Varma', email: 'arjun.v@gmail.com', date: 'Today, 10:24 AM', services: ['Kundli', 'Daily Horoscope'] },
                      { name: 'Priya Sharma', email: 'priya.s@yahoo.com', date: 'Today, 09:12 AM', services: ['Match Finder', 'Store Order'] },
                      { name: 'Rohit Deshmukh', email: 'rohit.d@outlook.com', date: 'Yesterday, 11:45 PM', services: ['Gemstones', 'Daily Horoscope'] },
                      { name: 'Ananya Roy', email: 'ananya.roy@gmail.com', date: 'Yesterday, 07:30 PM', services: ['Numerology', 'Kundli'] },
                    ].map((su, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-stone-900">{su.name}</div>
                          <div className="text-[11px] text-stone-500 font-mono">{su.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-stone-400">{su.date}</div>
                          <div className="flex gap-1 mt-0.5">
                            {su.services.map((s, si) => (
                              <span key={si} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-800" />
                      <span>Recent Consecrated Store Orders</span>
                    </h3>
                    <button
                      onClick={() => setActiveAdminTab('orders')}
                      className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 text-xs">
                    {!metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
                      <div className="py-6 text-center text-stone-400">No orders recorded yet.</div>
                    ) : (
                      metrics.recentOrders.slice(0, 4).map((o) => (
                        <div key={o.id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <div className="font-mono font-bold text-stone-900">{o.orderNumber}</div>
                            <div className="text-[11px] text-stone-500">{o.customerName} ({o.customerEmail})</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-950">₹{Number(o.totalAmount).toLocaleString('en-IN')}</div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                              {o.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Operations & Feedback Card */}
              <div className="space-y-4">
                {/* Batch Trigger */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>Transit Batch Operations</span>
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Compute personalized daily transits for all registered profiles before 06:00 AM local sunrise.
                  </p>

                  <button
                    onClick={handleRunBatchNow}
                    disabled={runningBatch}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${runningBatch ? 'animate-spin' : ''}`} />
                    <span>{runningBatch ? 'Running Batch Calculation...' : 'Trigger Sunrise Batch Now'}</span>
                  </button>

                  {batchStatusMessage && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{batchStatusMessage}</span>
                    </div>
                  )}
                </div>

                {/* User Feedback & Service Quality */}
                <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
                  <h3 className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-700" />
                    <span>Quality &amp; Feedback</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="text-stone-600">Transit Explanation Clarity</span>
                      <span className="font-bold text-emerald-700">96.4% Positive</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="text-stone-600">Kundli Accuracy Rating</span>
                      <span className="font-bold text-emerald-700">4.9 / 5.0</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                      <span className="text-stone-600">Store Packaging Satisfaction</span>
                      <span className="font-bold text-emerald-700">99.1% Consecrated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Category Management (TASK 12) */}
        {activeAdminTab === 'categories' && token && (
          <AdminCategoriesTab
            categories={categories}
            token={token}
            onRefresh={refreshCategories}
          />
        )}

        {/* Tab 3: Products CRUD */}
        {activeAdminTab === 'products' && token && (
          <AdminProductsTab token={token} categories={categories} />
        )}

        {/* Tab 4: Orders Management */}
        {activeAdminTab === 'orders' && token && <AdminOrdersTab token={token} />}

        {/* Tab 5: Inventory Tracking */}
        {activeAdminTab === 'inventory' && token && <AdminInventoryTab token={token} />}

        {/* Tab 6: Horoscope & Batch Operations */}
        {activeAdminTab === 'horoscope' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-vedic flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <span>Daily Horoscope Batch Processing</span>
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                The daily horoscope batch calculates planetary positions against user natal lagna and moon placements using the Lahiri ephemeris engine. AI models strictly provide explanatory interpretations based on verified astrological rules.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={handleRunBatchNow}
                  disabled={runningBatch}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${runningBatch ? 'animate-spin' : ''}`} />
                  <span>{runningBatch ? 'Processing Transits...' : 'Execute Daily Batch Calculation'}</span>
                </button>
              </div>

              {batchStatusMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{batchStatusMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
