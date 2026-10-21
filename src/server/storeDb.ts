import crypto from 'crypto';
import { desc, asc, eq, and, or, sql, like, inArray, gte, lte, isNull } from 'drizzle-orm';
import { db } from '../db/index.ts';
import {
  categories,
  products,
  productImages,
  productVariations,
  inventory,
  customers,
  orders,
  orderItems,
  coupons,
  sellers,
} from '../db/schema.ts';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './seedData.ts';

// ... (skipping ahead)

/**
 * Automatically seeds the database if categories table is currently empty
 */
export async function seedStoreIfEmpty() {
  try {
    const existingCats = await db.select({ id: categories.id }).from(categories).limit(1);
    if (existingCats.length > 0) {
      return { seeded: false, message: 'Database already seeded' };
    }

    console.log('Seeding Astronava Store database with authentic Vedic products...');

    // 1. Insert main categories and their subcategories
    const categoryIdMap: Record<string, number> = {};

    for (const cat of SEED_CATEGORIES) {
      const [insertedCat] = await db
        .insert(categories)
        .values({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          imageUrl: cat.imageUrl,
          displayOrder: cat.displayOrder,
        })
        .returning();

      categoryIdMap[cat.slug] = insertedCat.id;

      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          const [insertedSub] = await db
            .insert(categories)
            .values({
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              parentId: insertedCat.id,
              displayOrder: sub.displayOrder,
            })
            .returning();
          categoryIdMap[sub.slug] = insertedSub.id;
        }
      }
    }

    // 2. Insert products, images, variations, and inventory
    for (const prod of SEED_PRODUCTS) {
      const catId = categoryIdMap[prod.categorySlug] || categoryIdMap['gemstones'];

      const [insertedProduct] = await db
        .insert(products)
        .values({
          name: prod.name,
          slug: prod.slug,
          categoryId: catId,
          brand: prod.brand,
          shortDescription: prod.shortDescription,
          fullDescription: prod.fullDescription,
          price: prod.price,
          salePrice: prod.salePrice || null,
          sku: prod.sku,
          stock: prod.stock,
          weight: prod.weight,
          tags: prod.tags,
          planet: prod.planet || null,
          zodiac: prod.zodiac || null,
          certification: prod.certification,
          benefits: prod.benefits,
          specifications: prod.specifications,
          careInstructions: prod.careInstructions,
          isFeatured: prod.isFeatured,
          isBestSeller: prod.isBestSeller,
          isNewArrival: prod.isNewArrival,
          isPublished: prod.isPublished,
        })
        .returning();

      // Variations
      if (prod.variations && prod.variations.length > 0) {
        for (const v of prod.variations) {
          const [insertedVar] = await db
            .insert(productVariations)
            .values({
              productId: insertedProduct.id,
              variationType: v.type,
              variationValue: v.value,
              sku: v.sku,
              price: v.price || insertedProduct.price,
              salePrice: v.salePrice || null,
              stock: v.stock,
              imageUrl: v.imageUrl || null,
            })
            .returning();

          // Inventory row for each variation
          await db.insert(inventory).values({
            productId: insertedProduct.id,
            variationId: insertedVar.id,
            sku: v.sku,
            stockQuantity: v.stock,
            lowStockThreshold: 3,
          });
        }
      } else {
        // Base inventory row for product without variants
        await db.insert(inventory).values({
          productId: insertedProduct.id,
          sku: prod.sku,
          stockQuantity: prod.stock,
          lowStockThreshold: 5,
        });
      }

      // Images
      if (prod.images && prod.images.length > 0) {
        for (const img of prod.images) {
          await db.insert(productImages).values({
            productId: insertedProduct.id,
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            displayOrder: img.displayOrder,
          });
        }
      }
    }

    // 3. Seed welcome promo coupons (future-ready architecture)
    await db.insert(coupons).values([
      {
        code: 'ASTRO10',
        discountType: 'percentage',
        discountValue: '10.00',
        minOrderAmount: '1000.00',
        maxDiscount: '2000.00',
        isActive: true,
      },
      {
        code: 'VEDIC500',
        discountType: 'fixed',
        discountValue: '500.00',
        minOrderAmount: '5000.00',
        isActive: true,
      },
    ]);

    console.log('Astronava Store seeded successfully with categories, products, and coupons!');
    return { seeded: true, message: 'Seeding completed successfully' };
  } catch (err) {
    console.error('Failed to seed store database:', err);
    throw err;
  }
}

