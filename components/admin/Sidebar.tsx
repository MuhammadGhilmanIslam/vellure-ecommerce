'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Image, Settings,
  LogOut, Menu, X, ChevronRight, Plus,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/admin/products', label: 'Products', icon: Package,
    children: [
      { href: '/admin/products', label: 'All Products' },
      { href: '/admin/products/new', label: 'Add New' },
      { href: '/admin/categories', label: 'Categories' },
    ],
  },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/content', label: 'Content', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>('/admin/products');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#E8E4DE]">
        <Link href="/admin/dashboard" className="font-display italic text-lg tracking-wide text-[#1A1814]">
          VELLURE ADMIN
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExpanded = expandedItem === item.href;

          return (
            <div key={item.href}>
              {item.children ? (
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all group ${isActive ? 'bg-[#C8A96E]/10 text-[#8B6914] border-l-2 border-[#C8A96E] pl-[10px]' : 'text-[#5A5650] hover:bg-[#E8E4DE]/60 hover:text-[#1A1814]'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all group ${isActive ? 'bg-[#C8A96E]/10 text-[#8B6914] border-l-2 border-[#C8A96E] pl-[10px]' : 'text-[#5A5650] hover:bg-[#E8E4DE]/60 hover:text-[#1A1814]'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}

              {/* Sub items */}
              {item.children && isExpanded && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs rounded-sm transition-colors ${pathname === child.href ? 'text-[#8B6914] font-semibold' : 'text-[#8A8680] hover:text-[#1A1814]'}`}
                    >
                      {child.label === 'Add New' && <Plus className="h-3 w-3" />}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#E8E4DE]">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#5A5650] hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors group"
        >
          <LogOut className="h-4 w-4 group-hover:scale-105 transition-transform" />
          <span>Logout</span>
        </button>

        <div className="mt-3 px-3">
          <Link href="/" target="_blank" className="text-xs text-[#C8A96E] hover:underline font-mono">
            ↗ View Store
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E8E4DE] z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#E8E4DE] z-40 flex items-center justify-between px-4">
        <Link href="/admin/dashboard" className="font-display italic text-lg text-[#1A1814]">
          VELLURE ADMIN
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsMobileOpen(false)}
        >
          <aside
            className="w-72 h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
