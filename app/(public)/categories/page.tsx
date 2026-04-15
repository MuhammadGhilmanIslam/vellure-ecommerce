import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { name: 'Clothing', slug: 'clothing', count: 24, image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=600&auto=format&fit=crop', desc: 'Premium tees, overshirts, and essentials.' },
  { name: 'Accessories', slug: 'accessories', count: 18, image: 'https://images.unsplash.com/photo-1524592094714-cb9c5a4d5d34?q=80&w=600&auto=format&fit=crop', desc: 'Watches, bags, and curated accessories.' },
  { name: 'Lifestyle', slug: 'lifestyle', count: 12, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop', desc: 'Mugs, candles, and objects of intention.' },
  { name: 'Footwear', slug: 'footwear', count: 8, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', desc: 'Crafted shoes and sneakers.' },
  { name: 'Outerwear', slug: 'outerwear', count: 6, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop', desc: 'Jackets, coats, and protective layers.' },
  { name: 'Limited Edition', slug: 'limited', count: 3, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600&auto=format&fit=crop', desc: 'Exclusive drops, available while they last.' },
];

export default function CategoriesPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Browse</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Shop by Category</h1>
          <p className="text-ag-text-2">Explore our curated collections.</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group block relative aspect-[4/5] overflow-hidden bg-ag-bg-2 border border-ag-border">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl text-white mb-1">{cat.name}</h3>
                <p className="text-white/70 text-sm mb-2">{cat.desc}</p>
                <span className="font-mono text-xs text-ag-accent">{cat.count} Products →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
