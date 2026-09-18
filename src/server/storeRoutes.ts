import { Router, Request, Response } from 'express';
import {
  seedStoreIfEmpty,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductPublish,
  getInventoryItems,
  updateInventoryStock,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAdminMetrics,
  validateCouponCode,
} from './storeDb.ts';
import { requireAdmin, AuthRequest, isAllowedAdminEmail } from '../middleware/auth.ts';

export const storeRouter = Router();

// =============================================================
// PUBLIC STORE ENDPOINTS
// =============================================================

// Ensure database is seeded with initial Vedic catalog
storeRouter.get('/seed', async (req: Request, res: Response) => {
  try {
    const result = await seedStoreIfEmpty();
    res.json(result);
  } catch (error: any) {
    console.error('Store seed endpoint failed:', error);
    res.status(500).json({ error: error.message || 'Failed to seed store' });
  }
});

// Categories list
storeRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const cats = await getAllCategories();
    res.json(cats);
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: error.message || 'Failed to load categories' });
  }
});

// Products catalog with filtering, sorting, pagination, and search
storeRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const {
      categorySlug,
      planet,
      zodiac,
      certification,
      minPrice,
      maxPrice,
      inStockOnly,
      search,
      sortBy,
      isFeatured,
      isBestSeller,
      isNewArrival,
      page,
      limit,
    } = req.query;

    const result = await getProducts({
      categorySlug: categorySlug ? String(categorySlug) : undefined,
      planet: planet ? String(planet) : undefined,
      zodiac: zodiac ? String(zodiac) : undefined,
      certification: certification ? String(certification) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly === 'true' || inStockOnly === '1',
      search: search ? String(search) : undefined,
      sortBy: sortBy as any,
      isFeatured: isFeatured === 'true',
      isBestSeller: isBestSeller === 'true',
      isNewArrival: isNewArrival === 'true',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Failed to query products:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
});

// Product detail by slug
storeRouter.get('/products/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const product = await getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    console.error('Failed to get product detail:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch product' });
  }
});

// Validate Coupon
storeRouter.post('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    const subtotal = Number(req.body.subtotal ?? req.body.orderTotal ?? 0);
    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }
    const result = await validateCouponCode(code, subtotal);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to validate coupon:', error);
    res.status(500).json({ error: error.message || 'Coupon validation failed' });
  }
});

// Create Order (Checkout)
storeRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if (!payload.customer || !payload.items || payload.items.length === 0) {
      return res.status(400).json({ error: 'Incomplete order payload' });
    }

    const order = await createOrder(payload);
    res.status(201).json(order);
  } catch (error: any) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message || 'Failed to complete order' });
  }
});

// Get single order confirmation by ID
storeRouter.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error: any) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve order' });
  }
});

// =============================================================
// ADMIN PROTECTED ENDPOINTS
// =============================================================

export const adminRouter = Router();

// Check if authenticated user has admin access
adminRouter.get('/check', requireAdmin, (req: AuthRequest, res: Response) => {
  res.json({
    authorized: true,
    email: req.user?.email,
    displayName: req.user?.name || req.user?.email,
  });
});

// Admin dashboard summary metrics
adminRouter.get('/metrics', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const metrics = await getAdminMetrics();
    res.json(metrics);
  } catch (error: any) {
    console.error('Failed to load admin metrics:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate metrics' });
  }
});

// Admin products list (with drafts)
adminRouter.get('/products', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { search, page, limit, sortBy, categorySlug } = req.query;
    const result = await getProducts({
      includeDrafts: true,
      search: search ? String(search) : undefined,
      categorySlug: categorySlug ? String(categorySlug) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
      sortBy: sortBy as any,
    });
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get admin products:', error);
    res.status(500).json({ error: error.message || 'Failed to query products' });
  }
});

// Admin create product
adminRouter.post('/products', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { product, images, variations } = req.body;
    if (!product || !product.name?.trim() || product.price === undefined || product.price === '') {
      return res.status(400).json({ error: 'Product name and price are mandatory.' });
    }

    const created = await createProduct(product, images || [], variations || []);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// Admin update product
adminRouter.put('/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { product, images, variations } = req.body;
    const updated = await updateProduct(id, product, images, variations);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

// Admin delete product
adminRouter.delete('/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteProduct(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// Admin toggle product publish status
adminRouter.patch('/products/:id/toggle-publish', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await toggleProductPublish(id);
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to toggle product status:', error);
    res.status(500).json({ error: error.message || 'Failed to toggle status' });
  }
});

// Admin inventory overview and item list
adminRouter.get('/inventory', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const items = await getInventoryItems();
    res.json(items);
  } catch (error: any) {
    console.error('Failed to get inventory:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch inventory' });
  }
});

// Admin update inventory stock
adminRouter.put('/inventory', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, variationId, stockQuantity, lowStockThreshold } = req.body;
    if (productId === undefined || stockQuantity === undefined) {
      return res.status(400).json({ error: 'productId and stockQuantity are required' });
    }

    const updated = await updateInventoryStock(
      Number(productId),
      variationId ? Number(variationId) : null,
      Number(stockQuantity),
      lowStockThreshold !== undefined ? Number(lowStockThreshold) : undefined
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update inventory:', error);
    res.status(500).json({ error: error.message || 'Failed to update inventory' });
  }
});

// Admin orders management list
adminRouter.get('/orders', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page, limit } = req.query;
    const orders = await getOrders({
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 25,
    });
    res.json(orders);
  } catch (error: any) {
    console.error('Failed to get admin orders:', error);
    res.status(500).json({ error: error.message || 'Failed to load orders' });
  }
});

// Admin update order status
adminRouter.patch('/orders/:id/status', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await updateOrderStatus(id, status);
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});

// Admin category management
adminRouter.post('/categories', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const created = await createCategory(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create category:', error);
    res.status(500).json({ error: error.message || 'Failed to create category' });
  }
});

adminRouter.put('/categories/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateCategory(id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update category:', error);
    res.status(500).json({ error: error.message || 'Failed to update category' });
  }
});

adminRouter.delete('/categories/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteCategory(id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ error: error.message || 'Failed to delete category' });
  }
});