// -------------------------------------------------------------
// Category Operations
// -------------------------------------------------------------
export async function getAllCategories() {
  const allCats = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder), asc(categories.name));

  // Build tree
  const rootCats = allCats.filter((c) => c.parentId === null);
  const withSubcategories = rootCats.map((root) => {
    const subs = allCats.filter((c) => c.parentId === root.id);
    return {
      ...root,
      subcategories: subs,
    };
  });

  return withSubcategories;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number | null;
  displayOrder?: number;
}) {
  const [created] = await db
    .insert(categories)
    .values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl,
      parentId: data.parentId || null,
      displayOrder: data.displayOrder || 0,
    })
    .returning();
  return created;
}

export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    parentId: number | null;
    displayOrder: number;
  }>
) {
  const [updated] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();
  return updated;
}

export async function deleteCategory(id: number) {
  return await db.delete(categories).where(eq(categories.id, id));
}

// -------------------------------------------------------------
// Product Operations
// -------------------------------------------------------------
export interface ProductFilterOptions {
  categoryId?: number;
  categorySlug?: string;
  planet?: string;
  zodiac?: string;
  certification?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
}

export async function getProducts(options: ProductFilterOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 12));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (!options.includeDrafts) {
    conditions.push(eq(products.isPublished, true));
  }

  if (options.categorySlug) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, options.categorySlug))
      .limit(1);

    if (cat.length > 0) {
      // also check if this category has children
      const subCats = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.parentId, cat[0].id));

      const catIds = [cat[0].id, ...subCats.map((s) => s.id)];
      conditions.push(inArray(products.categoryId, catIds));
    }
  } else if (options.categoryId) {
    conditions.push(eq(products.categoryId, options.categoryId));
  }

  if (options.planet && options.planet !== 'all') {
    conditions.push(like(products.planet, `%${options.planet}%`));
  }

  if (options.zodiac && options.zodiac !== 'all') {
    conditions.push(like(products.zodiac, `%${options.zodiac}%`));
  }

  if (options.certification && options.certification !== 'all') {
    conditions.push(like(products.certification, `%${options.certification}%`));
  }

  if (options.minPrice !== undefined) {
    conditions.push(gte(products.price, String(options.minPrice)));
  }

  if (options.maxPrice !== undefined) {
    conditions.push(lte(products.price, String(options.maxPrice)));
  }

  if (options.inStockOnly) {
    conditions.push(sql`${products.stock} > 0`);
  }

  if (options.search && options.search.trim()) {
    const query = `%${options.search.trim().toLowerCase()}%`;
    conditions.push(
      or(
        like(sql`lower(${products.name})`, query),
        like(sql`lower(${products.shortDescription})`, query),
        like(sql`lower(${products.tags})`, query),
        like(sql`lower(${products.sku})`, query)
      )
    );
  }

  if (options.isFeatured) {
    conditions.push(eq(products.isFeatured, true));
  }
  if (options.isBestSeller) {
    conditions.push(eq(products.isBestSeller, true));
  }
  if (options.isNewArrival) {
    conditions.push(eq(products.isNewArrival, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Sorting
  let orderByClause = desc(products.createdAt);
  if (options.sortBy === 'price_asc') {
    orderByClause = asc(products.price);
  } else if (options.sortBy === 'price_desc') {
    orderByClause = desc(products.price);
  } else if (options.sortBy === 'popular') {
    orderByClause = desc(products.isBestSeller);
  }

  // Fetch total count
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(whereClause);

  const total = countResult[0]?.count || 0;

  // Fetch products with their primary image and category
  const prods = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      brand: products.brand,
      shortDescription: products.shortDescription,
      price: products.price,
      salePrice: products.salePrice,
      sku: products.sku,
      stock: products.stock,
      planet: products.planet,
      zodiac: products.zodiac,
      certification: products.certification,
      isFeatured: products.isFeatured,
      isBestSeller: products.isBestSeller,
      isNewArrival: products.isNewArrival,
      isPublished: products.isPublished,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  // Fetch primary image for each product
  const productIds = prods.map((p) => p.id);
  let imagesMap: Record<number, string> = {};
  if (productIds.length > 0) {
    const imgs = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder));

    imgs.forEach((img) => {
      if (!imagesMap[img.productId]) {
        imagesMap[img.productId] = img.url;
      }
    });
  }

  const items = prods.map((p) => ({
    ...p,
    primaryImage: imagesMap[p.id] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  }));

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getProductBySlug(slug: string) {
  const prod = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (prod.length === 0) return null;

  const currentProduct = prod[0].product;
  const currentCategory = prod[0].category;

  // Images
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, currentProduct.id))
    .orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder));

  // Variations
  const variations = await db
    .select()
    .from(productVariations)
    .where(eq(productVariations.productId, currentProduct.id))
    .orderBy(asc(productVariations.variationType), asc(productVariations.id));

  // Related products (same category or planet)
  const related = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      salePrice: products.salePrice,
      stock: products.stock,
      planet: products.planet,
    })
    .from(products)
    .where(
      and(
        eq(products.isPublished, true),
        sql`${products.id} != ${currentProduct.id}`,
        or(
          eq(products.categoryId, currentProduct.categoryId),
          currentProduct.planet ? eq(products.planet, currentProduct.planet) : undefined
        )
      )
    )
    .limit(4);

  // Related primary images
  const relatedIds = related.map((r) => r.id);
  let relatedImagesMap: Record<number, string> = {};
  if (relatedIds.length > 0) {
    const relImgs = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .where(inArray(productImages.productId, relatedIds))
      .orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder));

    relImgs.forEach((img) => {
      if (!relatedImagesMap[img.productId]) {
        relatedImagesMap[img.productId] = img.url;
      }
    });
  }

  const relatedWithImages = related.map((r) => ({
    ...r,
    primaryImage: relatedImagesMap[r.id] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  }));

  return {
    ...currentProduct,
    category: currentCategory,
    images,
    variations,
    relatedProducts: relatedWithImages,
  };
}

