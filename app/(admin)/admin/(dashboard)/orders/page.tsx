'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, ChevronDown, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  courier: string;
  courierService: string;
  createdAt: string;
  items: any[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  PAYMENT_PENDING: { label: 'Awaiting Payment', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  PACKED: { label: 'Packed', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  SHIPPED: { label: 'Shipped', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
};

const ALL_STATUSES = ['PENDING', 'PAYMENT_PENDING', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('q', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/orders?${params}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
        setMeta(json.meta);
      }
    } catch {
      toast.error('Gagal memuat orders');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status berhasil diubah ke ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
        fetchOrders();
      } else {
        toast.error(json.error?.message || 'Gagal mengubah status');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Orders</h1>
          <p className="text-sm text-[#5A5650] mt-1">
            {loading ? 'Loading...' : `${meta.total} orders total`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(tab => (
            <button
              key={tab}
              onClick={() => { setStatusFilter(tab === 'All' ? '' : tab.toUpperCase()); setPage(1); }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
                (tab === 'All' && !statusFilter) || statusFilter === tab.toUpperCase()
                  ? 'bg-[#0A0A08] text-white border-[#0A0A08]'
                  : 'text-[#5A5650] border-[#E8E4DE] hover:border-[#C8A96E]'
              }`}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E8E4DE] p-4 shadow-xs flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A8680]" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#E8E4DE] bg-[#F8F4EE] focus:outline-none focus:border-[#C8A96E] transition-colors text-[#1A1814]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E4DE] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C8A96E]" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F4EE] border-b border-[#E8E4DE]">
                  <tr>
                    <th className="py-3 px-6 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Order ID</th>
                    <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Customer</th>
                    <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden md:table-cell">Items</th>
                    <th className="py-3 px-4 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Total</th>
                    <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Status</th>
                    <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden xl:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {orders.map(order => {
                    const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    return (
                      <tr key={order.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-[#1A1814] font-medium">{order.orderNumber}</td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-medium text-[#1A1814]">{order.customerName}</p>
                          <p className="text-xs text-[#8A8680]">{order.customerEmail}</p>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-[#5A5650] hidden md:table-cell">
                          {order.items?.length || 0} items
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-[#1A1814] text-sm">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              disabled={updatingOrder === order.id}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              className={`appearance-none pl-2 pr-6 py-1 text-xs font-mono border rounded-full cursor-pointer focus:outline-none ${statusCfg.color} ${updatingOrder === order.id ? 'opacity-50' : ''}`}
                            >
                              {ALL_STATUSES.map(s => (
                                <option key={s} value={s} className="bg-white text-[#1A1814]">
                                  {STATUS_CONFIG[s]?.label || s}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1.5 h-3 w-3 pointer-events-none" />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#8A8680] hidden xl:table-cell font-mono">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-sm text-[#8A8680]">
                        Belum ada order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#E8E4DE] px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-[#8A8680] font-mono">
                Showing {orders.length} of {meta.total} orders
              </span>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="px-3 py-1 text-xs border border-[#E8E4DE] text-[#5A5650] hover:bg-[#F0EDE8] transition-colors font-mono disabled:opacity-40">← Prev</button>
                <button className="px-3 py-1 text-xs bg-[#0A0A08] text-white font-mono">{page}</button>
                <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages}
                  className="px-3 py-1 text-xs border border-[#E8E4DE] text-[#5A5650] hover:bg-[#F0EDE8] transition-colors font-mono disabled:opacity-40">Next →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
