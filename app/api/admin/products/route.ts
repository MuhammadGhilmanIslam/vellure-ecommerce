import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

function requireAdmin(session: any) {
  if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user?.role)) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required.' } },
      { status: 401 }
    );
  }
  return null;
}

const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  shortDescription: z.string().max(300).optional(),
  price: z.number().int().positive(),
  comparePrice: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  weight: z.number().int().optional().nullable(),
  categoryIds: z.array(z.string()).min(1),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  images: z.array(z.string()).optional(),
});

// GET /api/admin/products — list with all filters
export async function GET(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const q = searchParams.get('q');
  const status = searchParams.get('status');

  try {
    const where: any = {};
    if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { sku: { contains: q, mode: 'insensitive' } }];
    if (status) where.status = status;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit, take: limit,
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          categories: { include: { category: { select: { name: true } } } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'DB_ERROR', message: 'Database unavailable.' } }, { status: 503 });
  }
}

// POST /api/admin/products — create new product
export async function POST(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      }, { status: 400 });
    }

    const { categoryIds, tagIds, images, ...productData } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        description: productData.description,
        categories: {
          create: categoryIds.map((id) => ({ categoryId: id })),
        },
        ...(tagIds && tagIds.length > 0 && {
          tags: { create: tagIds.map(id => ({ tagId: id })) },
        }),
        ...(images && images.length > 0 && {
          images: { create: images.map((url, i) => ({ url, publicId: `mock-id-${i}`, sortOrder: i })) },
        }),
      },
      include: {
        images: true,
        categories: { include: { category: true } },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session!.user!.id,
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        newValue: { name: product.name },
      },
    }).catch(() => {}); // Ignore audit log errors

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: { code: 'SLUG_CONFLICT', message: 'A product with this slug already exists.' },
      }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create product.' } }, { status: 500 });
  }
}

