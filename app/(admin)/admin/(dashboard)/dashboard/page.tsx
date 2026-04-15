import React from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign, AlertTriangle, Clock, Star } from 'lucide-react';
import { AdminRevenueChart } from '@/components/admin/RevenueChart';
import { formatPrice } from '@/lib/utils';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  try {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      totalCustomers,
      recentOrders,
      topProducts,
      pendingOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count({ where: { stock: { lte: 10 }, status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true } },
          items: { select: { quantity: true } },
        },
      }),
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { totalSold: 'desc' },
        take: 5,
        select: { name: true, totalSold: true, price: true, stock: true },
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      totalCustomers,
      recentOrders: recentOrders.map(o => ({
        id: o.orderNumber,
        customer: o.customerName || o.user?.name || 'Guest',
        items: o.items.reduce((sum, i) => sum + i.quantity, 0),
        total: o.total,
        status: o.status,
        time: getTimeAgo(o.createdAt),
      })),
      topProducts: topProducts.map((p, i) => ({
        rank: i + 1,
        name: p.name,
        sold: p.totalSold,
        revenue: p.totalSold * p.price,
        stock: p.stock,
      })),
      pendingOrders,
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return null;
  }
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  PAYMENT_PENDING: { label: 'Awaiting Payment', color: 'bg-orange-100 text-orange-800' },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  PACKED: { label: 'Packed', color: 'bg-indigo-100 text-indigo-800' },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  // Fallback values if DB unavailable
  const data = stats || {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    pendingOrders: 0,
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Dashboard</h1>
          <p className="text-[#5A5650] text-sm mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <span className={`text-xs font-mono px-3 py-1.5 rounded-full ${stats ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {stats ? '● Database Connected' : '● Database Offline'}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={String(data.totalOrders)}
          icon={<ShoppingCart className="h-5 w-5" />}
          href="/admin/orders"
          accentColor="text-blue-600"
        />
        <StatCard
          title="Active Products"
          value={String(data.activeProducts)}
          icon={<Package className="h-5 w-5" />}
          href="/admin/products"
          accentColor="text-orange-600"
          warning={data.lowStockProducts > 0 ? `${data.lowStockProducts} low stock` : undefined}
        />
        <StatCard
          title="Total Customers"
          value={String(data.totalCustomers)}
          icon={<Users className="h-5 w-5" />}
          href="/admin/users"
          accentColor="text-purple-600"
        />
        <StatCard
          title="Total Products"
          value={String(data.totalProducts)}
          icon={<DollarSign className="h-5 w-5" />}
          href="/admin/products"
          accentColor="text-emerald-600"
        />
      </div>

      {/* Revenue Chart + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white border border-[#E8E4DE] p-6 rounded-sm shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-[#1A1814]">Revenue Overview</h2>
            <div className="flex gap-1">
              {['7D', '30D', '3M'].map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${t === '30D' ? 'bg-[#0A0A08] text-white' : 'text-[#5A5650] hover:bg-[#F0EDE8]'}`}
                >{t}</button>
              ))}
            </div>
          </div>
          <AdminRevenueChart />
        </div>

        {/* Top Products */}
        <div className="bg-white border border-[#E8E4DE] p-6 rounded-sm shadow-xs">
          <h2 className="font-semibold text-[#1A1814] mb-6">Top Products</h2>
          <div className="space-y-4">
            {data.topProducts.length > 0 ? data.topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#8A8680] w-6 shrink-0 text-right">
                  {String(p.rank).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1814] truncate">{p.name}</p>
                  <p className="text-xs text-[#5A5650] mt-0.5">{p.sold} sold · {formatPrice(p.revenue)}</p>
                </div>
                <div className={`text-xs font-mono px-2 py-1 rounded ${p.stock < 10 ? 'bg-red-50 text-red-700' : 'bg-[#F0EDE8] text-[#5A5650]'}`}>
                  {p.stock}
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#8A8680] text-center py-4">No product data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-[#E8E4DE] rounded-sm shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-[#E8E4DE]">
            <h2 className="font-semibold text-[#1A1814]">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs font-mono text-[#C8A96E] hover:underline uppercase tracking-widest">
              See All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F4EE]">
                <tr>
                  <th className="text-left py-3 px-6 font-mono text-xs uppercase tracking-widest text-[#8A8680]">Order ID</th>
                  <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-widest text-[#8A8680]">Customer</th>
                  <th className="text-right py-3 px-4 font-mono text-xs uppercase tracking-widest text-[#8A8680]">Total</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-[#8A8680]">Status</th>
                  <th className="text-right py-3 px-6 font-mono text-xs uppercase tracking-widest text-[#8A8680]">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {data.recentOrders.length > 0 ? data.recentOrders.map((order) => {
                  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-[#F8F4EE] transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-[#1A1814]">{order.id}</td>
                      <td className="py-4 px-4 text-[#1A1814]">{order.customer}</td>
                      <td className="py-4 px-4 text-right font-medium text-[#1A1814]">{formatPrice(order.total)}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-mono ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-[#8A8680] text-xs">{order.time}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-sm text-[#8A8680]">
                      Belum ada order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="bg-white border border-[#E8E4DE] p-6 rounded-sm shadow-xs">
          <h2 className="font-semibold text-[#1A1814] mb-6">Alerts</h2>
          <div className="space-y-4">
            {data.lowStockProducts > 0 && (
              <AlertItem
                icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                bg="bg-red-50"
                text={`${data.lowStockProducts} products are nearly out of stock`}
                link="/admin/products"
              />
            )}
            {data.pendingOrders > 0 && (
              <AlertItem
                icon={<Clock className="h-4 w-4 text-orange-500" />}
                bg="bg-orange-50"
                text={`${data.pendingOrders} orders pending`}
                link="/admin/orders"
              />
            )}
            {data.lowStockProducts === 0 && data.pendingOrders === 0 && (
              <div className="text-center py-4">
                <Star className="h-6 w-6 text-[#C8A96E] mx-auto mb-2" />
                <p className="text-sm text-[#8A8680]">All clear! No alerts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title, value, change, icon, href, accentColor, suffix, warning,
}: {
  title: string; value: string; change?: number; icon: React.ReactNode;
  href: string; accentColor: string; suffix?: string; warning?: string;
}) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <a href={href} className="group bg-white border border-[#E8E4DE] p-6 rounded-sm hover:border-[#C8A96E] hover:shadow-md transition-all shadow-xs block">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg bg-[#F0EDE8] ${accentColor} group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-mono ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-[#1A1814] mb-1">{value}</div>
      <div className="text-xs text-[#5A5650] font-medium">{title}</div>
      {suffix && <div className="text-xs text-[#8A8680] mt-1">{suffix}</div>}
      {warning && (
        <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
          <AlertTriangle className="h-3 w-3" /> {warning}
        </div>
      )}
    </a>
  );
}

function AlertItem({ icon, bg, text, link }: { icon: React.ReactNode; bg: string; text: string; link: string }) {
  return (
    <a href={link} className={`flex items-center gap-3 p-3 rounded-sm ${bg} hover:opacity-80 transition-opacity`}>
      {icon}
      <span className="text-xs text-[#1A1814] flex-1">{text}</span>
      <span className="text-xs text-[#8A8680]">→</span>
    </a>
  );
}
