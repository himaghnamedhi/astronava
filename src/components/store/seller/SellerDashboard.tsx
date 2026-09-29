import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Boxes, 
  Upload, 
  ShoppingBag, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Store
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { SellerSalesOverview } from './SellerSalesOverview';
import { SellerInventoryTab } from './SellerInventoryTab';
import { SellerBulkImportTab } from './SellerBulkImportTab';

export const SellerDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Sales', icon: TrendingUp },
    { name: 'Products', icon: Package },
    { name: 'Inventory', icon: Boxes },
    { name: 'Bulk Import', icon: Upload },
    { name: 'Orders', icon: ShoppingBag },
    { name: 'Verification', icon: ShieldCheck },
    { name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Sales':
        return <SellerSalesOverview />;
      case 'Inventory':
        return <SellerInventoryTab token="demo" />;
      case 'Bulk Import':
        return <SellerBulkImportTab token="demo" />;
      default:
        return (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-xl font-bold text-stone-900 font-vedic">{activeTab} Management</h3>
            <p className="text-sm text-stone-600">Welcome to your {activeTab} control center. All listings and verification statuses are synchronized with the Astronava admin network.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      {/* Mobile/Tablet Header for Navigation */}
      <div className="md:hidden bg-white border-b border-stone-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-900" />
          <h1 className="text-base font-black font-vedic text-stone-950">Seller Portal</h1>
        </div>
        <button onClick={() => signOut()} className="text-rose-600 p-2" title="Log Out">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-stone-200 p-6 flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black font-vedic text-stone-950">Seller Portal</h1>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Verified Merchant</span>
            </div>
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === item.name 
                  ? 'bg-amber-100/80 text-amber-950 shadow-2xs' 
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-rose-600 font-bold text-xs hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-950 font-vedic">{activeTab}</h2>
            <p className="text-xs md:text-sm text-stone-500 mt-0.5">Business: Vedic Treasures Pvt Ltd • GSTIN: 22AAAAA0000A1Z5</p>
          </div>
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Verified &amp; Active
          </div>
        </header>
        
        {renderContent()}
      </div>
    </div>
  );
};
