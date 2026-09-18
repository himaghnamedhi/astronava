import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Categories table supporting hierarchical structure
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  parentId: integer('parent_id'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'categoryHierarchy',
  }),
  children: many(categories, {
    relationName: 'categoryHierarchy',
  }),
  products: many(products),
}));

// Products table with comprehensive astrological and e-commerce attributes
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  brand: text('brand').default('Astronava Vedic Authentics').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  sku: text('sku').notNull().unique(),
  stock: integer('stock').default(0).notNull(),
  weight: text('weight'),
  tags: text('tags'), // Comma-separated or search tags
  planet: text('planet'), // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
  zodiac: text('zodiac'), // Aries, Taurus, Gemini, etc.
  certification: text('certification'), // IGI Certified, Lab Certified, Vedic Blessed
  benefits: text('benefits'), // Astrological and healing benefits
  specifications: text('specifications'), // Origin, Hardness, Carat/Ratti, etc. (JSON or formatted text)
  careInstructions: text('care_instructions'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isNewArrival: boolean('is_new_arrival').default(false).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  variations: many(productVariations),
  inventory: many(inventory),
  orderItems: many(orderItems),
}));

// Product Variations table (e.g. Color, Carat / Ratti, Mukhi, Metal Type)
export const productVariations = pgTable('product_variations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  variationType: text('variation_type').notNull(), // 'color', 'carat', 'mukhi', 'metal'
  variationValue: text('variation_value').notNull(), // 'Royal Green', '5.25 Ratti', '8 Mukhi'
  sku: text('sku').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  stock: integer('stock').default(0).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productVariationsRelations = relations(productVariations, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariations.productId],
    references: [products.id],
  }),
  images: many(productImages),
  inventory: many(inventory),
  orderItems: many(orderItems),
}));

// Product Images table supporting gallery, variation linkage, and drag reordering
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  variationId: integer('variation_id').references(() => productVariations.id, { onDelete: 'set null' }),
  url: text('url').notNull(),
  altText: text('alt_text'),
  displayOrder: integer('display_order').default(0).notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variation: one(productVariations, {
    fields: [productImages.variationId],
    references: [productVariations.id],
  }),
}));

// Inventory management table
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  variationId: integer('variation_id').references(() => productVariations.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull(),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  variation: one(productVariations, {
    fields: [inventory.variationId],
    references: [productVariations.id],
  }),
}));

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  uid: text('uid'), // Firebase Auth UID if authenticated
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(), // e.g. ASTRO-2026-XXXX
  customerId: integer('customer_id').references(() => customers.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  shippingAmount: numeric('shipping_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  couponCode: text('coupon_code'),
  paymentStatus: text('payment_status').default('Pending').notNull(), // 'Pending', 'Paid', 'Failed'
  paymentMethod: text('payment_method').default('Online Payment (Demo Gateway)').notNull(),
  orderStatus: text('order_status').default('Pending').notNull(), // 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

// Order Items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  variationId: integer('variation_id').references(() => productVariations.id),
  productName: text('product_name').notNull(),
  variantName: text('variant_name'),
  sku: text('sku').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variation: one(productVariations, {
    fields: [orderItems.variationId],
    references: [productVariations.id],
  }),
}));

// Coupons table (future-ready promotions)
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(), // 'percentage', 'fixed'
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric('min_order_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  maxDiscount: numeric('max_discount', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  usageLimit: integer('usage_limit'),
  timesUsed: integer('times_used').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
