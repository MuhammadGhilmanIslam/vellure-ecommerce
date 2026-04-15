'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      } else {
        toast.error('Gagal memuat kategori');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', image: '' });
    setShowForm(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '' });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        setFormData(prev => ({ ...prev, image: json.data.url }));
        toast.success('Gambar berhasil diupload');
      } else {
        toast.error(json.error?.message || 'Upload gagal');
      }
    } catch {
      toast.error('Upload gagal');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Nama dan slug wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(editingId ? 'Kategori berhasil diupdate' : 'Kategori berhasil ditambahkan');
        setShowForm(false);
        setFormData({ name: '', slug: '', description: '', image: '' });
        setEditingId(null);
        fetchCategories();
      } else {
        toast.error(json.error?.message || 'Gagal menyimpan kategori');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (json.success) {
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      } else {
        toast.error(json.error?.message || 'Gagal menghapus kategori');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Categories</h1>
          <p className="text-sm text-[#5A5650] mt-1">
            {loading ? 'Loading...' : `${categories.length} categories`}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#0A0A08] text-white px-5 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-[#C8A96E] transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-[#E8E4DE] p-6 shadow-xs space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680]">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Name</label>
              <input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Slug</label>
              <input
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E] font-mono"
                placeholder="category-slug"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E] h-20 resize-none"
              placeholder="Brief description..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-2">Cover Image</label>
            <div className="flex items-start gap-4">
              {formData.image ? (
                <div className="relative w-32 h-20 border border-[#E8E4DE] bg-[#F0EDE8] overflow-hidden group shrink-0">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
              <label className={`flex items-center gap-2 px-4 py-2 text-xs font-mono border border-dashed border-[#E8E4DE] cursor-pointer hover:border-[#C8A96E] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin text-[#C8A96E]" /> : <Upload className="h-4 w-4 text-[#8A8680]" />}
                <span className="text-[#5A5650]">{uploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {formData.image && (
              <p className="text-xs text-[#8A8680] font-mono mt-1 truncate">{formData.image}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 text-xs font-mono text-[#5A5650] border border-[#E8E4DE] hover:bg-[#F0EDE8] transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-xs font-mono bg-[#0A0A08] text-white hover:bg-[#C8A96E] transition-colors uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white border border-[#E8E4DE] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C8A96E]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F4EE] border-b border-[#E8E4DE]">
                <tr>
                  <th className="py-3 px-6 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] w-8"></th>
                  <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Image</th>
                  <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Category</th>
                  <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden md:table-cell">Slug</th>
                  <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Products</th>
                  <th className="py-3 px-6 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="py-4 px-6 text-[#C8C4BE] cursor-grab">
                      <GripVertical className="h-4 w-4" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-12 w-16 bg-[#F0EDE8] border border-[#E8E4DE] rounded-sm overflow-hidden flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-[#C8C4BE]" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-[#1A1814]">{cat.name}</p>
                      <p className="text-xs text-[#8A8680] line-clamp-1">{cat.description}</p>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#8A8680] hidden md:table-cell">/{cat.slug}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center h-6 w-10 bg-[#F0EDE8] text-xs font-mono text-[#5A5650] rounded-full">
                        {cat.productCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(cat)} className="p-1.5 text-[#8A8680] hover:text-[#C8A96E] hover:bg-[#F0EDE8] rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="p-1.5 text-[#8A8680] hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          {deletingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-sm text-[#8A8680]">
                      Belum ada kategori. Klik "Add Category" untuk menambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
