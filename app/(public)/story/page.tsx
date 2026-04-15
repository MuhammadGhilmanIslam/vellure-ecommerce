'use client';

import React from 'react';
import Image from 'next/image';

export default function StoryPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-20 text-center">
          <h1 className="font-display text-5xl md:text-7xl text-ag-text mb-6 leading-tight">
            Our Story.
          </h1>
          <p className="text-ag-text-2 text-lg max-w-2xl mx-auto font-mono">
            We believe in objects of intention. Things that carry weight, 
            meaning, and outlast the fleeting trends of the season.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative aspect-[4/5] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1000&auto=format&fit=crop"
              alt="Artisan workspace"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-display text-4xl text-ag-text">The Genesis</h2>
            <p className="text-ag-text-2 leading-relaxed">
              Vellure began as a quiet rebellion against the disposable. We looked around 
              and saw a sea of noise — products designed for shelves, not for lives. 
              We wanted to create something different. Something that felt like an inheritance, 
              not a purchase.
            </p>
            <p className="text-ag-text-2 leading-relaxed">
              Founded in late 2024, our studio was built on the principle of "Dark Luxury." 
              We strip away the excess. We let the materials speak. We obsess over the micro-interactions, 
              the hidden seams, and the weight of the metal.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-16 items-center mb-32 md:flex-row-reverse">
          <div className="space-y-6 md:order-2">
            <h2 className="font-display text-4xl text-ag-text">Crafted With Intent</h2>
            <p className="text-ag-text-2 leading-relaxed">
              Every item in our collection is the result of countless hours of prototyping, 
              testing, and refining. We source our materials from artisans who share our 
              dedication to longevity. Whether it's heavy-weight cotton or raw, unpolished 
              obsidian, every element is chosen deliberately.
            </p>
            <p className="text-ag-text-2 leading-relaxed">
              To own a Vellure piece is to make a statement: you demand substance over spectacle.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden group md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=1000&auto=format&fit=crop"
              alt="Detail of fabric"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale hover:grayscale-0"
            />
          </div>
        </section>

        <div className="border-t border-ag-border pt-16 text-center">
          <h3 className="font-display text-3xl text-ag-text mb-4">Join the Collective.</h3>
          <p className="text-ag-text-2 mb-8 font-mono text-sm max-w-md mx-auto">
            Experience the full collection and become part of the Vellure narrative.
          </p>
          <a href="/shop" className="inline-block border border-ag-text text-ag-text px-10 py-4 font-mono text-sm tracking-widest uppercase hover:bg-ag-text hover:text-ag-bg transition-colors">
            Explore Collection
          </a>
        </div>
      </div>
    </div>
  );
}
