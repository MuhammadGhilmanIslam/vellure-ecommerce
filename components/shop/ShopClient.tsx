'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
  searchParams: Record<string, string | string[] | undefined>;
}

export function ShopClient({ initialProducts, categories, searchParams }: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState((searchParams.q as string) || '');

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== searchParams.q) {
        updateFilter('q', searchValue || null);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchValue, searchParams.q]);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentCategory = searchParams.category as string;
  const currentSort = (searchParams.sort as string) || 'newest';
  const inStock = searchParams.inStock === 'true';

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12 pt-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between border-b border-ag-border pb-4">
          <h1 className="font-display text-3xl text-ag-text">Shop</h1>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-ag-text"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        {/* Sidebar Filter */}
        <aside className={`
          fixed inset-0 z-50 bg-ag-bg flex flex-col p-6 transition-transform duration-300 lg:relative lg:block lg:w-64 lg:bg-transparent lg:p-0 lg:z-auto lg:translate-x-0
          ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between lg:hidden border-b border-ag-border pb-6 mb-6">
            <h2 className="font-display text-2xl">Filters</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-10">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-ag-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-ag-bg-2 border border-ag-border text-ag-text text-sm py-2 pl-10 pr-4 focus:outline-none focus:border-ag-accent transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-ag-text mb-4">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => updateFilter('category', null)}
                    className={`text-sm hover:text-ag-accent transition-colors ${!currentCategory ? 'text-ag-accent font-medium' : 'text-ag-text-2'}`}
                  >
                    All Collection
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`text-sm hover:text-ag-accent transition-colors ${currentCategory === cat.slug ? 'text-ag-accent font-medium' : 'text-ag-text-2'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-ag-text mb-4">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={inStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                  className="accent-ag-accent h-4 w-4 bg-ag-bg-2 border-ag-border"
                />
                <span className="text-sm text-ag-text-2">In Stock Only</span>
              </label>
            </div>
          </div>
          
          <div className="mt-auto pt-6 lg:hidden">
            <Button className="w-full" onClick={() => setIsMobileFilterOpen(false)}>Show Results</Button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {/* Header & Sort */}
          <div className="hidden lg:flex items-center justify-between mb-8 border-b border-ag-border pb-4">
            <h1 className="font-display text-4xl text-ag-text">
              {currentCategory ? categories.find(c => c.slug === currentCategory)?.name : 'All Collection'}
              <span className="text-sm font-mono text-ag-muted ml-4">({initialProducts.length})</span>
            </h1>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-ag-muted uppercase tracking-widest font-mono">Sort by</span>
              <select 
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-transparent border-none text-ag-text text-sm focus:ring-0 cursor-pointer"
              >
                <option value="newest" className="bg-ag-bg">Newest Additions</option>
                <option value="best-selling" className="bg-ag-bg">Best Selling</option>
                <option value="price-asc" className="bg-ag-bg">Price: Low to High</option>
                <option value="price-desc" className="bg-ag-bg">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {initialProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="h-24 w-24 border border-ag-border rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-ag-muted" />
              </div>
              <h3 className="font-display text-2xl text-ag-text mb-4">No products found</h3>
              <p className="text-ag-text-2 mb-8 max-w-md">We couldn't find anything matching your filters. Try adjusting your search criteria.</p>
              <Button onClick={() => router.push('/shop')} variant="ghost">Clear All Filters</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