export async function createProduct(
  productData: any,
  imagesData: any[] = [],
  variationsData: any[] = []
) {
  // 1. Validate & Ensure Category exists
  let targetCategoryId = Number(productData.categoryId) || 1;
  const foundCat = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, targetCategoryId))
    .limit(1);

  if (foundCat.length === 0) {
    // Fallback to first available category
    const defaultCat = await db.select({ id: categories.id }).from(categories).limit(1);
    targetCategoryId = defaultCat[0]?.id || 1;
  }

  // 2. Generate and ensure unique slug
  let rawSlug = productData.slug;
  if (!rawSlug || !rawSlug.trim()) {
    rawSlug = (productData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  } else {
    rawSlug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  let finalSlug = rawSlug || `product-${Date.now().toString(36)}`;
  let slugExists = true;
  let counter = 1;
  while (slugExists) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, finalSlug))
      .limit(1);
    if (existing.length === 0) {
      slugExists = false;
    } else {
      counter++;
      finalSlug = `${rawSlug}-${counter}`;
    }
  }

  // 3. Ensure unique SKU
  let rawSku = (productData.sku || '').trim();
  if (!rawSku) {
    rawSku = `ASTRO-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  const existingSku = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(eq(products.sku, rawSku))
    .limit(1);
  if (existingSku.length > 0) {
    rawSku = `${rawSku}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
  }

  // 4. Clean strings & fallback descriptions
  const cleanName = (productData.name || 'Untitled Product').trim();
  const shortDesc = (productData.shortDescription || '').trim() || `${cleanName} - Authentic Vedic Astrological Item`;
  const fullDesc = (productData.fullDescription || '').trim() || shortDesc || `${cleanName} - Certified Authentic Vedic Astrological Item`;

  const cleanProduct = {
    name: cleanName,
    slug: finalSlug,
    categoryId: targetCategoryId,
    brand: (productData.brand || 'Astronava Vedic Authentics').trim(),
    shortDescription: shortDesc,
    fullDescription: fullDesc,
    price: String(productData.price || '999'),
    salePrice: productData.salePrice ? String(productData.salePrice).trim() : null,
    sku: rawSku,
    stock: Number(productData.stock) || 0,
    weight: productData.weight ? String(productData.weight).trim() : null,
    tags: productData.tags ? String(productData.tags).trim() : null,
    planet: productData.planet ? String(productData.planet).trim() : null,
    zodiac: productData.zodiac ? String(productData.zodiac).trim() : null,
    certification: productData.certification ? String(productData.certification).trim() : 'Lab Certified',
    benefits: productData.benefits ? String(productData.benefits).trim() : null,
    specifications: productData.specifications ? String(productData.specifications).trim() : null,
    careInstructions: productData.careInstructions ? String(productData.careInstructions).trim() : null,
    isFeatured: Boolean(productData.isFeatured),
    isBestSeller: Boolean(productData.isBestSeller),
    isNewArrival: Boolean(productData.isNewArrival),
    isPublished: productData.isPublished !== undefined ? Boolean(productData.isPublished) : true,
    updatedAt: new Date(),
  };

  const [inserted] = await db
    .insert(products)
    .values(cleanProduct)
    .returning();

  // 5. Handle Variations
  if (variationsData && variationsData.length > 0) {
    for (let i = 0; i < variationsData.length; i++) {
      const v = variationsData[i];
      const varVal = (v.variationValue || `Option ${i + 1}`).trim();
      const varSku = (v.sku || `${inserted.sku}-${varVal.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`).trim();

      const [insertedVar] = await db
        .insert(productVariations)
        .values({
          productId: inserted.id,
          variationType: (v.variationType || 'Option').trim(),
          variationValue: varVal,
          sku: varSku,
          price: v.price ? String(v.price).trim() : inserted.price,
          salePrice: v.salePrice ? String(v.salePrice).trim() : null,
          stock: Number(v.stock) || 0,
          imageUrl: v.imageUrl ? String(v.imageUrl).trim() : null,
        })
        .returning();

      await db.insert(inventory).values({
        productId: inserted.id,
        variationId: insertedVar.id,
        sku: insertedVar.sku,
        stockQuantity: insertedVar.stock,
        lowStockThreshold: 3,
      });
    }
  } else {
    // Single inventory item for product
    await db.insert(inventory).values({
      productId: inserted.id,
      sku: inserted.sku,
      stockQuantity: inserted.stock,
      lowStockThreshold: 5,
    });
  }

  // 6. Handle Images
  const validImages = (imagesData || []).filter((img) => img && img.url && typeof img.url === 'string' && img.url.trim().length > 0);
  if (validImages.length > 0) {
    for (let i = 0; i < validImages.length; i++) {
      const img = validImages[i];
      await db.insert(productImages).values({
        productId: inserted.id,
        url: img.url.trim(),
        altText: (img.altText || inserted.name).trim(),
        isPrimary: i === 0 || Boolean(img.isPrimary),
        displayOrder: i + 1,
      });
    }
  } else {
    // Provide a quality default placeholder image
    await db.insert(productImages).values({
      productId: inserted.id,
      url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      altText: inserted.name,
      isPrimary: true,
      displayOrder: 1,
    });
  }

  return getProductBySlug(inserted.slug);
}

