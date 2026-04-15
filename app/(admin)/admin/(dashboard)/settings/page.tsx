'use client';

import React, { useState } from 'react';
import { Store, Globe, CreditCard, Bell, Palette, Save, Check } from 'lucide-react';

type SettingsTab = 'general' | 'payments' | 'notifications' | 'appearance';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    storeName: 'Vellure',
    tagline: 'Where Elegance Meets Intention',
    email: 'concierge@vellure.id',
    phone: '+62 812 3456 7890',
    address: 'Jl. Sudirman No. 88, Jakarta Selatan',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
  });

  const [payments, setPayments] = useState({
    midtransServerKey: '',
    midtransClientKey: '',
    isProduction: false,
    codEnabled: true,
    bankTransferEnabled: true,
  });

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    shippingUpdate: true,
    promotionalEmails: false,
    stockAlerts: true,
    adminNewOrder: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: Store },
    { id: 'payments' as SettingsTab, label: 'Payments', icon: CreditCard },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Settings</h1>
          <p className="text-sm text-[#5A5650] mt-1">Configure your store preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-widest transition-all ${
            saved ? 'bg-emerald-600 text-white' : 'bg-[#0A0A08] text-white hover:bg-[#C8A96E]'
          }`}
        >
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Tab Navigation */}
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white border border-[#E8E4DE] text-[#1A1814] font-medium shadow-xs'
                    : 'text-[#5A5650] hover:bg-[#F0EDE8]/50 hover:text-[#1A1814]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white border border-[#E8E4DE] p-8 shadow-xs space-y-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Store Information</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Store Name</label>
                  <input value={general.storeName} onChange={e => setGeneral({ ...general, storeName: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E]" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Tagline</label>
                  <input value={general.tagline} onChange={e => setGeneral({ ...general, tagline: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E]" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Contact Email</label>
                  <input value={general.email} onChange={e => setGeneral({ ...general, email: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E]" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Phone Number</label>
                  <input value={general.phone} onChange={e => setGeneral({ ...general, phone: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E]" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Address</label>
                <textarea value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E] h-20 resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Currency</label>
                  <select value={general.currency} onChange={e => setGeneral({ ...general, currency: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E]">
                    <option value="IDR">IDR — Indonesian Rupiah</option>
                    <option value="USD">USD — US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Timezone</label>
                  <select value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E]">
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Midtrans Configuration</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Server Key</label>
                  <input type="password" value={payments.midtransServerKey} onChange={e => setPayments({ ...payments, midtransServerKey: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E] font-mono" placeholder="SB-Mid-server-..." />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Client Key</label>
                  <input type="password" value={payments.midtransClientKey} onChange={e => setPayments({ ...payments, midtransClientKey: e.target.value })} className="w-full border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E] font-mono" placeholder="SB-Mid-client-..." />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={payments.isProduction} onChange={e => setPayments({ ...payments, isProduction: e.target.checked })} className="accent-[#C8A96E] h-4 w-4" />
                <span className="text-sm text-[#5A5650] group-hover:text-[#1A1814] transition-colors">Production Mode</span>
              </label>

              <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3 pt-4">Payment Methods</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between bg-[#F8F4EE] border border-[#E8E4DE] p-4 cursor-pointer group">
                  <span className="text-sm text-[#1A1814] font-medium">Cash on Delivery (COD)</span>
                  <input type="checkbox" checked={payments.codEnabled} onChange={e => setPayments({ ...payments, codEnabled: e.target.checked })} className="accent-[#C8A96E] h-4 w-4" />
                </label>
                <label className="flex items-center justify-between bg-[#F8F4EE] border border-[#E8E4DE] p-4 cursor-pointer group">
                  <span className="text-sm text-[#1A1814] font-medium">Bank Transfer</span>
                  <input type="checkbox" checked={payments.bankTransferEnabled} onChange={e => setPayments({ ...payments, bankTransferEnabled: e.target.checked })} className="accent-[#C8A96E] h-4 w-4" />
                </label>
              </div>
            </>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Customer Notifications</h2>
              <div className="space-y-3">
                {([
                  { key: 'orderConfirmation', label: 'Order Confirmation Email' },
                  { key: 'shippingUpdate', label: 'Shipping Status Updates' },
                  { key: 'promotionalEmails', label: 'Promotional & Marketing Emails' },
                ] as const).map(item => (
                  <label key={item.key} className="flex items-center justify-between bg-[#F8F4EE] border border-[#E8E4DE] p-4 cursor-pointer">
                    <span className="text-sm text-[#1A1814]">{item.label}</span>
                    <input type="checkbox" checked={notifications[item.key]} onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })} className="accent-[#C8A96E] h-4 w-4" />
                  </label>
                ))}
              </div>

              <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3 pt-4">Admin Notifications</h2>
              <div className="space-y-3">
                {([
                  { key: 'stockAlerts', label: 'Low Stock Alerts' },
                  { key: 'adminNewOrder', label: 'New Order Notification' },
                ] as const).map(item => (
                  <label key={item.key} className="flex items-center justify-between bg-[#F8F4EE] border border-[#E8E4DE] p-4 cursor-pointer">
                    <span className="text-sm text-[#1A1814]">{item.label}</span>
                    <input type="checkbox" checked={notifications[item.key]} onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })} className="accent-[#C8A96E] h-4 w-4" />
                  </label>
                ))}
              </div>
            </>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[#8A8680] border-b border-[#E8E4DE] pb-3">Theme & Branding</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Primary Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" defaultValue="#C8A96E" className="h-10 w-16 border border-[#E8E4DE] cursor-pointer bg-transparent" />
                    <input type="text" defaultValue="#C8A96E" className="flex-1 border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E] font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" defaultValue="#0A0A08" className="h-10 w-16 border border-[#E8E4DE] cursor-pointer bg-transparent" />
                    <input type="text" defaultValue="#0A0A08" className="flex-1 border border-[#E8E4DE] bg-[#F8F4EE] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C8A96E] font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-[#5A5650] mb-1.5">Logo (Upload)</label>
                <div className="border-2 border-dashed border-[#E8E4DE] bg-[#F8F4EE] p-8 text-center cursor-pointer hover:border-[#C8A96E] transition-colors">
                  <Palette className="h-8 w-8 text-[#C8C4BE] mx-auto mb-2" />
                  <p className="text-sm text-[#5A5650]">Click or drag to upload logo</p>
                  <p className="text-xs text-[#8A8680] mt-1 font-mono">SVG, PNG or JPG · Max 2MB</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
