'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, MapPin, Heart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlist.store';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart.store';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const cartStore = useCartStore();

  const handleMoveToCart = (item: any) => {
    cartStore.addItem({
      id: `${item.id}-default`,
      productId: item.id,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      quantity: 1,
      stock: 10, // Mock stock since we don't have it in wishlist store fully
    });
    cartStore.openCart();
    removeItem(item.id);
  };

  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <header className="mb-12 border-b border-ag-border pb-8 flex justify-between items-end">
          <div>
            <h1 className="font-display text-4xl text-ag-text mb-2">Wishlist</h1>
            <p className="text-ag-text-2 font-mono text-sm">Save your favorite items here.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-2 hidden md:block">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-ag-text-2 hover:bg-ag-bg-2/50 hover:text-ag-text transition-all border-l-2 border-transparent hover:border-ag-border">
              <User className="h-5 w-5" /> Profile
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 text-ag-text-2 hover:bg-ag-bg-2/50 hover:text-ag-text transition-all border-l-2 border-transparent hover:border-ag-border">
              <Package className="h-5 w-5" /> Orders
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-3 px-4 py-3 bg-ag-bg-2 border-l-2 border-ag-text text-ag-text font-medium">
              <Heart className="h-5 w-5 fill-current opacity-50" /> Wishlist
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 text-ag-text-2 hover:bg-ag-bg-2/50 hover:text-ag-text transition-all border-l-2 border-transparent hover:border-ag-border">
              <MapPin className="h-5 w-5" /> Addresses
            </Link>
          </aside>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {items.length === 0 ? (
              <div className="text-center py-24 bg-ag-bg border border-ag-border border-dashed rounded-sm">
                <Heart className="h-12 w-12 text-ag-muted mx-auto mb-6 opacity-30" />
                <p className="text-ag-text-2 font-display text-2xl mb-4">Your wishlist is empty</p>
                <Link href="/shop" className="text-ag-accent text-sm font-mono tracking-widest uppercase hover:text-ag-text transition-colors">
                  Explore Shop →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="group border border-ag-border bg-ag-bg-2 rounded-sm overflow-hidden flex flex-col">
                    <Link href={`/product/${item.slug}`} className="relative aspect-[4/5] block bg-ag-bg overflow-hidden cursor-pointer">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </Link>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-medium text-ag-text line-clamp-1 mb-1">{item.name}</h3>
                      <p className="text-sm text-ag-text-2 mb-4">Rp {(item.price).toLocaleString('id-ID')}</p>
                      
                      <div className="mt-auto flex gap-2">
                        <Button 
                          className="flex-1 py-4 text-xs tracking-widest bg-ag-bg text-ag-text border border-ag-border hover:bg-ag-text hover:text-ag-bg"
                          onClick={() => handleMoveToCart(item)}
                        >
                          MOVE TO CART
                        </Button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-10 flex items-center justify-center border border-transparent text-ag-muted hover:text-error hover:border-error/20 bg-ag-bg rounded-sm transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
