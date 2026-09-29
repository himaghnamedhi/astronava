import React, { useState } from 'react';
import { SellerWelcomePage } from './SellerWelcomePage';
import { SellerRegistrationPage } from './SellerRegistrationPage';
import { SellerDashboard } from './SellerDashboard';
import { SellerInventoryTab } from './SellerInventoryTab';
import { useAuth } from '../../../context/AuthContext';
import { Store, LayoutDashboard, Package, ShoppingBag, LogOut, Sparkles, Truck, CheckCircle, Clock, Download, ArrowUp, Shield, FileText, AlertCircle, Compass } from 'lucide-react';

interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  itemSummary: string;
  total: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}

export const SellerPortalRoot: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'register' | 'dashboard' | 'products' | 'orders'>('welcome');
  const { user, openAuthModal, signOut } = useAuth();
  
  const [orders, setOrders] = useState<SellerOrder[]>([
    { id: '1', orderNumber: 'ASTRO-2026-8901', customerName: 'Aarav Sharma', itemSummary: 'Certified Natural Blue Sapphire (Neelam)', total: '45,000.00', status: 'Pending', date: '2026-09-28' },
    { id: '2', orderNumber: 'ASTRO-2026-8902', customerName: 'Priya Patel', itemSummary: 'Original Panchmukhi Rudraksha Mala', total: '2,100.00', status: 'Shipped', date: '2026-09-27' },
    { id: '3', orderNumber: 'ASTRO-2026-8903', customerName: 'Vikramaditya Roy', itemSummary: 'Conscious Energized Sri Yantra', total: '3,500.00', status: 'Delivered', date: '2026-09-25' },
  ]);

  const handleSignIn = () => {
    if (user) {
      setView('dashboard');
    } else {
      openAuthModal('Sign in to access your Astronava Seller Portal account');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Pending' | 'Shipped' | 'Delivered') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDownloadCsv = () => {
    const headers = ['Order Number', 'Customer Name', 'Item Summary', 'Total (INR)', 'Status', 'Date'];
    const rows = orders.map(o => [
      `"${o.orderNumber}"`,
      `"${o.customerName}"`,
      `"${o.itemSummary.replace(/"/g, '""')}"`,
      `"${o.total}"`,
      `"${o.status}"`,
      `"${o.date}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `astronava_seller_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'register') {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5]">
        <SellerRegistrationPage onBack={() => setView('welcome')} />
        <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 py-8 px-6 text-center text-xs">
          &copy; {new Date().getFullYear()} Astronava. Official Vedic Merchant Network.
        </footer>
      </div>
    );
  }

  if (view === 'dashboard' || view === 'products' || view === 'orders' || user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
        {/* Branded Navigation Header */}
        <div>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black font-vedic text-stone-950">Order Management &amp; Fulfillment</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Manage customer orders, track fulfillment states, and export order history.</p>
                  </div>
                  <button
                    onClick={handleDownloadCsv}
                    className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>
                </div>

                <div className="overflow-hidden border border-stone-200 rounded-2xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-xs">
                      <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total (₹)</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-t border-stone-100 hover:bg-stone-50/50">
                          <td className="p-4 font-mono font-bold text-stone-900">{order.orderNumber}</td>
                          <td className="p-4 text-stone-800 font-medium">{order.customerName}</td>
                          <td className="p-4 text-stone-600 text-xs max-w-xs truncate">{order.itemSummary}</td>
                          <td className="p-4 font-mono font-semibold text-stone-900">₹{order.total}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : order.status === 'Shipped' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                              {order.status === 'Shipped' && <Truck className="w-3.5 h-3.5" />}
                              {order.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={order.status}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value as any)}
                              className="p-2 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800/20 cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <SellerDashboard />
            )}
          </main>
        </div>

        {/* Unified Footer */}
        <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-12 sm:mt-16 pt-8 sm:pt-12 pb-6 sm:pb-8 w-full max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 box-border">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Col 1: About */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView('dashboard')}>
                  <img
                    src="/icons/app_logo.svg"
                    alt="Astronava Logo"
                    className="w-6 h-6 rounded-md ring-1 ring-amber-400/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xl font-bold font-vedic text-white tracking-wider">ASTRONAVA</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  A modern Vedic astrology platform built on open-source technologies, using classical Vedic astrology principles and structured calculations to generate Kundli analysis, gemstone recommendations, and compatibility reports.
                </p>
              </div>

              {/* Col 2: Tools */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Astrological Tools</h4>
                <ul className="space-y-2 text-xs text-stone-400">
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=horoscope';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">1.</span>
                      <span>Personalized Daily Horoscope</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=generator';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">2.</span>
                      <span>Kundli Maker &amp; Janam Patrika</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=builder';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">3.</span>
                      <span>Kundli Builder &amp; Visualizer</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=gemstones';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">4.</span>
                      <span>Find Gemstone You Need</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=match';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">5.</span>
                      <span>Match Finder (Kundli Milan)</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=numerology';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">6.</span>
                      <span>Numerology Calculator</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=name-correction';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">7.</span>
                      <span>Vedic Name Correction</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?tab=store';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">8.</span>
                      <span>Store</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 3: Legal & Policies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Legal &amp; Policies</h4>
                <ul className="space-y-2 text-xs text-stone-400">
                  <li>
                    <a
                      href="/?view=seller&legal=privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/?privacy=true';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Privacy Policy</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/?view=seller&legal=terms"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/?terms=true';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Terms &amp; Conditions</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/?view=seller&legal=disclaimer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/?disclaimer=true';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Disclaimer</span>
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        window.location.href = '/?sitemap=true';
                      }}
                      className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                    >
                      <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Sitemap &amp; Index</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 4: Contact Us */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">
                  <a
                    href="/?contact=true"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/?contact=true';
                    }}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </a>
                </h4>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-6 sm:pt-8 border-t border-stone-800 flex flex-col items-center justify-center text-xs text-stone-400 gap-4 sm:gap-6 relative">
              <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-stone-400">
                <a
                  href="/?privacy=true"
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
                <span>&bull;</span>
                <a
                  href="/?terms=true"
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </a>
                <span>&bull;</span>
                <a
                  href="/?disclaimer=true"
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Disclaimer
                </a>
                <span>&bull;</span>
                <a
                  href="/?contact=true"
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Contact Us
                </a>
                <span>&bull;</span>
                <a
                  href="/?tab=store"
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Store
                </a>
                <span>&bull;</span>
                <a
                  href="/?sitemap=true"
                  className="hover:text-amber-400 transition-colors cursor-pointer font-medium"
                >
                  Sitemap
                </a>

              </div>

              <p className="text-center w-full max-w-sm sm:max-w-none">
                © {new Date().getFullYear()} <strong className="text-stone-200">Astronava</strong>. Developed by{' '}
                <a
                  href="https://x.com/himaghnamedhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
                >
                  Himaghna Medhi
                </a>
              </p>

              <div className="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-center group">
                <button
                  onClick={scrollToTop}
                  className="w-10 h-10 rounded-full bg-stone-800 hover:bg-amber-900/80 text-amber-400 hover:text-amber-300 flex items-center justify-center border border-stone-700 hover:border-amber-500/50 shadow-md hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  title="Back to Top"
                >
                  <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                </button>
              </div>
            </div>

          </div>
        </footer>
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
