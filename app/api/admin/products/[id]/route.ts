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

const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional().nullable(),
  price: z.number().int().positive().optional(),
  comparePrice: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().optional().nullable(),
  weight: z.number().int().optional().nullable(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

// GET /api/admin/products/[id] — fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found.' },
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch product.' } },
      { status: 503 }
    );
  }
}

// PUT /api/admin/products/[id] — update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      }, { status: 400 });
    }

    const { categoryIds, tagIds, images, ...productData } = parsed.data;

    // Update product fields
    await prisma.product.update({
      where: { id: params.id },
      data: productData,
    });

    // Update categories if provided
    if (categoryIds !== undefined) {
      await prisma.productCategory.deleteMany({ where: { productId: params.id } });
      if (categoryIds.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryIds.map(categoryId => ({ productId: params.id, categoryId })),
        });
      }
    }

    // Update tags if provided
    if (tagIds !== undefined) {
      await prisma.productTag.deleteMany({ where: { productId: params.id } });
      if (tagIds.length > 0) {
        await prisma.productTag.createMany({
          data: tagIds.map(tagId => ({ productId: params.id, tagId })),
        });
      }
    }

    // Update images if provided
    if (images !== undefined) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((url, i) => ({
            productId: params.id,
            url,
            publicId: `${params.id}-img-${i}`,
            sortOrder: i,
          })),
        });
      }
    }

    // Fetch updated product
    const updated = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found.' },
      }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: { code: 'SLUG_CONFLICT', message: 'A product with this slug already exists.' },
      }, { status: 409 });
    }
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update product.' } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] — delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Product deleted.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found.' },
      }, { status: 404 });
    }
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete product.' } },
      { status: 500 }
    );
  }
}
