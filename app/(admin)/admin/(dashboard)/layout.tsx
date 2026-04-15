import React from 'react';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { Toaster } from 'sonner';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0EDE8] flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen">
        {children}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
