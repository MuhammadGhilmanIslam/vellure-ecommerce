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

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().optional(),
});

// GET /api/admin/categories — list all categories with product count
export async function GET(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories.map(c => ({
        ...c,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DB_ERROR', message: 'Failed to fetch categories.' } },
      { status: 503 }
    );
  }
}

// POST /api/admin/categories — create a new category
export async function POST(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      }, { status: 400 });
    }

    const { name, slug, description, image } = parsed.data;

    // Get the next sort order
    const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const nextSort = (maxSort._max.sortOrder || 0) + 1;

    const category = await prisma.category.create({
      data: { name, slug, description, image, sortOrder: nextSort },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: { code: 'SLUG_CONFLICT', message: 'A category with this slug already exists.' },
      }, { status: 409 });
    }
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to create category.' } },
      { status: 500 }
    );
  }
}
