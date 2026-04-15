'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Category { id: string; name: string; slug: string; }

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    stock: '0',
    sku: '',
    weight: '',
    status: 'DRAFT' as string,
    categoryIds: [] as string[],
    images: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch('/api/admin/categories'),
        ]);
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (catJson.success) setCategories(catJson.data);

        if (prodJson.success) {
          const p = prodJson.data;
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: String(p.price || ''),
            comparePrice: p.comparePrice ? String(p.comparePrice) : '',
            stock: String(p.stock || 0),
            sku: p.sku || '',
            weight: p.weight ? String(p.weight) : '',
            status: p.status || 'DRAFT',
            categoryIds: p.categories?.map((c: any) => c.categoryId || c.category?.id) || [],
            images: p.images?.map((img: any) => img.url) || [],
          });
        } else {
          toast.error('Produk tidak ditemukan');
          router.push('/admin/products');
        }
      } catch {
        toast.error('Gagal memuat data produk');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, router]);

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (id: string) => {
    setForm(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(c => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.success) {
          setForm(prev => ({ ...prev, images: [...prev.images, json.data.url] }));
        } else {
          toast.error(json.error?.message || 'Upload gagal');
        }
      } catch {
        toast.error('Upload gagal');
      }
    }
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (url: string) => {
    setForm(prev => ({ ...prev, images: prev.images.filter(i => i !== url) }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price || form.categoryIds.length === 0) {
      toast.error('Mohon isi Name, Description, Price, dan pilih minimal 1 kategori');
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        shortDescription: form.shortDescription || null,
        price: parseInt(form.price),
        comparePrice: form.comparePrice ? parseInt(form.comparePrice) : null,
        stock: parseInt(form.stock) || 0,
        sku: form.sku || null,
        weight: form.weight ? parseInt(form.weight) : null,
        status: form.status,
        categoryIds: form.categoryIds,
        images: form.images,
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.success) {
        toast.success('Produk berhasil diupdate!');
        router.push('/admin/products');
      } else {
        toast.error(json.error?.message || 'Gagal mengupdate produk');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10 pt-20 lg:pt-10 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C8A96E]" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-[#F0EDE8] rounded transition-colors">
          <ArrowLeft className="h-5 w-5 text-[#5A5650]" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Edit Product</h1>
          <p className="text-sm text-[#5A5650] mt-1">{form.name}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white border border-[#E8E4DE] p-6 shadow-xs space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Product Name *</label>
              <input value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Slug</label>
              <input value={form.slug} onChange={e => updateField('slug', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Short Description</label>
            <input value={form.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]" maxLength={300} />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Description *</label>
            <textarea value={form.description} onChange={e => updateField('description', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E] h-32 resize-none" />
          </div>
        </section>

        {/* Pricing & Inventory */}
        <section className="bg-white border border-[#E8E4DE] p-6 shadow-xs space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Pricing & Inventory</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Price (Rp) *</label>
              <input type="number" value={form.price} onChange={e => updateField('price', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Compare Price</label>
              <input type="number" value={form.comparePrice} onChange={e => updateField('comparePrice', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => updateField('stock', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">SKU</label>
              <input value={form.sku} onChange={e => updateField('sku', e.target.value)} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
        </section>

        {/* Organization */}
        <section className="bg-white border border-[#E8E4DE] p-6 shadow-xs space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Organization</h2>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-2">Categories *</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c.id} type="button" onClick={() => toggleCategory(c.id)}
                  className={`px-3 py-1.5 text-xs font-mono border transition-colors ${form.categoryIds.includes(c.id)
                    ? 'bg-[#0A0A08] text-white border-[#0A0A08]'
                    : 'border-[#E8E4DE] text-[#5A5650] hover:border-[#C8A96E]'
                  }`}
                >{c.name}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1">Status</label>
            <select value={form.status} onChange={e => updateField('status', e.target.value)} className="border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2 text-sm focus:outline-none focus:border-[#C8A96E]">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white border border-[#E8E4DE] p-6 shadow-xs space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Images</h2>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 border border-[#E8E4DE] bg-[#F0EDE8] overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-[#E8E4DE] flex flex-col items-center justify-center cursor-pointer hover:border-[#C8A96E] transition-colors">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin text-[#C8A96E]" /> : <Upload className="h-5 w-5 text-[#C8C4BE]" />}
              <span className="text-[10px] text-[#8A8680] mt-1">{uploading ? 'Uploading' : 'Upload'}</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Link href="/admin/products" className="px-6 py-2.5 text-xs font-mono text-[#5A5650] border border-[#E8E4DE] hover:bg-[#F0EDE8] transition-colors uppercase tracking-widest">
            Cancel
          </Link>
          <button onClick={handleSubmit} disabled={saving}
            className="px-8 py-2.5 text-xs font-mono bg-[#0A0A08] text-white hover:bg-[#C8A96E] transition-colors uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            {saving ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