export async function updateProduct(
  id: number,
  productData: any,
  imagesData?: any[],
  variationsData?: any[]
) {
  // Validate Category if updated
  let targetCategoryId = productData.categoryId ? Number(productData.categoryId) : undefined;
  if (targetCategoryId) {
    const foundCat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, targetCategoryId))
      .limit(1);
    if (foundCat.length === 0) {
      targetCategoryId = undefined;
    }
  }

  const updateFields: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (productData.name !== undefined) updateFields.name = String(productData.name).trim();
  if (productData.slug !== undefined) updateFields.slug = String(productData.slug).trim();
  if (targetCategoryId) updateFields.categoryId = targetCategoryId;
  if (productData.brand !== undefined) updateFields.brand = String(productData.brand).trim();
  if (productData.shortDescription !== undefined) updateFields.shortDescription = String(productData.shortDescription).trim();
  if (productData.fullDescription !== undefined) updateFields.fullDescription = String(productData.fullDescription).trim();
  if (productData.price !== undefined) updateFields.price = String(productData.price).trim();
  if (productData.salePrice !== undefined) {
    updateFields.salePrice = productData.salePrice ? String(productData.salePrice).trim() : null;
  }
  if (productData.sku !== undefined) updateFields.sku = String(productData.sku).trim();
  if (productData.stock !== undefined) updateFields.stock = Math.max(0, Number(productData.stock) || 0);
  if (productData.weight !== undefined) updateFields.weight = productData.weight ? String(productData.weight).trim() : null;
  if (productData.tags !== undefined) updateFields.tags = productData.tags ? String(productData.tags).trim() : null;
  if (productData.planet !== undefined) updateFields.planet = productData.planet ? String(productData.planet).trim() : null;
  if (productData.zodiac !== undefined) updateFields.zodiac = productData.zodiac ? String(productData.zodiac).trim() : null;
  if (productData.certification !== undefined) updateFields.certification = productData.certification ? String(productData.certification).trim() : null;
  if (productData.benefits !== undefined) updateFields.benefits = productData.benefits ? String(productData.benefits).trim() : null;
  if (productData.specifications !== undefined) updateFields.specifications = productData.specifications ? String(productData.specifications).trim() : null;
  if (productData.careInstructions !== undefined) updateFields.careInstructions = productData.careInstructions ? String(productData.careInstructions).trim() : null;
  if (productData.isFeatured !== undefined) updateFields.isFeatured = Boolean(productData.isFeatured);
  if (productData.isBestSeller !== undefined) updateFields.isBestSeller = Boolean(productData.isBestSeller);
  if (productData.isNewArrival !== undefined) updateFields.isNewArrival = Boolean(productData.isNewArrival);
  if (productData.isPublished !== undefined) updateFields.isPublished = Boolean(productData.isPublished);

  const [updated] = await db
    .update(products)
    .set(updateFields)
    .where(eq(products.id, id))
    .returning();

  if (!updated) return null;

  // Update variations if passed
  if (variationsData !== undefined) {
    await db.delete(productVariations).where(eq(productVariations.productId, id));
    await db.delete(inventory).where(eq(inventory.productId, id));

    if (variationsData.length > 0) {
      for (let i = 0; i < variationsData.length; i++) {
        const v = variationsData[i];
        const varVal = (v.variationValue || `Option ${i + 1}`).trim();
        const varSku = (v.sku || `${updated.sku}-${varVal.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`).trim();

        const [insertedVar] = await db
          .insert(productVariations)
          .values({
            productId: id,
            variationType: (v.variationType || 'Option').trim(),
            variationValue: varVal,
            sku: varSku,
            price: v.price ? String(v.price).trim() : updated.price,
            salePrice: v.salePrice ? String(v.salePrice).trim() : null,
            stock: Number(v.stock) || 0,
            imageUrl: v.imageUrl ? String(v.imageUrl).trim() : null,
          })
          .returning();

        await db.insert(inventory).values({
          productId: id,
          variationId: insertedVar.id,
          sku: insertedVar.sku,
          stockQuantity: insertedVar.stock,
          lowStockThreshold: 3,
        });
      }
    } else {
      await db.insert(inventory).values({
        productId: id,
        sku: updated.sku,
        stockQuantity: updated.stock,
        lowStockThreshold: 5,
      });
    }
  }

  // Update images if passed
  if (imagesData !== undefined) {
    await db.delete(productImages).where(eq(productImages.productId, id));
    const validImages = (imagesData || []).filter((img) => img && img.url && typeof img.url === 'string' && img.url.trim().length > 0);
    if (validImages.length > 0) {
      for (let i = 0; i < validImages.length; i++) {
        const img = validImages[i];
        await db.insert(productImages).values({
          productId: id,
          url: img.url.trim(),
          altText: (img.altText || updated.name).trim(),
          isPrimary: i === 0 || Boolean(img.isPrimary),
          displayOrder: i + 1,
        });
      }
    }
  }

  return getProductBySlug(updated.slug);
}

