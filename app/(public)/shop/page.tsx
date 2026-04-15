import React from 'react';
import prisma from '@/lib/prisma';
import { ShopClient } from '@/components/shop/ShopClient';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categoryParam = searchParams.category;
  const searchParam = searchParams.q as string;
  const sortParam = searchParams.sort as string;
  const inStockParam = searchParams.inStock === 'true';

  let categoriesFilter: string[] = [];
  if (categoryParam) {
    categoriesFilter = Array.isArray(categoryParam) ? categoryParam : [categoryParam];
  }

  // Build Prisma where clause
  const where: any = { status: 'ACTIVE' };

  if (searchParam) {
    where.OR = [
      { name: { contains: searchParam, mode: 'insensitive' } },
      { description: { contains: searchParam, mode: 'insensitive' } },
    ];
  }

  if (categoriesFilter.length > 0) {
    where.categories = {
      some: {
        category: {
          slug: { in: categoriesFilter },
        },
      },
    };
  }

  if (inStockParam) {
    where.stock = { gt: 0 };
  }

  // Build Prisma order by
  let orderBy: any = { createdAt: 'desc' }; // default Newest
  if (sortParam === 'price-asc') orderBy = { price: 'asc' };
  if (sortParam === 'price-desc') orderBy = { price: 'desc' };
  if (sortParam === 'best-selling') orderBy = { totalSold: 'desc' };
  if (sortParam === 'rating') orderBy = { averageRating: 'desc' };

  let products = [];
  let allCategories = [];

  try {
    // Fetch data
    const [productsRaw, allCategoriesData] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
      }),
      prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    allCategories = allCategoriesData;

    // Transform to match UI ProductCard
    products = productsRaw.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images.map(img => img.url),
      category: { name: product.categories[0]?.category.name || 'Uncategorized' },
      rating: product.averageRating,
      reviewsCount: product.totalReviews,
      stock: product.stock,
      tags: product.tags.map(t => t.tag.name),
    }));
  } catch (error) {
    console.error('Database connection failed, using mock data for shop demo:', error);
    allCategories = [
      { id: 'm1', name: 'Clothing', slug: 'clothing' },
      { id: 'm2', name: 'Accessories', slug: 'accessories' },
      { id: 'm3', name: 'Lifestyle', slug: 'lifestyle' },
    ];
    products = [
      {
        id: 'p1',
        slug: 'gravity-tee-obsidian',
        name: 'Gravity Tee — Obsidian',
        price: 485000,
        comparePrice: null,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
        category: { name: 'Clothing' },
        rating: 4.8,
        reviewsCount: 89,
        stock: 45,
        tags: ['New Arrival'],
      },
      {
        id: 'p2',
        slug: 'drift-overshirt-sand',
        name: 'Drift Overshirt — Sand',
        price: 895000,
        comparePrice: 1195000,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80'],
        category: { name: 'Clothing' },
        rating: 4.6,
        reviewsCount: 43,
        stock: 8,
        tags: ['Sale'],
      },
    ];
  }

  return (
    <div className="min-h-screen bg-ag-bg pt-24 pb-32">
      <ShopClient 
        initialProducts={products} 
        categories={allCategories} 
        searchParams={searchParams}
      />
    </div>
  );
}
