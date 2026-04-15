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

// GET /api/admin/orders
export async function GET(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');
  const q = searchParams.get('q');

  try {
    const where: any = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit, take: limit,
        include: {
          user: { select: { name: true, email: true } },
          items: { take: 3 },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  }
}

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAYMENT_PENDING', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED']),
  trackingNumber: z.string().optional(),
  adminNotes: z.string().optional(),
});

// PUT /api/admin/orders — update order status
export async function PUT(request: NextRequest) {
  const session = await auth();
  const authError = requireAdmin(session);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderId, ...updateData } = body;

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: { code: 'MISSING_ID', message: 'Order ID is required.' },
      }, { status: 400 });
    }

    const parsed = updateOrderSchema.safeParse(updateData);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0].message },
      }, { status: 400 });
    }

    const data: any = { status: parsed.data.status };
    if (parsed.data.trackingNumber) data.trackingNumber = parsed.data.trackingNumber;
    if (parsed.data.adminNotes) data.adminNotes = parsed.data.adminNotes;

    // Set timestamps based on status
    if (parsed.data.status === 'SHIPPED') data.shippedAt = new Date();
    if (parsed.data.status === 'DELIVERED') data.deliveredAt = new Date();
    if (parsed.data.status === 'CANCELLED') data.cancelledAt = new Date();

    const order = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    // Create status history
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: parsed.data.status,
        note: parsed.data.adminNotes,
        createdBy: session!.user!.id,
      },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found.' },
      }, { status: 404 });
    }
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update order.' } },
      { status: 500 }
    );
  }
}
