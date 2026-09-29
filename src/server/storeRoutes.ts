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
  getOrderByOrderNumber,
  updateOrderStatus,
  getAdminMetrics,
  validateCouponCode,
  listSellers,
  updateSellerStatus,
  getPendingProducts,
  updateProductStatus,
  getSellerInventoryItems,
  getProductSellerId,
} from './storeDb.ts';
import { requireAdmin, AuthRequest, requireSeller } from '../middleware/auth.ts';

export const storeRouter = Router();
export const adminRouter = Router();

// Store/Customer endpoints
storeRouter.get('/categories', async (_req: Request, res: Response) => {
  res.json(await getAllCategories());
});

storeRouter.get('/products', async (req: Request, res: Response) => {
  const { categorySlug, search, planet, zodiac, certification, minPrice, maxPrice, sortBy, page, limit } = req.query;
  const products = await getProducts({
    categorySlug: categorySlug as string,
    search: search as string,
    planet: planet as string,
    zodiac: zodiac as string,
    certification: certification as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy as any,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 12,
  });
  res.json(products);
});

storeRouter.get('/products/:slug', async (req: Request, res: Response) => {
  const product = await getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

storeRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

storeRouter.get('/orders/:orderNumber', async (req: Request, res: Response) => {
  const order = await getOrderByOrderNumber(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

storeRouter.post('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    const result = await validateCouponCode(code, subtotal);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Seller inventory overview and item list
storeRouter.get('/inventory', requireSeller, async (req: Request, res: Response) => {
  try {
    const seller = (req as any).seller;
    const items = await getSellerInventoryItems(seller.id);
    res.json(items);
  } catch (error: any) {
    console.error('Failed to get seller inventory:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch inventory' });
  }
});

// Seller update inventory stock
storeRouter.put('/inventory', requireSeller, async (req: Request, res: Response) => {
  try {
    const seller = (req as any).seller;
    const { productId, variationId, stockQuantity, lowStockThreshold } = req.body;
    
    // Security Check: Verify seller owns the product
    const productSellerId = await getProductSellerId(Number(productId));
    if (productSellerId !== seller.id) {
        return res.status(403).json({ error: 'Forbidden: You do not own this product' });
    }

    const updated = await updateInventoryStock(
      Number(productId),
      variationId ? Number(variationId) : null,
      Number(stockQuantity),
      lowStockThreshold !== undefined ? Number(lowStockThreshold) : undefined
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Failed to update seller inventory:', error);
    res.status(500).json({ error: error.message || 'Failed to update inventory' });
  }
});

// Admin endpoints
adminRouter.get('/metrics', requireAdmin, async (_req: AuthRequest, res: Response) => {
  res.json(await getAdminMetrics());
});

adminRouter.get('/products', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { search, categorySlug, page, limit, includeDrafts } = req.query;
  const products = await getProducts({
    search: search as string,
    categorySlug: categorySlug as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 25,
    includeDrafts: includeDrafts === 'true',
  });
  res.json(products);
});

adminRouter.post('/products', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { productData, imagesData, variationsData } = req.body;
    const created = await createProduct(productData, imagesData, variationsData);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { productData, imagesData, variationsData } = req.body;
    const updated = await updateProduct(Number(req.params.id), productData, imagesData, variationsData);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await deleteProduct(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.patch('/products/:id/toggle-publish', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await toggleProductPublish(Number(req.params.id));
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get('/inventory', requireAdmin, async (_req: AuthRequest, res: Response) => {
  res.json(await getInventoryItems());
});

adminRouter.put('/inventory', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, variationId, stockQuantity, lowStockThreshold } = req.body;
    const updated = await updateInventoryStock(
      Number(productId),
      variationId ? Number(variationId) : null,
      Number(stockQuantity),
      lowStockThreshold !== undefined ? Number(lowStockThreshold) : undefined
    );
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get('/orders', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status, search, page, limit } = req.query;
  const orders = await getOrders({
    status: status as string,
    search: search as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 25,
  });
  res.json(orders);
});

adminRouter.patch('/orders/:id/status', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await updateOrderStatus(Number(req.params.id), req.body.status);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin seller management
adminRouter.get('/sellers', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const sellers = await listSellers();
    res.json(sellers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.patch('/sellers/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await updateSellerStatus(Number(req.params.id), req.body.status, req.body.adminNotes);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin product approval management
adminRouter.get('/pending-products', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const products = await getPendingProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.patch('/pending-products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await updateProductStatus(Number(req.params.id), req.body.status);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin category management
adminRouter.post('/categories', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const created = await createCategory(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.put('/categories/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await updateCategory(Number(req.params.id), req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.delete('/categories/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await deleteCategory(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
