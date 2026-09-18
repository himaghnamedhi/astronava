import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  GripVertical,
  Star,
} from 'lucide-react';
import { Category, Product, ProductVariation, ProductImage } from '../../../types/store.ts';

interface AdminProductModalProps {
  productToEdit?: Product | null;
  categories: Category[];
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  productToEdit,
  categories,
  token,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: categories[0]?.id || 1,
    brand: 'Astronava Vedic Authentics',
    shortDescription: '',
    fullDescription: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: 10,
    weight: '',
    tags: '',
    planet: '',
    zodiac: '',
    certification: 'IGI Certified',
    benefits: '',
    specifications: '',
    careInstructions: '',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isPublished: true,
  });

  const [images, setImages] = useState<Array<{ url: string; altText: string; isPrimary: boolean }>>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [variations, setVariations] = useState<
    Array<{
      variationType: string;
      variationValue: string;
      sku: string;
      price: string;
      stock: number;
      imageUrl: string;
    }>
  >([]);

  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'variations' | 'vedic'>('details');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on edit
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        slug: productToEdit.slug,
        categoryId: productToEdit.categoryId,
        brand: productToEdit.brand || 'Astronava Vedic Authentics',
        shortDescription: productToEdit.shortDescription || '',
        fullDescription: productToEdit.fullDescription || '',
        price: productToEdit.price || '',
        salePrice: productToEdit.salePrice || '',
        sku: productToEdit.sku || '',
        stock: productToEdit.stock || 0,
        weight: productToEdit.weight || '',
        tags: productToEdit.tags || '',
        planet: productToEdit.planet || '',
        zodiac: productToEdit.zodiac || '',
        certification: productToEdit.certification || 'IGI Certified',
        benefits: productToEdit.benefits || '',
        specifications: productToEdit.specifications || '',
        careInstructions: productToEdit.careInstructions || '',
        isFeatured: Boolean(productToEdit.isFeatured),
        isBestSeller: Boolean(productToEdit.isBestSeller),
        isNewArrival: Boolean(productToEdit.isNewArrival),
        isPublished: Boolean(productToEdit.isPublished),
      });

      if (productToEdit.images && productToEdit.images.length > 0) {
        setImages(
          productToEdit.images.map((img) => ({
            url: img.url,
            altText: img.altText || '',
            isPrimary: img.isPrimary,
          }))
        );
      } else if (productToEdit.primaryImage) {
        setImages([
          { url: productToEdit.primaryImage, altText: productToEdit.name, isPrimary: true },
        ]);
      } else {
        setImages([]);
      }

      if (productToEdit.variations && productToEdit.variations.length > 0) {
        setVariations(
          productToEdit.variations.map((v) => ({
            variationType: v.variationType,
            variationValue: v.variationValue,
            sku: v.sku,
            price: v.price || '',
            stock: v.stock || 0,
            imageUrl: v.imageUrl || '',
          }))
        );
      } else {
        setVariations([]);
      }
    } else {
      // Default reset
      setFormData({
        name: '',
        slug: '',
        categoryId: categories[0]?.id || 1,
        brand: 'Astronava Vedic Authentics',
        shortDescription: '',
        fullDescription: '',
        price: '4999',
        salePrice: '',
        sku: `ASTRO-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: 15,
        weight: '5.25 Ratti',
        tags: 'Vedic, Gemstone, Certified',
        planet: 'Sun',
        zodiac: 'Leo',
        certification: 'IGI Certified',
        benefits: 'Promotes planetary balance and confidence.',
        specifications: '100% natural, unheated.',
        careInstructions: 'Wear on Sunday morning after mantra chanting.',
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isPublished: true,
      });
      setImages([
        {
          url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
          altText: 'Primary Image',
          isPrimary: true,
        },
      ]);
      setVariations([]);
    }
  }, [productToEdit, categories]);

  if (!isOpen) return null;

  const handleSlugGenerate = () => {
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((p) => ({ ...p, slug }));
  };

  const handleAddImage = (urlToAdd?: string) => {
    const targetUrl = urlToAdd || newImageUrl.trim();
    if (!targetUrl) return;
    setImages((prev) => [
      ...prev,
      {
        url: targetUrl,
        altText: formData.name || 'Product Image',
        isPrimary: prev.length === 0,
      },
    ]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleAddVariation = () => {
    setVariations((prev) => [
      ...prev,
      {
        variationType: 'Color',
        variationValue: 'Deep Amber',
        sku: `${formData.sku}-V${prev.length + 1}`,
        price: formData.price,
        stock: 5,
        imageUrl: images[0]?.url || '',
      },
    ]);
  };

  const handleRemoveVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku) {
      setError('Name, SKU, and Price are mandatory.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const endpoint = productToEdit
        ? `/api/admin/products/${productToEdit.id}`
        : '/api/admin/products';
      const method = productToEdit ? 'PUT' : 'POST';

      const payload = {
        product: {
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
          price: String(formData.price),
          salePrice: formData.salePrice ? String(formData.salePrice) : null,
          stock: Number(formData.stock),
          categoryId: Number(formData.categoryId),
        },
        images: images.map((img, idx) => ({
          url: img.url,
          altText: img.altText,
          displayOrder: idx,
          isPrimary: img.isPrimary,
        })),
        variations: variations.map((v) => ({
          variationType: v.variationType,
          variationValue: v.variationValue,
          sku: v.sku,
          price: v.price ? String(v.price) : null,
          stock: Number(v.stock),
          imageUrl: v.imageUrl || null,
        })),
      };

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Save product failed:', err);
      setError(err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-3xl border border-amber-900/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 font-vedic">
              {productToEdit ? `Edit Product: ${productToEdit.name}` : 'Add New Product'}
            </h2>
            <p className="text-xs text-stone-500">
              Manage product data, gallery, variations, and Vedic classifications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 px-6 gap-3 text-xs font-bold">
          {[
            { id: 'details', label: '1. General & Pricing' },
            { id: 'images', label: `2. Gallery Images (${images.length})` },
            { id: 'variations', label: `3. Variations (${variations.length})` },
            { id: 'vedic', label: '4. Astrological / Vedic Details' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 transition-colors relative cursor-pointer ${
                activeTab === tab.id
                  ? 'text-amber-900'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-900" />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Body Form */}
        <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: General & Pricing */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Title <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onBlur={() => !formData.slug && handleSlugGenerate()}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    placeholder="e.g. Natural Untreated Yellow Sapphire (Pukhraj)"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-800">URL Slug</label>
                    <button
                      type="button"
                      onClick={handleSlugGenerate}
                      className="text-[10px] text-amber-800 hover:underline cursor-pointer"
                    >
                      Generate from Name
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                    placeholder="natural-yellow-sapphire"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    SKU Code <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Regular Price (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Sale Price (₹) (Optional Discount)
                  </label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Inventory Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Weight / Carats / Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    placeholder="e.g. 5.25 Ratti (4.8 Carats)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  placeholder="Concise summary shown on product cards and cart..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  placeholder="In-depth narrative of mineral source, visual clarity, cut, luster, and authenticity..."
                />
              </div>

              {/* Status Toggles */}
              <div className="pt-2 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-800">Published (Live)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-800">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-800">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-stone-800">New Arrival</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Images Gallery */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Add image URL bar */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-800">
                  Add Image by Direct URL or Preset
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="px-4 py-2 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold hover:bg-amber-800 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                </div>

                {/* Quick Unsplash Sacred Preset Buttons */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-stone-600">
                  <span className="font-bold text-stone-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddImage(
                        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 cursor-pointer"
                  >
                    + Yellow Gem
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddImage(
                        'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 cursor-pointer"
                  >
                    + Blue Sapphire
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddImage(
                        'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 cursor-pointer"
                  >
                    + Rudraksha Beads
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddImage(
                        'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=800&q=80'
                      )
                    }
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 cursor-pointer"
                  >
                    + Amethyst Cluster
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Product Image List ({images.length})
                </h4>
                {images.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-stone-300 rounded-2xl text-center text-xs text-stone-500">
                    No images added yet. Add an image URL above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-2xl overflow-hidden border-2 bg-white p-2 space-y-2 ${
                          img.isPrimary ? 'border-amber-700 shadow-md' : 'border-stone-200'
                        }`}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                          <img
                            src={img.url}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              img.isPrimary
                                ? 'bg-amber-800 text-amber-50'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {img.isPrimary ? 'Primary' : 'Make Primary'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Variations */}
          {activeTab === 'variations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Product Variations (Color, Carat, Mukhi, Metal, Size)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Allows customers to choose options with dynamic pricing, SKUs, and stock tracking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariation}
                  className="px-3 py-1.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold hover:bg-amber-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variation</span>
                </button>
              </div>

              {variations.length === 0 ? (
                <div className="p-8 border border-stone-200 bg-white rounded-2xl text-center text-xs text-stone-500">
                  No variations configured. This product is sold as a single standard unit.
                </div>
              ) : (
                <div className="space-y-3">
                  {variations.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs grid grid-cols-1 sm:grid-cols-6 gap-3 items-center text-xs"
                    >
                      <div>
                        <label className="text-[10px] text-stone-500 block mb-0.5">Type</label>
                        <select
                          value={v.variationType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariations((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, variationType: val } : item
                              )
                            );
                          }}
                          className="w-full p-1.5 rounded border border-stone-300 text-xs bg-stone-50"
                        >
                          <option value="Color">Color</option>
                          <option value="Carat">Carat / Ratti</option>
                          <option value="Mukhi">Mukhi</option>
                          <option value="Metal">Metal Ring</option>
                          <option value="Size">Bead Size</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-stone-500 block mb-0.5">Value / Name</label>
                        <input
                          type="text"
                          value={v.variationValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariations((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, variationValue: val } : item
                              )
                            );
                          }}
                          className="w-full p-1.5 rounded border border-stone-300 text-xs"
                          placeholder="e.g. 22K Gold Ring (7 Ratti)"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-500 block mb-0.5">Variant SKU</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                            );
                          }}
                          className="w-full p-1.5 rounded border border-stone-300 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-500 block mb-0.5">Stock</label>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setVariations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, stock: val } : item))
                            );
                          }}
                          className="w-full p-1.5 rounded border border-stone-300 text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                        <input
                          type="number"
                          placeholder="₹ Price"
                          value={v.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariations((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                            );
                          }}
                          className="w-full p-1.5 rounded border border-stone-300 text-xs font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariation(idx)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Astrological & Vedic Details */}
          {activeTab === 'vedic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Ruling Planet (Graha)
                  </label>
                  <input
                    type="text"
                    value={formData.planet}
                    onChange={(e) => setFormData({ ...formData, planet: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    placeholder="e.g. Jupiter (Guru), Saturn (Shani)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Zodiac (Rashi) Resonance
                  </label>
                  <input
                    type="text"
                    value={formData.zodiac}
                    onChange={(e) => setFormData({ ...formData, zodiac: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    placeholder="e.g. Sagittarius, Pisces"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Certification Authority
                  </label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    placeholder="e.g. IGI Certified / Govt. Lab"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Astrological Benefits (Parashari Jyotish)
                </label>
                <textarea
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  placeholder="Planetary aura alignment, career, wisdom, relationship harmony..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Gemological Specifications & Origin
                </label>
                <textarea
                  rows={2}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  placeholder="Mined in Ceylon/Madagascar, Specific Gravity 4.0, Refractive Index..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Prana Pratishtha & Wearing Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  placeholder="Purify in Gangajal and raw cow milk on Thursday morning before 8 AM. Chant ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः 108 times."
                />
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : productToEdit ? 'Update Product' : 'Save New Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
