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
  User
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { SellerSalesOverview } from './SellerSalesOverview.tsx';
import { SellerInventoryTab } from './SellerInventoryTab.tsx';
import { SellerBulkImportTab } from './SellerBulkImportTab.tsx';

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
        return <div className="text-stone-600">Welcome to your {activeTab} section. Content coming soon.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile/Tablet Header for Navigation */}
      <div className="md:hidden bg-white border-b border-stone-200 p-4 flex justify-between items-center">
        <h1 className="text-lg font-black font-vedic text-stone-950">Seller Portal</h1>
        {/* Add a menu toggle button here in a real scenario */}
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-stone-200 p-6 flex-col">
        <h1 className="text-xl font-black font-vedic text-stone-950 mb-10">Seller Portal</h1>
        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === item.name 
                ? 'bg-amber-100 text-amber-950' 
                : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
        <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-rose-600 font-bold hover:bg-rose-50 rounded-xl">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-950 font-vedic">{activeTab}</h2>
            <p className="text-sm md:text-base text-stone-500">Business: Vedic Treasures Pvt Ltd</p>
          </div>
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs md:text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Verified & Active
          </div>
        </header>
        
        {renderContent()}
      </div>
    </div>
  );
};
