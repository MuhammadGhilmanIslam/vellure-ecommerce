'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Shield, ShieldAlert, Ban, Mail, ChevronDown } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'Rina Kartika', email: 'rina@gmail.com', role: 'USER', status: 'ACTIVE', orders: 12, spent: 4850000, joined: '2025-11-02', avatar: '' },
  { id: '2', name: 'Demas Arya', email: 'demas@gmail.com', role: 'USER', status: 'ACTIVE', orders: 8, spent: 3200000, joined: '2025-12-15', avatar: '' },
  { id: '3', name: 'Sarah Wijaya', email: 'sarah@gmail.com', role: 'USER', status: 'ACTIVE', orders: 23, spent: 8750000, joined: '2025-09-20', avatar: '' },
  { id: '4', name: 'Ahmad Farrel', email: 'ahmad@gmail.com', role: 'USER', status: 'BANNED', orders: 1, spent: 150000, joined: '2026-01-10', avatar: '' },
  { id: '5', name: 'Admin User', email: 'admin@vellure.id', role: 'ADMIN', status: 'ACTIVE', orders: 0, spent: 0, joined: '2024-06-01', avatar: '' },
  { id: '6', name: 'Putri Nanda', email: 'putri@gmail.com', role: 'USER', status: 'ACTIVE', orders: 5, spent: 2100000, joined: '2026-02-14', avatar: '' },
  { id: '7', name: 'Rama Hadi', email: 'rama@gmail.com', role: 'USER', status: 'INACTIVE', orders: 0, spent: 0, joined: '2026-03-01', avatar: '' },
];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  SUPERADMIN: 'bg-red-100 text-red-800 border-red-200',
  USER: 'bg-[#F0EDE8] text-[#5A5650] border-[#E8E4DE]',
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  INACTIVE: 'bg-gray-100 text-gray-600',
  BANNED: 'bg-red-100 text-red-800',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const formatCurrency = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="p-6 lg:p-10 space-y-6 pt-20 lg:pt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1814]">Users</h1>
          <p className="text-sm text-[#5A5650] mt-1">{MOCK_USERS.length} registered users</p>
        </div>
        <div className="flex gap-2">
          {['All', 'User', 'Admin'].map(tab => (
            <button
              key={tab}
              onClick={() => setRoleFilter(tab === 'All' ? '' : tab.toUpperCase())}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
                (tab === 'All' && !roleFilter) || roleFilter === tab.toUpperCase()
                  ? 'bg-[#0A0A08] text-white border-[#0A0A08]'
                  : 'text-[#5A5650] border-[#E8E4DE] hover:border-[#C8A96E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E8E4DE] p-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A8680]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#E8E4DE] bg-[#F8F4EE] focus:outline-none focus:border-[#C8A96E] transition-colors text-[#1A1814]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E4DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F4EE] border-b border-[#E8E4DE]">
              <tr>
                <th className="py-3 px-6 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">User</th>
                <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Role</th>
                <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Status</th>
                <th className="py-3 px-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden md:table-cell">Orders</th>
                <th className="py-3 px-4 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden lg:table-cell">Total Spent</th>
                <th className="py-3 px-4 text-left font-mono text-[10px] uppercase tracking-widest text-[#8A8680] hidden xl:table-cell">Joined</th>
                <th className="py-3 px-6 text-right font-mono text-[10px] uppercase tracking-widest text-[#8A8680]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-[#FAFAF8] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#C8A96E]/20 flex items-center justify-center text-[#8B6914] font-mono text-xs font-bold shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1814]">{user.name}</p>
                        <p className="text-xs text-[#8A8680]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border rounded-full ${ROLE_BADGE[user.role]}`}>
                      {user.role === 'ADMIN' && <Shield className="inline h-3 w-3 mr-1 -mt-0.5" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase rounded-full ${STATUS_BADGE[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-[#5A5650] hidden md:table-cell font-mono">
                    {user.orders}
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium text-[#1A1814] hidden lg:table-cell">
                    {formatCurrency(user.spent)}
                  </td>
                  <td className="py-4 px-4 text-xs text-[#8A8680] hidden xl:table-cell font-mono">
                    {user.joined}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#8A8680] hover:text-[#C8A96E] hover:bg-[#F0EDE8] rounded transition-colors" title="Send Email">
                        <Mail className="h-4 w-4" />
                      </button>
                      {user.status === 'BANNED' ? (
                        <button className="p-1.5 text-[#8A8680] hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Unban">
                          <ShieldAlert className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="p-1.5 text-[#8A8680] hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Ban User">
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#E8E4DE] px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-[#8A8680] font-mono">
            Showing {filtered.length} of {MOCK_USERS.length} users
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-[#E8E4DE] text-[#5A5650] hover:bg-[#F0EDE8] transition-colors font-mono">← Prev</button>
            <button className="px-3 py-1 text-xs bg-[#0A0A08] text-white font-mono">1</button>
            <button className="px-3 py-1 text-xs border border-[#E8E4DE] text-[#5A5650] hover:bg-[#F0EDE8] transition-colors font-mono">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
