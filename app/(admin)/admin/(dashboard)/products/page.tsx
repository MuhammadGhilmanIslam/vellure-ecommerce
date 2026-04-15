'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Eye, ArrowUpDown,
  CheckSquare, Square, Loader2, Copy,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  stock: number;
  status: string;
  totalSold: number;
  images: { url: string }[];
  categories: { category: { name: string } }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  ARCHIVED: 'bg-red-100 text-red-600',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('q', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
        setMeta(json.meta);
      } else {
        toast.error('Gagal memuat produk');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Produk berhasil dihapus');
        fetchProducts();
      } else {
        toast.error(json.error?.message || 'Gagal menghapus produk');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === products.length ? [] : products.map(p => p.id));

  const getImage = (p: Product) => p.images?.[0]?.url || '';
  const getCategory = (p: Product) => p.categories?.[0]?.category?.name || 'Uncategorized';

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Products</h1>
          <p className="text-sm text-[#5A5650] mt-1">
            {loading ? 'Loading...' : `${meta.total} products total`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#0A0A08] text-white px-5 py-2.5 text-sm font-mono uppercase tracking-widest hover:bg-[#C8A96E] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#E8E4DE] p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A8680]" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#E8E4DE] focus:outline-none focus:border-[#C8A96E] bg-[#F8F4EE] text-[#1A1814] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm text-[#5A5650] focus:outline-none focus:border-[#C8A96E]"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-[#C8A96E]/10 border border-[#C8A96E]/30 px-4 py-3 flex items-center gap-4">
          <span className="text-sm font-medium text-[#8B6914]">{selected.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => { setSelected([]); toast.info('Bulk actions coming soon'); }}
              className="text-xs font-mono uppercase tracking-wider px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              Delete ({selected.length})
            </button>
          </div>
        </div>
      )}

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
                    <th className="py-3 px-4 text-left">
                      <button onClick={toggleAll}>
                        {selected.length === products.length && products.length > 0
                          ? <CheckSquare className="h-4 w-4 text-[#C8A96E]" />
                          : <Square className="h-4 w-4 text-[#8A8680]" />}
                      </button>
                    </th>
                    <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Product</th>
                    <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden md:table-cell">SKU</th>
                    <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden lg:table-cell">Category</th>
                    <th className="py-3 px-4 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">
                      <span className="flex items-center justify-end gap-1">Price <ArrowUpDown className="h-3 w-3" /></span>
                    </th>
                    <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Stock</th>
                    <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden sm:table-cell">Status</th>
                    <th className="py-3 px-4 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {products.map(product => (
                    <tr key={product.id} className={`hover:bg-[#FAFAF8] transition-colors ${selected.includes(product.id) ? 'bg-[#C8A96E]/5' : ''}`}>
                      <td className="py-4 px-4">
                        <button onClick={() => toggleSelect(product.id)}>
                          {selected.includes(product.id)
                            ? <CheckSquare className="h-4 w-4 text-[#C8A96E]" />
                            : <Square className="h-4 w-4 text-[#C8C4BE]" />}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {getImage(product) ? (
                            <img src={getImage(product)} alt={product.name} className="w-12 h-12 object-cover bg-[#F0EDE8] flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-[#F0EDE8] flex-shrink-0 flex items-center justify-center text-[#C8C4BE] text-xs">No img</div>
                          )}
                          <div>
                            <p className="font-medium text-[#1A1814] text-sm">{product.name}</p>
                            <p className="text-xs text-[#8A8680] mt-0.5">{product.totalSold} sold</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#5A5650] hidden md:table-cell">{product.sku || '—'}</td>
                      <td className="py-4 px-4 text-sm text-[#5A5650] hidden lg:table-cell">{getCategory(product)}</td>
                      <td className="py-4 px-4 text-right font-medium text-[#1A1814] text-sm">{formatPrice(product.price)}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-mono text-xs font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-orange-500' : 'text-[#1A1814]'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center hidden sm:table-cell">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono ${STATUS_STYLE[product.status] || ''}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/product/${product.slug}`} target="_blank" className="p-1.5 text-[#8A8680] hover:text-[#1A1814] hover:bg-[#F0EDE8] rounded transition-colors">
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-[#8A8680] hover:text-[#1A1814] hover:bg-[#F0EDE8] rounded transition-colors">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="p-1.5 text-[#8A8680] hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            {deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !loading && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-sm text-[#8A8680]">
                        Tidak ada produk ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-[#E8E4DE] px-6 py-4 flex items-center justify-between text-xs text-[#8A8680] font-mono">
              <span>Showing {products.length} of {meta.total} products (Page {page}/{meta.totalPages})</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 border border-[#E8E4DE] hover:bg-[#F0EDE8] transition-colors disabled:opacity-40"
                >←</button>
                {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 ${page === p ? 'bg-[#0A0A08] text-white' : 'border border-[#E8E4DE] hover:bg-[#F0EDE8]'} transition-colors`}
                  >{p}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="px-3 py-1 border border-[#E8E4DE] hover:bg-[#F0EDE8] transition-colors disabled:opacity-40"
                >→</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
