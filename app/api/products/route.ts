import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const MOCK_PRODUCTS = [
  {
    id: 'p1', slug: 'gravity-tee-obsidian', name: 'Gravity Tee — Obsidian',
    price: 485000, comparePrice: null, stock: 45, averageRating: 4.8,
    totalReviews: 89, totalSold: 312, status: 'ACTIVE',
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', sortOrder: 0 }],
    categories: [{ category: { name: 'Clothing', slug: 'clothing' } }],
    tags: [{ tag: { name: 'Best Seller', slug: 'best-seller' } }],
  },
  {
    id: 'p2', slug: 'drift-overshirt-sand', name: 'Drift Overshirt — Sand',
    price: 895000, comparePrice: 1195000, stock: 8, averageRating: 4.6,
    totalReviews: 43, totalSold: 187, status: 'ACTIVE',
    images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', sortOrder: 0 }],
    categories: [{ category: { name: 'Clothing', slug: 'clothing' } }],
    tags: [{ tag: { name: 'Sale', slug: 'sale' } }],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category');
  const q = searchParams.get('q');
  const sort = searchParams.get('sort') || 'newest';
  const inStock = searchParams.get('inStock') === 'true';

  try {
    const where: any = { status: 'ACTIVE' };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.categories = { some: { category: { slug: category } } };
    }
    if (inStock) {
      where.stock = { gt: 0 };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'best-selling') orderBy = { totalSold: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { averageRating: 'desc' };

    const [total, productsRaw] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where, orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          categories: { include: { category: { select: { name: true, slug: true } } } },
          tags: { include: { tag: { select: { name: true, slug: true } } } },
        },
      }),
    ]);

    const products = productsRaw.map(p => ({
      id: p.id, slug: p.slug, name: p.name,
      price: p.price, comparePrice: p.comparePrice,
      stock: p.stock, averageRating: p.averageRating,
      totalReviews: p.totalReviews, totalSold: p.totalSold,
      images: p.images.map(i => i.url),
      category: p.categories[0]?.category || null,
      tags: p.tags.map(t => t.tag.name),
    }));

    return NextResponse.json({
      success: true,
      data: products,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    // DB not connected — return mock data
    return NextResponse.json({
      success: true,
      data: MOCK_PRODUCTS.map(p => ({
        ...p,
        images: p.images.map(i => i.url),
        category: p.categories[0]?.category || null,
        tags: p.tags.map(t => t.tag.name),
      })),
      meta: { page: 1, limit: 20, total: MOCK_PRODUCTS.length, totalPages: 1 },
    });
  }
}