export async function deleteProduct(id: number) {
  return await db.delete(products).where(eq(products.id, id));
}

export async function toggleProductPublish(id: number) {
  const current = await db
    .select({ isPublished: products.isPublished })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (current.length === 0) return null;

  const nextState = !current[0].isPublished;
  const [updated] = await db
    .update(products)
    .set({ isPublished: nextState, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  return updated;
}



export async function getPendingProducts() {
  return await db
    .select({
      product: products,
      seller: sellers
    })
    .from(products)
    .leftJoin(sellers, eq(products.sellerId, sellers.id))
    .where(eq(products.status, 'pending'))
    .orderBy(desc(products.createdAt));
}

export async function updateProductStatus(id: number, status: 'approved' | 'rejected') {
  return await db
    .update(products)
    .set({ status, isPublished: status === 'approved' })
    .where(eq(products.id, id))
    .returning();
}
export async function getProductSellerId(productId: number) {
  const prod = await db
    .select({ sellerId: products.sellerId })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  return prod.length > 0 ? prod[0].sellerId : null;
}

export async function listSellerProducts(sellerId: number) {
  return await db
    .select()
    .from(products)
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(products.createdAt));
}

export async function createSellerProduct(
  sellerId: number,
  productData: any,
  imagesData: any[] = [],
  variationsData: any[] = []
) {
  // Enforce 'pending' status for new seller products
  const productDataWithStatus = {
    ...productData,
    sellerId,
    status: 'pending',
    isPublished: false,
  };
  return await createProduct(productDataWithStatus, imagesData, variationsData);
}
export async function getSellerInventoryItems(sellerId: number) {
  return await db
    .select({
      id: inventory.id,
      productId: inventory.productId,
      productName: products.name,
      productSku: products.sku,
      variationId: inventory.variationId,
      variationValue: productVariations.variationValue,
      sku: inventory.sku,
      stockQuantity: inventory.stockQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      updatedAt: inventory.updatedAt,
      status: products.status,
      price: products.price,
    })
    .from(inventory)
    .leftJoin(products, eq(inventory.productId, products.id))
    .leftJoin(productVariations, eq(inventory.variationId, productVariations.id))
    .where(eq(products.sellerId, sellerId))
    .orderBy(asc(inventory.stockQuantity), asc(products.name));
}

export async function getInventoryItems() {
  const items = await db
    .select({
      id: inventory.id,
      productId: inventory.productId,
      productName: products.name,
      productSku: products.sku,
      variationId: inventory.variationId,
      variationValue: productVariations.variationValue,
      sku: inventory.sku,
      stockQuantity: inventory.stockQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      updatedAt: inventory.updatedAt,
    })
    .from(inventory)
    .leftJoin(products, eq(inventory.productId, products.id))
    .leftJoin(productVariations, eq(inventory.variationId, productVariations.id))
    .orderBy(asc(inventory.stockQuantity), asc(products.name));

  return items;
}

export async function updateInventoryStock(
  productId: number,
  variationId: number | null,
  newStock: number,
  newThreshold?: number
) {
  const condition = variationId
    ? and(eq(inventory.productId, productId), eq(inventory.variationId, variationId))
    : and(eq(inventory.productId, productId), sql`${inventory.variationId} IS NULL`);

  await db
    .update(inventory)
    .set({
      stockQuantity: newStock,
      ...(newThreshold !== undefined ? { lowStockThreshold: newThreshold } : {}),
      updatedAt: new Date(),
    })
    .where(condition);

  // Sync to products table or variation table
  if (variationId) {
    await db
      .update(productVariations)
      .set({ stock: newStock })
      .where(eq(productVariations.id, variationId));
  } else {
    await db.update(products).set({ stock: newStock }).where(eq(products.id, productId));
  }

  return { success: true, stock: newStock };
}

// -------------------------------------------------------------
// Orders & Checkout Operations
// -------------------------------------------------------------
export interface CreateOrderPayload {
  customer: {
    uid?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  items: {
    productId: number;
    variationId?: number | null;
    productName: string;
    variantName?: string;
    sku: string;
    price: string;
    quantity: number;
    imageUrl?: string;
  }[];
  couponCode?: string;
  notes?: string;
}

export async function createOrder(payload: CreateOrderPayload) {
  if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 50) {
    throw new Error('Order must contain between 1 and 50 items');
  }

  // 1. Validate items and resolve authoritative server-side prices & stock
  const verifiedItems: Array<{
    productId: number;
    variationId: number | null;
    productName: string;
    variantName: string | null;
    sku: string;
    price: string;
    unitPriceNum: number;
    quantity: number;
    imageUrl: string | null;
  }> = [];

  let subtotal = 0;

  for (const rawItem of payload.items as any[]) {
    const productId = Number(rawItem.productId);
    const variationId = rawItem.variationId ? Number(rawItem.variationId) : null;
    const quantity = Number(rawItem.quantity);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error('Invalid product ID in order');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      throw new Error('Item quantity must be an integer between 1 and 100');
    }

    const dbProdList = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (dbProdList.length === 0) {
      throw new Error(`Product #${productId} no longer exists`);
    }
    const dbProd = dbProdList[0];

    let unitPriceNum = Number(dbProd.salePrice || dbProd.price);
    let resolvedSku = dbProd.sku;
    let resolvedVariantName: string | null = rawItem.variantName ? String(rawItem.variantName).slice(0, 120) : null;

    if (variationId) {
      const dbVarList = await db
        .select()
        .from(productVariations)
        .where(and(eq(productVariations.id, variationId), eq(productVariations.productId, productId)))
        .limit(1);

      if (dbVarList.length === 0) {
        throw new Error(`Selected variation for ${dbProd.name} is invalid`);
      }
      const dbVar = dbVarList[0];
      if (dbVar.stock < quantity) {
        throw new Error(`Insufficient stock for ${dbProd.name} (${dbVar.variationValue})`);
      }
      unitPriceNum = Number(dbVar.salePrice || dbVar.price || unitPriceNum);
      resolvedSku = dbVar.sku || resolvedSku;
      resolvedVariantName = `${dbVar.variationType}: ${dbVar.variationValue}`;
    } else if (dbProd.stock < quantity) {
      throw new Error(`Insufficient stock for ${dbProd.name}`);
    }

    if (!Number.isFinite(unitPriceNum) || unitPriceNum < 0) {
      throw new Error(`Invalid catalog price for ${dbProd.name}`);
    }

    subtotal += unitPriceNum * quantity;

    verifiedItems.push({
      productId,
      variationId,
      productName: dbProd.name,
      variantName: resolvedVariantName,
      sku: resolvedSku,
      price: unitPriceNum.toFixed(2),
      unitPriceNum,
      quantity,
      imageUrl: rawItem.imageUrl ? String(rawItem.imageUrl).slice(0, 500) : null,
    });
  }

  // 2. Insert customer record with sanitized fields
  const custData = (payload.customer || {}) as any;
  const pinCode = String(custData.pinCode || custData.pincode || custData.pin_code || custData.postalCode || '000000').slice(0, 20);
  const [cust] = await db
    .insert(customers)
    .values({
      uid: custData.uid ? String(custData.uid).slice(0, 128) : null,
      name: String(custData.name || 'Customer').slice(0, 120),
      email: String(custData.email || '').slice(0, 150),
      phone: String(custData.phone || '').slice(0, 30),
      address: String(custData.address || '').slice(0, 300),
      city: String(custData.city || '').slice(0, 100),
      state: String(custData.state || '').slice(0, 100),
      pinCode,
    })
    .returning();

  // 3. Check Coupon
  let discountAmount = 0;
  if (payload.couponCode && typeof payload.couponCode === 'string') {
    const couponList = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, payload.couponCode.trim().toUpperCase()), eq(coupons.isActive, true)))
      .limit(1);

    if (couponList.length > 0) {
      const c = couponList[0];
      const minOrder = Number(c.minOrderAmount || 0);
      if (subtotal >= minOrder) {
        if (c.discountType === 'percentage') {
          discountAmount = (subtotal * Number(c.discountValue)) / 100;
          if (c.maxDiscount) {
            discountAmount = Math.min(discountAmount, Number(c.maxDiscount));
          }
        } else {
          discountAmount = Number(c.discountValue);
        }
        discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

        // increment coupon usage
        await db
          .update(coupons)
          .set({ timesUsed: c.timesUsed + 1 })
          .where(eq(coupons.id, c.id));
      }
    }
  }

  const shippingAmount = subtotal > 1999 ? 0 : 99; // Free shipping over ₹1999
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);

  // Generate cryptographically random unguessable order number
  const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  const orderNumber = `ASTRO-${new Date().getFullYear()}-${randomSuffix}`;

  // 4. Create Order
  const [createdOrder] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerPhone: cust.phone,
      shippingAddress: cust.address,
      city: cust.city,
      state: cust.state,
      pinCode: cust.pinCode,
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      shippingAmount: shippingAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      couponCode: payload.couponCode ? String(payload.couponCode).slice(0, 40) : null,
      paymentStatus: 'Confirmed (Demo Pay)',
      paymentMethod: 'Vedic Sanctified Gateway (Demo)',
      orderStatus: 'Confirmed',
      notes: payload.notes ? String(payload.notes).slice(0, 500) : null,
    })
    .returning();

  // 5. Insert Order Items and decrement stock
  for (const vItem of verifiedItems) {
    await db.insert(orderItems).values({
      orderId: createdOrder.id,
      productId: vItem.productId,
      variationId: vItem.variationId,
      productName: vItem.productName,
      variantName: vItem.variantName,
      sku: vItem.sku,
      price: vItem.price,
      quantity: vItem.quantity,
      imageUrl: vItem.imageUrl,
    });

    // Deduct stock in products and inventory
    await db
      .update(products)
      .set({
        stock: sql`GREATEST(0, ${products.stock} - ${vItem.quantity})`,
      })
      .where(eq(products.id, vItem.productId));

    if (vItem.variationId) {
      await db
        .update(productVariations)
        .set({
          stock: sql`GREATEST(0, ${productVariations.stock} - ${vItem.quantity})`,
        })
        .where(eq(productVariations.id, vItem.variationId));
    }
  }

  return getOrderById(createdOrder.id);
}

