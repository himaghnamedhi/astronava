import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product } from '../../types/store.ts';
import { StoreProductCard } from './StoreProductCard.tsx';

const PLANETS = [
  'Sun (Surya)',
  'Moon (Chandra)',
  'Mars (Mangal)',
  'Mercury (Budh)',
  'Jupiter (Brihaspati)',
  'Venus (Shukra)',
  'Saturn (Shani)',
  'Rahu',
  'Ketu',
];

const ZODIACS = [
  'Aries (Mesha)',
  'Taurus (Vrishabha)',
  'Gemini (Mithuna)',
  'Cancer (Karka)',
  'Leo (Simha)',
  'Virgo (Kanya)',
  'Libra (Tula)',
  'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)',
  'Capricorn (Makara)',
  'Aquarius (Kumbha)',
  'Pisces (Meena)',
];

const CERTIFICATIONS = [
  'IGI Certified',
  'Govt. Lab Certified',
  'Authentic Natural Mineral',
  'Vedic Certified',
];

export const StoreShop: React.FC = () => {
  const { shopFilters, setShopFilters, categories } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local search query with debounce
  const [searchQuery, setSearchQuery] = useState(shopFilters.search || '');

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    let isCancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (shopFilters.categorySlug) params.set('categorySlug', shopFilters.categorySlug);
        if (shopFilters.planet) params.set('planet', shopFilters.planet);
        if (shopFilters.zodiac) params.set('zodiac', shopFilters.zodiac);
        if (shopFilters.certification) params.set('certification', shopFilters.certification);
        if (shopFilters.minPrice) params.set('minPrice', String(shopFilters.minPrice));
        if (shopFilters.maxPrice) params.set('maxPrice', String(shopFilters.maxPrice));
        if (shopFilters.inStockOnly) params.set('inStockOnly', 'true');
        if (shopFilters.search) params.set('search', shopFilters.search);
        if (shopFilters.sortBy) params.set('sortBy', shopFilters.sortBy);
        params.set('page', String(currentPage));
        params.set('limit', '12');

        const res = await fetch(`/api/store/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setProducts(data.items || []);
            setTotalCount(data.total || 0);
            setTotalPages(data.totalPages || 1);
          }
        }
      } catch (err) {
        console.error('Failed to query products catalog:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [shopFilters, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setShopFilters((prev) => ({ ...prev, search: searchQuery }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setShopFilters({
      sortBy: 'popular',
    });
  };

  const activeFiltersCount = [
    shopFilters.categorySlug,
    shopFilters.planet,
    shopFilters.zodiac,
    shopFilters.certification,
    shopFilters.minPrice,
    shopFilters.maxPrice,
    shopFilters.inStockOnly,
    shopFilters.search,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4 border-b border-stone-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Store Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic tracking-tight">
              {shopFilters.categorySlug
                ? `${shopFilters.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Collection`
                : 'All Vedic Products'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {totalCount} authentic consecrated items
              {shopFilters.search && ` matching "${shopFilters.search}"`}
            </p>
          </div>

          {/* Sort & Mobile Trigger Controls */}
          <div className="flex items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={shopFilters.sortBy || 'popular'}
                onChange={(e) => {
                  setCurrentPage(1);
                  setShopFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
                }}
                className="bg-transparent font-medium focus:outline-none cursor-pointer pr-2"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Consecrated</option>
              </select>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold cursor-pointer shadow-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>
        </div>

        {/* Dedicated Search Bar */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-2 sm:p-2.5 shadow-2xs space-y-2.5">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by name, stone, deity, or mukhi (e.g., Blue Sapphire, 7 Mukhi, Pyrite)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs sm:text-sm bg-[#FAF8F5] focus:bg-white text-stone-900 placeholder:text-stone-400 transition-colors"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShopFilters((prev) => ({ ...prev, search: '' }));
                  }}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Search Suggestion Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-400 shrink-0">Trending:</span>
            {['Blue Sapphire', '7 Mukhi Rudraksha', 'Pyrite Cluster', 'Sri Yantra', 'Amethyst Mala', 'Emerald'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSearchQuery(item);
                  setCurrentPage(1);
                  setShopFilters((prev) => ({ ...prev, search: item }));
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-600 transition-colors shrink-0 cursor-pointer font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
              Filter by Category:
            </span>
            {shopFilters.categorySlug && (
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setShopFilters((prev) => ({ ...prev, categorySlug: undefined }));
                }}
                className="text-amber-900 hover:text-amber-950 text-xs font-semibold underline cursor-pointer"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => {
                setCurrentPage(1);
                setShopFilters((prev) => ({ ...prev, categorySlug: undefined }));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                !shopFilters.categorySlug
                  ? 'bg-amber-950 text-amber-100 shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>All Products</span>
            </button>

            {categories.map((cat) => {
              const isSelected = shopFilters.categorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCurrentPage(1);
                    setShopFilters((prev) => ({
                      ...prev,
                      categorySlug: isSelected ? undefined : cat.slug,
                    }));
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-950 text-amber-100 shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filter Controls (In Stock, Price Ranges, Reset) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* In Stock Only Pill */}
            <button
              onClick={() => {
                setCurrentPage(1);
                setShopFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                shopFilters.inStockOnly
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  shopFilters.inStockOnly ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              />
              <span>In Stock Only</span>
            </button>

            {/* Quick Price Range Pills */}
            {[
              { label: 'Under ₹2,000', min: undefined, max: 2000 },
              { label: '₹2,000 - ₹10,000', min: 2000, max: 10000 },
              { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
              { label: '₹25,000+', min: 25000, max: undefined },
            ].map((bracket, idx) => {
              const isMatch =
                shopFilters.minPrice === bracket.min && shopFilters.maxPrice === bracket.max;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage(1);
                    if (isMatch) {
                      setShopFilters((prev) => ({
                        ...prev,
                        minPrice: undefined,
                        maxPrice: undefined,
                      }));
                    } else {
                      setShopFilters((prev) => ({
                        ...prev,
                        minPrice: bracket.min,
                        maxPrice: bracket.max,
                      }));
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    isMatch
                      ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs font-bold'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {bracket.label}
                </button>
              );
            })}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>

        {/* Active Applied Filters Strip */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 mr-1">Active Filters:</span>

            {shopFilters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <span>Search: "{shopFilters.search}"</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShopFilters((prev) => ({ ...prev, search: '' }));
                  }}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {shopFilters.categorySlug && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <span>Category: {shopFilters.categorySlug}</span>
                <button
                  onClick={() =>
                    setShopFilters((prev) => ({ ...prev, categorySlug: undefined }))
                  }
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {shopFilters.planet && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <span>Planet: {shopFilters.planet}</span>
                <button
                  onClick={() => setShopFilters((prev) => ({ ...prev, planet: undefined }))}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(shopFilters.minPrice || shopFilters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <span>
                  Price: ₹{shopFilters.minPrice || 0} - {shopFilters.maxPrice ? `₹${shopFilters.maxPrice}` : 'Above'}
                </span>
                <button
                  onClick={() =>
                    setShopFilters((prev) => ({
                      ...prev,
                      minPrice: undefined,
                      maxPrice: undefined,
                    }))
                  }
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {shopFilters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span>In Stock Only</span>
                <button
                  onClick={() => setShopFilters((prev) => ({ ...prev, inStockOnly: false }))}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-2xs space-y-6 sticky top-32">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <SlidersHorizontal className="w-4 h-4 text-amber-800" />
                <span>Filter Options</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Category
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setShopFilters((prev) => ({ ...prev, categorySlug: undefined }));
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    !shopFilters.categorySlug
                      ? 'bg-amber-100/70 font-bold text-amber-950'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCurrentPage(1);
                      setShopFilters((prev) => ({ ...prev, categorySlug: cat.slug }));
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      shopFilters.categorySlug === cat.slug
                        ? 'bg-amber-100/70 font-bold text-amber-950'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Planet Filter */}
            <div className="space-y-2.5 border-t border-stone-100 pt-4">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Ruling Planet (Graha)
              </h4>
              <select
                value={shopFilters.planet || ''}
                onChange={(e) => {
                  setCurrentPage(1);
                  setShopFilters((prev) => ({
                    ...prev,
                    planet: e.target.value || undefined,
                  }));
                }}
                className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">All Planets</option>
                {PLANETS.map((p) => {
                  const baseName = p.split(' ')[0];
                  return (
                    <option key={p} value={baseName}>
                      {p}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Zodiac Filter */}
            <div className="space-y-2.5 border-t border-stone-100 pt-4">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Zodiac (Rashi)
              </h4>
              <select
                value={shopFilters.zodiac || ''}
                onChange={(e) => {
                  setCurrentPage(1);
                  setShopFilters((prev) => ({
                    ...prev,
                    zodiac: e.target.value || undefined,
                  }));
                }}
                className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">All Zodiacs</option>
                {ZODIACS.map((z) => {
                  const baseName = z.split(' ')[0];
                  return (
                    <option key={z} value={baseName}>
                      {z}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2.5 border-t border-stone-100 pt-4">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Price Range (₹)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-stone-500">Min Price</label>
                  <input
                    type="number"
                    placeholder="₹ 500"
                    value={shopFilters.minPrice || ''}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setShopFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }));
                    }}
                    className="w-full p-2 rounded-lg border border-stone-200 text-xs bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500">Max Price</label>
                  <input
                    type="number"
                    placeholder="₹ 50000"
                    value={shopFilters.maxPrice || ''}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setShopFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }));
                    }}
                    className="w-full p-2 rounded-lg border border-stone-200 text-xs bg-[#FAF8F5]"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="border-t border-stone-100 pt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(shopFilters.inStockOnly)}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setShopFilters((prev) => ({
                      ...prev,
                      inStockOnly: e.target.checked,
                    }));
                  }}
                  className="rounded text-amber-800 focus:ring-amber-500 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Catalog Grid & Content */}
        <main className="md:col-span-3 space-y-6">
          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs">
              <span className="font-semibold text-amber-950 text-[11px]">Active Filters:</span>
              {shopFilters.categorySlug && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs">
                  <span>Category: {shopFilters.categorySlug}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setShopFilters((prev) => ({ ...prev, categorySlug: undefined }))}
                  />
                </span>
              )}
              {shopFilters.planet && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs">
                  <span>Planet: {shopFilters.planet}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setShopFilters((prev) => ({ ...prev, planet: undefined }))}
                  />
                </span>
              )}
              {shopFilters.zodiac && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs">
                  <span>Zodiac: {shopFilters.zodiac}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setShopFilters((prev) => ({ ...prev, zodiac: undefined }))}
                  />
                </span>
              )}
              {shopFilters.inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs">
                  <span>In Stock</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => setShopFilters((prev) => ({ ...prev, inStockOnly: false }))}
                  />
                </span>
              )}
              {shopFilters.search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs">
                  <span>"{shopFilters.search}"</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-rose-600"
                    onClick={() => {
                      setSearchQuery('');
                      setShopFilters((prev) => ({ ...prev, search: '' }));
                    }}
                  />
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-amber-900 hover:underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Loading / Empty / Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-stone-200 p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-square bg-stone-200 rounded-xl" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-8 bg-stone-200 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mx-auto">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No items match your criteria</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range or clearing some filters to explore our full collection.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold hover:bg-amber-800 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <StoreProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                Page <span className="font-bold text-stone-900">{currentPage}</span> of{' '}
                <span className="font-bold text-stone-900">{totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 150, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-amber-900 text-amber-50'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 150, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#FAF8F5] p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="text-sm font-bold text-stone-900">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-stone-800 uppercase mb-2">Category</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setShopFilters((p) => ({ ...p, categorySlug: undefined }))}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                        !shopFilters.categorySlug ? 'bg-amber-100 font-bold' : ''
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setShopFilters((p) => ({ ...p, categorySlug: c.slug }))}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                          shopFilters.categorySlug === c.slug ? 'bg-amber-100 font-bold' : ''
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Planet */}
                <div>
                  <h4 className="text-xs font-bold text-stone-800 uppercase mb-2">Planet</h4>
                  <select
                    value={shopFilters.planet || ''}
                    onChange={(e) =>
                      setShopFilters((p) => ({ ...p, planet: e.target.value || undefined }))
                    }
                    className="w-full text-xs p-2 rounded border border-stone-300"
                  >
                    <option value="">All</option>
                    {PLANETS.map((pl) => (
                      <option key={pl} value={pl.split(' ')[0]}>
                        {pl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold cursor-pointer"
                >
                  Apply Filters ({totalCount} items)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
