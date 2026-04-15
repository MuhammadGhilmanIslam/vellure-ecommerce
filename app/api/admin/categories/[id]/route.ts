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

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

// PUT /api/admin/categories/[id] — update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Category not found.' },
      }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: { code: 'SLUG_CONFLICT', message: 'A category with this slug already exists.' },
      }, { status: 409 });
    }
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update category.' } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] — delete a category (with safeguard)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    // Safeguard: check if category has products
    const productCount = await prisma.productCategory.count({
      where: { categoryId: params.id },
    });

    if (productCount > 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'HAS_PRODUCTS',
          message: `Kategori tidak bisa dihapus karena masih memiliki ${productCount} produk. Pindahkan atau hapus produk terlebih dahulu.`,
        },
      }, { status: 400 });
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Category deleted.' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Category not found.' },
      }, { status: 404 });
    }
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to delete category.' } },
      { status: 500 }
    );
  }
}
