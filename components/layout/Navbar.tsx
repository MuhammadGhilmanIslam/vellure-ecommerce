'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { useWishlistStore } from '@/lib/store/wishlist.store';
import { useCartStore } from '@/lib/store/cart.store';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  // Stores
  const { items: cartItems, isOpen: isCartOpen, openCart, closeCart } = useCartStore();
  const cartItemsCount = cartItems.length;
  
  const { items: wishlistItems } = useWishlistStore();
  const wishlistItemsCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Story', href: '/story' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled || !isHome || isMobileMenuOpen
            ? 'bg-ag-bg-2/80 backdrop-blur-md border-b border-ag-border py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-ag-text p-2 -ml-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Middle Nav (Desktop) */}
            <nav className="hidden md:flex flex-1 items-center gap-8 text-sm font-medium tracking-wide">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-ag-text-2 hover:text-ag-accent transition-colors uppercase tracking-widest text-xs"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <div className="flex-1 md:flex-none flex justify-center">
              <Link href="/" className="font-display italic text-2xl tracking-wide text-ag-text">
                VELLURE
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex flex-1 justify-end items-center gap-4 md:gap-6">
              <button 
                className="text-ag-text-2 hover:text-ag-accent transition-colors hidden sm:block"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
              <Link href="/account/wishlist" className="text-ag-text-2 hover:text-ag-accent transition-colors hidden sm:block relative">
                <Heart className="h-5 w-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ag-text text-ag-bg text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/account" className="text-ag-text-2 hover:text-ag-accent transition-colors">
                <User className="h-5 w-5" />
              </Link>
              <button 
                className="text-ag-text-2 hover:text-ag-accent transition-colors relative"
                onClick={() => openCart()}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-ag-accent text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-ag-bg flex flex-col md:hidden animate-in fade-in slide-in-from-top-full duration-300">
          <div className="p-6 flex justify-between items-center border-b border-ag-border">
            <span className="font-display italic text-xl">VELLURE</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-ag-text-2">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col p-6 gap-6 text-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="uppercase tracking-widest text-ag-text hover:text-ag-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto p-6 flex gap-6 mt-auto bg-ag-bg-2 border-t border-ag-border justify-around">
             <Link href="/account/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 text-ag-text-2 relative">
               <Heart className="h-6 w-6" /> 
               <span className="text-xs uppercase tracking-widest">Wishlist</span>
               {wishlistItemsCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-ag-text text-ag-bg text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {wishlistItemsCount}
                  </span>
                )}
             </Link>
             <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="flex flex-col items-center gap-2 text-ag-text-2">
               <Search className="h-6 w-6" />
               <span className="text-xs uppercase tracking-widest">Search</span>
             </button>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => closeCart()} />
    </>
  );
}
