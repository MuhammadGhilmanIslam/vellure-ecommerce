import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'connected';

    return NextResponse.json(
      {
        status: 'ok',
        environment: process.env.NODE_ENV,
        database: dbStatus,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'degraded',
        environment: process.env.NODE_ENV,
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 503 }
    );
  }
}
