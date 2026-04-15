'use client';

import React from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app with next-auth: signOut()
    router.push('/');
  };

  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <header className="mb-12 border-b border-ag-border pb-8 flex justify-between items-end">
          <div>
            <h1 className="font-display text-4xl text-ag-text mb-2">My Account</h1>
            <p className="text-ag-text-2 font-mono text-sm">Welcome back, Guest User</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-ag-muted hover:text-error transition-colors font-mono text-xs uppercase tracking-widest">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </header>

        <div className="grid md:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-2">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 bg-ag-bg-2 border-l-2 border-ag-text text-ag-text font-medium">
              <User className="h-5 w-5" /> Profile
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-ag-text-2 hover:bg-ag-bg-2/50 hover:text-ag-text transition-all border-l-2 border-transparent hover:border-ag-border">
              <Package className="h-5 w-5" /> Orders
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 text-ag-text-2 hover:bg-ag-bg-2/50 hover:text-ag-text transition-all border-l-2 border-transparent hover:border-ag-border">
              <Heart className="h-5 w-5" /> Wishlist
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-ag-text-2 hover:bg-ag-bg-2/50 hover:text-ag-text transition-all border-l-2 border-transparent hover:border-ag-border">
              <MapPin className="h-5 w-5" /> Addresses
            </Link>
          </aside>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-10">
            {/* Profile Overview */}
            <section className="bg-ag-bg-2 p-8 border border-ag-border rounded-sm">
              <h2 className="font-mono uppercase tracking-widest text-xs text-ag-muted mb-6">Profile Details</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-ag-text-2 text-sm mb-1">Full Name</p>
                  <p className="text-ag-text font-medium">Guest User</p>
                </div>
                <div>
                  <p className="text-ag-text-2 text-sm mb-1">Email Address</p>
                  <p className="text-ag-text font-medium">guest@vellure.id</p>
                </div>
                <div>
                  <p className="text-ag-text-2 text-sm mb-1">Phone Number</p>
                  <p className="text-ag-text font-medium text-opacity-50 italic">Not provided</p>
                </div>
                <div>
                  <p className="text-ag-text-2 text-sm mb-1">Password</p>
                  <p className="text-ag-text font-medium">••••••••</p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-ag-border flex justify-end">
                <button className="text-ag-accent text-sm font-medium hover:text-ag-text transition-colors">Edit Profile</button>
              </div>
            </section>

            {/* Recent Orders Overview */}
            <section>
              <div className="flex justify-between items-end mb-6 border-b border-ag-border pb-4">
                <h2 className="font-display text-2xl text-ag-text">Recent Orders</h2>
                <Link href="/account/orders" className="text-ag-accent text-sm hover:text-ag-text transition-colors">View All</Link>
              </div>
              
              <div className="text-center py-16 bg-ag-bg border border-ag-border border-dashed rounded-sm">
                <Package className="h-10 w-10 text-ag-muted mx-auto mb-4 opacity-50" />
                <p className="text-ag-text-2 font-medium mb-2">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-ag-accent text-sm hover:text-ag-text transition-colors">Start Shopping →</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
