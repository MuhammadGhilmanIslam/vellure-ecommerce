'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Mock search effect
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      // Mock results
      const allMocks = [
        { id: '1', name: 'Gravity Tee — Obsidian', slug: 'gravity-tee-obsidian', price: 485000, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
        { id: '2', name: 'Drift Overshirt — Sand', slug: 'drift-overshirt-sand', price: 850000, category: 'Clothing', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80' },
        { id: '3', name: 'Nocturne Automatic Watch', slug: 'nocturne-watch', price: 2450000, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524592094714-cb9c5a4d5d34?w=400&q=80' },
        { id: '4', name: 'Lumina Ceramic Mug', slug: 'lumina-mug', price: 225000, category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80' }
      ];
      
      const filtered = allMocks.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-ag-bg/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="flex items-center px-6 md:px-12 h-24 border-b border-ag-border/50">
        <Search className="h-6 w-6 text-ag-muted mr-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for objects of intention..."
          className="flex-1 bg-transparent border-none text-2xl md:text-4xl font-display text-ag-text focus:outline-none focus:ring-0 placeholder:text-ag-muted"
        />
        <button 
          onClick={onClose}
          className="p-4 -mr-4 text-ag-text-2 hover:text-ag-accent transition-colors ml-4 shrink-0"
        >
          <X className="h-8 w-8" />
        </button>
      </div>

      {/* Search Results Area */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12">
        {isSearching ? (
          <div className="flex items-center justify-center h-full text-ag-muted">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : query.trim().length > 0 && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-xl text-ag-text-2 mb-2 font-display">No results found for "{query}"</p>
            <p className="text-sm text-ag-muted font-mono">Try adjusting your search terms.</p>
          </div>
        ) : results.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xs font-mono tracking-widest uppercase text-ag-muted mb-8">
              {results.length} Result{results.length !== 1 && 's'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {results.map((product) => (
                <div key={product.id} className="group cursor-pointer" onClick={() => {
                  onClose();
                  router.push(`/product/${product.slug}`);
                }}>
                  <div className="relative aspect-[4/5] bg-ag-bg-2 mb-4 overflow-hidden rounded-sm border border-ag-border/50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h4 className="text-ag-text font-medium line-clamp-1 group-hover:text-ag-accent transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-sm text-ag-text-2 mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
             <Search className="h-16 w-16 text-ag-muted mb-6" />
             <p className="font-display text-2xl text-ag-text">What are you looking for?</p>
          </div>
        )}
      </div>
    </div>
  );
}