export async function getOrders(options: {
  status?: string;
  search?: string;
  customerEmail?: string;
  limit?: number;
  page?: number;
} = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  const conditions = [];

  if (options.customerEmail && options.customerEmail.trim()) {
    conditions.push(eq(sql`lower(${orders.customerEmail})`, options.customerEmail.trim().toLowerCase()));
  }

  if (options.status && options.status !== 'all') {
    conditions.push(eq(orders.orderStatus, options.status));
  }

  if (options.search && options.search.trim()) {
    const q = `%${options.search.trim().toLowerCase()}%`;
    conditions.push(
      or(
        like(sql`lower(${orders.orderNumber})`, q),
        like(sql`lower(${orders.customerName})`, q),
        like(sql`lower(${orders.customerEmail})`, q),
        like(sql`lower(${orders.customerPhone})`, q)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(whereClause);

  const total = countResult[0]?.count || 0;

  const list = await db
    .select()
    .from(orders)
    .where(whereClause)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  // Attach items to each order
  const orderIds = list.map((o) => o.id);
  let itemsMap: Record<number, any[]> = {};
  if (orderIds.length > 0) {
    const items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));

    items.forEach((it) => {
      if (!itemsMap[it.orderId]) {
        itemsMap[it.orderId] = [];
      }
      itemsMap[it.orderId].push(it);
    });
  }

  const enriched = list.map((o) => ({
    ...o,
    items: itemsMap[o.id] || [],
  }));

  return {
    items: enriched,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getOrderById(id: number) {
  const orderList = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (orderList.length === 0) return null;

  const order = orderList[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return {
    ...order,
    items,
  };
}

export async function getOrderByOrderNumber(orderNumber: string) {
  const orderList = await db
    .select()
    .from(orders)
    .where(eq(sql`lower(${orders.orderNumber})`, orderNumber.trim().toLowerCase()))
    .limit(1);
  if (orderList.length === 0) return null;

  const order = orderList[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return {
    ...order,
    items,
  };
}

export async function updateOrderStatus(id: number, newStatus: string) {
  const [updated] = await db
    .update(orders)
    .set({
      orderStatus: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();
  return updated;
}

// -------------------------------------------------------------
// Admin Dashboard Metrics
// -------------------------------------------------------------
export async function getAdminMetrics() {
  // Total products
  const [prodCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);

  // Total orders
  const [orderCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders);

  // Total Revenue
  const [revenueResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}::numeric), 0)::float` })
    .from(orders)
    .where(sql`${orders.orderStatus} != 'Cancelled'`);

  // Out of Stock products count
  const [outOfStockResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(sql`${products.stock} <= 0`);

  // Low Stock products count (between 1 and 5)
  const [lowStockResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(sql`${products.stock} > 0 AND ${products.stock} <= 5`);

  // Recent 8 orders
  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(8);

  return {
    totalProducts: prodCount?.count || 0,
    totalOrders: orderCount?.count || 0,
    totalRevenue: revenueResult?.total || 0,
    outOfStock: outOfStockResult?.count || 0,
    lowStock: lowStockResult?.count || 0,
    recentOrders,
  };
}


// -------------------------------------------------------------
// Seller Management
// -------------------------------------------------------------
export async function listSellers() {
  return await db.select().from(sellers).orderBy(desc(sellers.createdAt));
}

export async function getSellerByUserId(userId: string) {
  const s = await db.select().from(sellers).where(eq(sellers.userId, userId)).limit(1);
  return s.length > 0 ? s[0] : null;
}

export async function updateSellerStatus(id: number, status: 'approved' | 'rejected', adminNotes?: string) {
  return await db
    .update(sellers)
    .set({
      status,
      adminNotes,
      updatedAt: new Date(),
    })
    .where(eq(sellers.id, id))
    .returning();
}


// -------------------------------------------------------------
// Coupon Validation
// -------------------------------------------------------------
export async function validateCouponCode(code: string, subtotal: number) {
  if (!code || !code.trim()) {
    return { valid: false, error: 'Please enter a coupon code' };
  }

  const found = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code.trim().toUpperCase()), eq(coupons.isActive, true)))
    .limit(1);

  if (found.length === 0) {
    return { valid: false, error: 'Invalid or expired coupon code' };
  }

  const c = found[0];

  if (c.expiresAt && new Date(c.expiresAt) < new Date()) {
    return { valid: false, error: 'This coupon has expired' };
  }

  const minOrder = Number(c.minOrderAmount || 0);
  if (subtotal < minOrder) {
    return {
      valid: false,
      error: `Minimum order value of ₹${minOrder} required for coupon ${c.code}`,
    };
  }

  let discount = 0;
  if (c.discountType === 'percentage') {
    discount = (subtotal * Number(c.discountValue)) / 100;
    if (c.maxDiscount) {
      discount = Math.min(discount, Number(c.maxDiscount));
    }
  } else {
    discount = Number(c.discountValue);
  }

  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    code: c.code,
    discountType: c.discountType,
    discountValue: Number(c.discountValue),
    discountAmount: Math.round(discount),
    message: `Coupon applied: ₹${Math.round(discount)} off`,
  };
}
