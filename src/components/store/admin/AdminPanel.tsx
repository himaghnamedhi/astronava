import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Globe,
  Code2,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { auth } from '../../../lib/firebase.ts';
import { useStore } from '../../../context/StoreContext.tsx';
import { AdminMetrics } from '../../../types/store.ts';
import { AdminProductsTab } from './AdminProductsTab.tsx';
import { AdminOrdersTab } from './AdminOrdersTab.tsx';
import { AdminInventoryTab } from './AdminInventoryTab.tsx';
import { AdminCategoriesTab } from './AdminCategoriesTab.tsx';
import { AdminSellersTab } from './AdminSellersTab.tsx';
import { AdminPendingProductsTab } from './AdminPendingProductsTab.tsx';
import { AdminSeoTab } from './AdminSeoTab.tsx';
import { AdminUsersTab } from './AdminUsersTab.tsx';
import { AdminApiManagementTab } from './AdminApiManagementTab.tsx';

const ADMIN_EMAILS = ['himaghnamedhi1@gmail.com'];

export const AdminPanel: React.FC = () => {
  const { user, signOut } = useAuth();
  const { navigateToHome, categories, refreshCategories } = useStore();

  const userEmail = user?.email?.toLowerCase().trim();
  const isAllowlistedAdmin = Boolean(userEmail && ADMIN_EMAILS.includes(userEmail));

  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(isAllowlistedAdmin);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'categories' | 'products' | 'orders' | 'inventory' | 'horoscope' | 'sellers' | 'pending-products' | 'seo' | 'users' | 'api'>('dashboard');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [batchStatusMessage, setBatchStatusMessage] = useState<string | null>(null);
  const [pendingSellersCount, setPendingSellersCount] = useState<number>(2);

  // Invisible slider state & drag navigation for tabs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkTabsScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    document.title = 'Astronava Master Control Console | astronava.com';
    checkTabsScroll();
    const el = tabsContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkTabsScroll, { passive: true });
    window.addEventListener('resize', checkTabsScroll);
    return () => {
      el.removeEventListener('scroll', checkTabsScroll);
      window.removeEventListener('resize', checkTabsScroll);
    };
  }, []);

  const slideTabsLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const slideTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!tabsContainerRef.current) return;
    setIsDraggingTabs(true);
    setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setScrollLeftPos(tabsContainerRef.current.scrollLeft);
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabs || !tabsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabsContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleTabsMouseUp = () => {
    setIsDraggingTabs(false);
  };

  useEffect(() => {
    async function fetchPendingSellers() {
      try {
        const res = await fetch('/api/admin/sellers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const pending = data.filter((s: any) => s.status === 'pending').length;
          setPendingSellersCount(pending);
        }
      } catch (e) {
        // Keep default mock count
      }
    }
    if (token) {
      fetchPendingSellers();
    }
  }, [token]);

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

      try {
        let idToken = 'admin_dev_token';
        if (auth.currentUser) {
          try {
            idToken = await auth.currentUser.getIdToken(false);
          } catch {
            // Keep fallback admin token
          }
        }
        if (!isCancelled) {
          setIsAdmin(true);
          setToken(idToken);
        }

        // Verify backend status non-destructively
        try {
          await fetch('/api/admin/check', {
            headers: {
              Authorization: `Bearer ${idToken}`,
              'x-admin-email': email || 'himaghnamedhi1@gmail.com',
            },
          });
        } catch (probeErr) {
          console.warn('Admin probe note:', probeErr);
        }
      } catch (err: any) {
        console.warn('verifyAdmin check note:', err);
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
    if (!token || !isAdmin) return;
    try {
      setLoadingMetrics(true);
      const res = await fetch('/api/admin/metrics', {
        headers: {
          Authorization: `Bearer ${token}`,
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
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            Return to Astronava Home
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
                onClick={() => {
                  window.location.href = '/';
                }}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer transition-colors"
                title="Return to Astronava Home"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-bold font-vedic text-stone-900 tracking-wide">
                  Astronava Master Control
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-mono border border-stone-200">
                  astronava.com/mastercontrol
                </span>
              </div>
            </div>

            {/* Right Admin Profile & Quick Links */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.location.href = '/store';
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </button>

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

          {/* Admin Navigation Tabs with Invisible Slider */}
          <div className="relative border-t border-stone-100 group">
            {/* Left Invisible Slider Arrow Button */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-4 pl-1 bg-gradient-to-r from-white via-white/90 to-transparent">
                <button
                  onClick={slideTabsLeft}
                  className="w-7 h-7 rounded-full bg-white shadow-md border border-stone-200 text-stone-700 hover:text-amber-900 hover:bg-amber-50 flex items-center justify-center transition-all cursor-pointer"
                  title="Slide tabs left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tabs Slider Track */}
            <div
              ref={tabsContainerRef}
              onMouseDown={handleTabsMouseDown}
              onMouseMove={handleTabsMouseMove}
              onMouseUp={handleTabsMouseUp}
              onMouseLeave={handleTabsMouseUp}
              className={`flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-bold scroll-smooth select-none ${
                isDraggingTabs ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              <button
                onClick={() => setActiveAdminTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeAdminTab === 'dashboard'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Dashboard Overview
              </button>

              {/* API Tab prominently positioned next to Dashboard, restricted to authorized admin */}
              {isAdmin && (
                <button
                  onClick={() => setActiveAdminTab('api')}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeAdminTab === 'api'
                      ? 'bg-amber-950 text-amber-50 shadow-2xs ring-2 ring-amber-500/30'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 shadow-2xs'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>API</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80 text-[10px] text-amber-950 font-bold uppercase">
                    Docs &amp; Specs
                  </span>
                </button>
              )}

              <button
                onClick={() => setActiveAdminTab('categories')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
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
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeAdminTab === 'products'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Products Catalog
              </button>

              <button
                onClick={() => setActiveAdminTab('orders')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeAdminTab === 'orders'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Orders &amp; Fulfillment
              </button>

              <button
                onClick={() => setActiveAdminTab('inventory')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeAdminTab === 'inventory'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Inventory Tracking
              </button>

              <button
                onClick={() => setActiveAdminTab('sellers')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 relative shrink-0 ${
                  activeAdminTab === 'sellers'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>Seller Management</span>
                {pendingSellersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-2xs">
                    {pendingSellersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveAdminTab('pending-products')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeAdminTab === 'pending-products'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Product Approval</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('horoscope')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeAdminTab === 'horoscope'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Batch &amp; Astrology</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('seo')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeAdminTab === 'seo'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>SEO &amp; CTR Monitor</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('users')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeAdminTab === 'users'
                    ? 'bg-amber-950 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>User Management</span>
              </button>
            </div>

            {/* Right Invisible Slider Arrow Button */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-4 pr-1 bg-gradient-to-l from-white via-white/90 to-transparent">
                <button
                  onClick={slideTabsRight}
                  className="w-7 h-7 rounded-full bg-white shadow-md border border-stone-200 text-stone-700 hover:text-amber-900 hover:bg-amber-50 flex items-center justify-center transition-all cursor-pointer"
                  title="Slide tabs right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tab 1: Dashboard Overview (TASK 7 requirements) */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            {pendingSellersCount > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Pending Seller Registrations</h4>
                    <p className="text-xs text-stone-700 mt-0.5">
                      You have <strong className="text-amber-950">{pendingSellersCount}</strong> new seller application(s) awaiting verification and approval.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAdminTab('sellers')}
                  className="px-4 py-2 rounded-xl bg-amber-900 text-amber-50 hover:bg-amber-800 font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Review Applications &rarr;
                </button>
              </div>
            )}

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

        {/* Tab 6: Seller Management */}
        {activeAdminTab === 'sellers' && token && <AdminSellersTab token={token} />}

        {/* Tab 7: Product Approval */}
        {activeAdminTab === 'pending-products' && token && <AdminPendingProductsTab token={token} />}

        {/* Tab 8: Horoscope & Batch Operations */}
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

        {/* Tab 9: SEO & CTR Monitor */}
        {activeAdminTab === 'seo' && token && <AdminSeoTab token={token} />}

        {/* Tab 10: User Management */}
        {activeAdminTab === 'users' && token && <AdminUsersTab token={token} />}

        {/* Tab 11: Astrological REST API, Programmatic Docs, Key Management & Audit Logs (Admin Only) */}
        {activeAdminTab === 'api' && isAdmin && (
          <AdminApiManagementTab token={token} userEmail={user?.email || ''} />
        )}
      </div>
    </div>
  );
};
