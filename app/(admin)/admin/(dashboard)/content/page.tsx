'use client';

import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Megaphone, Plus, Edit2, Trash2, Eye, Calendar } from 'lucide-react';

const MOCK_BANNERS = [
  { id: '1', title: 'New Collection 2826', type: 'HERO_BANNER', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80', updated: '2026-04-08' },
  { id: '2', title: 'Ramadan Sale 40%', type: 'PROMO_BANNER', status: 'ACTIVE', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', updated: '2026-04-05' },
  { id: '3', title: 'Free Shipping March', type: 'ANNOUNCEMENT', status: 'EXPIRED', image: '', updated: '2026-03-31' },
];

const MOCK_PAGES = [
  { id: '1', title: 'Privacy Policy', slug: '/privacy', status: 'PUBLISHED', updated: '2026-03-15' },
  { id: '2', title: 'Terms & Conditions', slug: '/terms', status: 'PUBLISHED', updated: '2026-03-15' },
  { id: '3', title: 'FAQ', slug: '/faq', status: 'DRAFT', updated: '2026-04-01' },
  { id: '4', title: 'Size Guide', slug: '/size-guide', status: 'PUBLISHED', updated: '2026-02-20' },
];

type Tab = 'banners' | 'pages';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('banners');

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Content Manager</h1>
          <p className="text-sm text-[#5A5650] mt-1">Manage banners, pages, and promotional content.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0A0A08] text-white px-5 py-2.5 text-xs font-mono uppercase tracking-widest hover:bg-[#C8A96E] transition-colors">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-0 border-b border-[#E8E4DE]">
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-6 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'banners' ? 'border-[#C8A96E] text-[#1A1814]' : 'border-transparent text-[#8A8680] hover:text-[#5A5650]'
          }`}
        >
          <Megaphone className="inline h-4 w-4 mr-2 -mt-0.5" /> Banners
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-6 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'pages' ? 'border-[#C8A96E] text-[#1A1814]' : 'border-transparent text-[#8A8680] hover:text-[#5A5650]'
          }`}
        >
          <FileText className="inline h-4 w-4 mr-2 -mt-0.5" /> Pages
        </button>
      </div>

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BANNERS.map(banner => (
            <div key={banner.id} className="bg-white border border-[#E8E4DE] shadow-xs overflow-hidden group">
              <div className="aspect-[16/9] bg-[#F0EDE8] relative overflow-hidden">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-[#C8C4BE]" />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono uppercase rounded-full ${
                  banner.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {banner.status}
                </span>
              </div>
              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#C8A96E] mb-1">{banner.type.replace('_', ' ')}</p>
                <h3 className="font-medium text-[#1A1814] mb-2">{banner.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8A8680] font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {banner.updated}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-[#8A8680] hover:text-[#C8A96E] hover:bg-[#F0EDE8] rounded transition-colors">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 text-[#8A8680] hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white border border-[#E8E4DE] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F4EE] border-b border-[#E8E4DE]">
                <tr>
                  <th className="py-3 px-6 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Title</th>
                  <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden md:table-cell">Slug</th>
                  <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Status</th>
                  <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden lg:table-cell">Last Updated</th>
                  <th className="py-3 px-6 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {MOCK_PAGES.map(page => (
                  <tr key={page.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-[#C8A96E] shrink-0" />
                        <span className="text-sm font-medium text-[#1A1814]">{page.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#8A8680] hidden md:table-cell">{page.slug}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase rounded-full ${
                        page.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{page.status}</span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#8A8680] hidden lg:table-cell font-mono">{page.updated}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-[#8A8680] hover:text-[#1A1814] hover:bg-[#F0EDE8] rounded transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-[#8A8680] hover:text-[#C8A96E] hover:bg-[#F0EDE8] rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-[#8A8680] hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
