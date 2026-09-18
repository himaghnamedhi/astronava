export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
  displayOrder: number;
  createdAt: string;
  subcategories?: Category[];
}

export interface ProductVariation {
  id: number;
  productId: number;
  variationType: string; // 'color' | 'carat' | 'mukhi' | 'metal' | 'size'
  variationValue: string;
  sku: string;
  price?: string | null;
  salePrice?: string | null;
  stock: number;
  imageUrl?: string | null;
}

export interface ProductImage {
  id: number;
  productId: number;
  variationId?: number | null;
  url: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  brand: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  salePrice?: string | null;
  sku: string;
  stock: number;
  weight?: string | null;
  tags?: string | null;
  planet?: string | null;
  zodiac?: string | null;
  certification?: string | null;
  benefits?: string | null;
  specifications?: string | null;
  careInstructions?: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  createdAt: string;
  primaryImage?: string;
  images?: ProductImage[];
  variations?: ProductVariation[];
  relatedProducts?: Partial<Product>[];
}

export interface CartItem {
  id: string; // unique item id: `${productId}-${variationId || 'base'}`
  productId: number;
  variationId?: number | null;
  productName: string;
  variantName?: string | null;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number | null;
  quantity: number;
  imageUrl: string;
  stock: number;
}

export interface WishlistItem {
  id: string;
  userId?: string;
  productId: number;
  productSlug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string;
  categoryName?: string;
  inStock?: boolean;
  createdAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variationId?: number | null;
  productName: string;
  variantName?: string | null;
  sku: string;
  price: string;
  quantity: number;
  imageUrl?: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pinCode: string;
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  totalAmount: string;
  couponCode?: string | null;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  variationId?: number | null;
  variationValue?: string | null;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface AdminMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  outOfStock: number;
  lowStock: number;
  recentOrders: Order[];
}
