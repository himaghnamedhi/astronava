import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  RotateCw,
  ShoppingBag,
  FileText,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { Order } from '../../types/store.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';

interface StoreOrderHistoryProps {
  onBrowseStore?: () => void;
}

export const StoreOrderHistory: React.FC<StoreOrderHistoryProps> = ({ onBrowseStore }) => {
  const { user, openAuthModal } = useAuth();
  const { addToCart, navigateToShop, navigateToProduct } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status and search filtering
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Guest lookup state
  const [guestLookupInput, setGuestLookupInput] = useState<string>('');
  const [guestLookupLoading, setGuestLookupLoading] = useState<boolean>(false);
  const [guestLookupResult, setGuestLookupResult] = useState<Order | null>(null);
  const [guestLookupError, setGuestLookupError] = useState<string | null>(null);

  // Copied order number feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        email: user.email.trim(),
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await fetch(`/api/store/orders/my-orders?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load your past orders');
      }

      const data = await res.json();
      setOrders(data.items || []);
    } catch (err: any) {
      console.error('Error fetching customer orders:', err);
      setError(err.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  }, [user?.email, statusFilter, searchQuery]);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user?.email, fetchOrders]);

  // Handle guest lookup by order number or email
  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestLookupInput.trim()) return;

    try {
      setGuestLookupLoading(true);
      setGuestLookupError(null);
      setGuestLookupResult(null);

      const cleanInput = guestLookupInput.trim();

      // Check if it's an email or order number
      if (cleanInput.includes('@')) {
        const res = await fetch(`/api/store/orders/my-orders?email=${encodeURIComponent(cleanInput)}`);
        if (!res.ok) throw new Error('No orders found for this email address');
        const data = await res.json();
        if (!data.items || data.items.length === 0) {
          throw new Error('No orders associated with this email address');
        }
        setOrders(data.items);
      } else {
        const res = await fetch(`/api/store/orders/track/${encodeURIComponent(cleanInput)}`);
        if (!res.ok) throw new Error('Order not found with provided reference number');
        const data = await res.json();
        setGuestLookupResult(data);
      }
    } catch (err: any) {
      setGuestLookupError(err.message || 'Unable to track order');
    } finally {
      setGuestLookupLoading(false);
    }
  };

  const copyOrderNumber = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedId(orderNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart({
        id: `${item.productId}-${item.variationId || 'base'}`,
        productId: item.productId,
        variationId: item.variationId,
        productName: item.productName,
        variantName: item.variantName,
        slug: `product-${item.productId}`,
        sku: item.sku,
        price: parseFloat(item.price) || 0,
        originalPrice: null,
        quantity: item.quantity || 1,
        imageUrl:
          item.imageUrl ||
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        stock: 10,
      });
    });
  };

  // Helper for visual stepper
  const getStepStatus = (
    currentStatus: string,
    step: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered'
  ) => {
    const sequence = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(step);

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* If Not Signed In: Guest Lookup & Sign In Banner */}
      {!user && (
        <div className="rounded-3xl bg-gradient-to-br from-amber-950/5 via-amber-900/5 to-stone-900/5 border border-amber-900/15 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Track Your Consignment</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-vedic">
                Order Tracking & Purchase History
              </h2>
              <p className="text-xs text-stone-600 max-w-lg">
                Sign in with your Google account to automatically view all your consecrated purchases, or enter your order reference below.
              </p>
            </div>

            <button
              onClick={() => openAuthModal('Sign in to view your complete order history')}
              className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In with Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Guest Lookup Form */}
          <form onSubmit={handleGuestLookup} className="space-y-3 pt-4 border-t border-amber-900/10">
            <label className="block text-xs font-bold text-stone-800">
              Quick Order Lookup (Order Number or Email)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="e.g. ASTRO-2026-4892 or your-email@gmail.com"
                  value={guestLookupInput}
                  onChange={(e) => setGuestLookupInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs bg-white text-stone-900"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={guestLookupLoading || !guestLookupInput.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-950 hover:bg-stone-900 disabled:opacity-40 text-amber-100 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
              >
                {guestLookupLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <Truck className="w-4 h-4 text-amber-400" />
                )}
                <span>Track Order</span>
              </button>
            </div>

            {guestLookupError && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{guestLookupError}</span>
              </p>
            )}
          </form>
        </div>
      )}

      {/* Guest Single Order Result Display */}
      {guestLookupResult && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Found Order Record:</span>
            <button
              onClick={() => setGuestLookupResult(null)}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              Clear Result
            </button>
          </div>
          <OrderCard
            order={guestLookupResult}
            onReorder={() => handleReorder(guestLookupResult)}
            onCopy={copyOrderNumber}
            copiedId={copiedId}
            onViewProduct={navigateToProduct}
            getStepStatus={getStepStatus}
          />
        </div>
      )}

      {/* Authenticated User Filters & Controls */}
      {user && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'Confirmed', label: 'Confirmed' },
              { id: 'Processing', label: 'Consecrating' },
              { id: 'Shipped', label: 'In Transit' },
              { id: 'Delivered', label: 'Delivered' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-amber-900 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input inside Orders */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Search by order # or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-stone-800"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={fetchOrders}
              title="Refresh orders"
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-700' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Orders List / Loading / Empty */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="h-5 bg-stone-200 rounded w-1/3" />
                <div className="h-5 bg-stone-200 rounded w-20" />
              </div>
              <div className="h-16 bg-stone-100 rounded-xl" />
              <div className="h-8 bg-stone-200 rounded w-1/4 ml-auto" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-xs text-rose-800 font-medium">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white border border-stone-200/80 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 mx-auto shadow-2xs">
            <Package className="w-8 h-8 opacity-70" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900 font-vedic">No Orders Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'No past purchases match your current search and filter criteria.'
                : 'You have not placed any orders yet. Once you complete a purchase, you can monitor live Vedic energization and shipping status right here.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => (onBrowseStore ? onBrowseStore() : navigateToShop())}
              className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Vedic Collection</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReorder={() => handleReorder(order)}
              onCopy={copyOrderNumber}
              copiedId={copiedId}
              onViewProduct={navigateToProduct}
              getStepStatus={getStepStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Subcomponent: Individual Order Card
interface OrderCardProps {
  order: Order;
  onReorder: () => void;
  onCopy: (orderNum: string) => void;
  copiedId: string | null;
  onViewProduct: (slug: string) => void;
  getStepStatus: (status: string, step: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered') => string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onReorder,
  onCopy,
  copiedId,
  onViewProduct,
  getStepStatus,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    Pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Confirmed: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    Processing: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
    Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    Cancelled: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  };

  const currentStatusStyle = statusColors[order.orderStatus] || statusColors.Confirmed;
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/60">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Order Reference
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-stone-900 font-mono">
                {order.orderNumber}
              </span>
              <button
                onClick={() => onCopy(order.orderNumber)}
                title="Copy order number"
                className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                {copiedId === order.orderNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-200 hidden sm:block" />

          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Placed On
            </span>
            <span className="text-xs font-semibold text-stone-700">{formattedDate}</span>
          </div>

          <div className="h-6 w-px bg-stone-200 hidden sm:block" />

          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-xs font-extrabold text-amber-950">
              ₹{Number(order.totalAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStatusStyle.bg} ${currentStatusStyle.text} ${currentStatusStyle.border} flex items-center gap-1.5`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{order.orderStatus}</span>
          </span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="px-4 sm:px-6 py-5 border-b border-stone-100 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Connecting Bar */}
            <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-stone-200 -z-0" />

            {[
              { label: 'Confirmed', step: 'Confirmed' as const, desc: 'Payment verified' },
              { label: 'Energization', step: 'Processing' as const, desc: 'Prana Pratishtha' },
              { label: 'Dispatched', step: 'Shipped' as const, desc: 'With insured courier' },
              { label: 'Delivered', step: 'Delivered' as const, desc: 'To your doorstep' },
            ].map((item, idx) => {
              const status = getStepStatus(order.orderStatus, item.step);
              return (
                <div key={idx} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      status === 'completed'
                        ? 'bg-amber-900 text-amber-50 shadow-2xs'
                        : status === 'cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-white border-2 border-stone-300 text-stone-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-stone-800 mt-1.5">
                    {item.label}
                  </span>
                  <span className="text-[9px] text-stone-400 hidden sm:block max-w-[80px]">
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4 sm:p-5 space-y-3">
        {order.items && order.items.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-stone-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                      {item.productName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      {item.variantName && (
                        <span className="px-1.5 py-0.2 bg-stone-100 rounded text-stone-700 font-medium text-[10px]">
                          {item.variantName}
                        </span>
                      )}
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-stone-400">SKU: {item.sku}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-extrabold text-amber-950">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic py-2">Item details unavailable</p>
        )}

        {/* Expandable Order Details (Shipping, Payment Method) */}
        {detailsOpen && (
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F5]/80 p-4 rounded-xl">
            <div>
              <span className="font-bold text-stone-800 flex items-center gap-1.5 mb-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Shipping Destination:</span>
              </span>
              <p className="text-stone-600 leading-relaxed pl-5">
                {order.customerName}
                <br />
                {order.shippingAddress}
                <br />
                {order.city}, {order.state} - {order.pinCode}
                <br />
                <span className="text-stone-500">Phone: {order.customerPhone}</span>
              </p>
            </div>

            <div>
              <span className="font-bold text-stone-800 flex items-center gap-1.5 mb-1 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>Payment & Breakdown:</span>
              </span>
              <div className="space-y-1 text-stone-600 pl-5">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-semibold capitalize text-stone-800">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Amount:</span>
                  <span>₹{order.shippingAmount || '0'}</span>
                </div>
                {order.couponCode && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon ({order.couponCode}):</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setDetailsOpen((prev) => !prev)}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            <span>{detailsOpen ? 'Hide Shipping Details' : 'View Full Details & Address'}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform ${detailsOpen ? 'rotate-90' : ''}`}
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReorder}
              className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Re-order Items</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
