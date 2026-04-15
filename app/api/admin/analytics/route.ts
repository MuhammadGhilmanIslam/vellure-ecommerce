import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data when DB is offline
const MOCK_ANALYTICS = {
  revenue: {
    total: 12500000,
    change: 12.3,
    chart: [
      { date: '2026-04-01', value: 850000 },
      { date: '2026-04-05', value: 1250000 },
      { date: '2026-04-10', value: 980000 },
      { date: '2026-04-15', value: 1800000 },
      { date: '2026-04-20', value: 2100000 },
      { date: '2026-04-25', value: 2400000 },
      { date: '2026-04-30', value: 3100000 },
    ],
  },
  orders: { today: 28, change: 5, total: 342 },
  products: { active: 156, lowStock: 3, outOfStock: 1 },
  customers: { total: 1240, newThisWeek: 24 },
  topProducts: [
    { id: 'p1', name: 'Gravity Tee — Obsidian', sold: 312, revenue: 151320000, stock: 45 },
    { id: 'p2', name: 'Drift Overshirt — Sand', sold: 187, revenue: 167465000, stock: 8 },
    { id: 'p3', name: 'Void Hoodie — Carbon', sold: 203, revenue: 182695000, stock: 22 },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';

  // In production: query DB based on period
  // For now, return mock data
  return NextResponse.json({
    success: true,
    data: MOCK_ANALYTICS,
    meta: { period },
  });
}
