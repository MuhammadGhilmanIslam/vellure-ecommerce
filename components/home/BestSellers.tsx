'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeUpStagger } from '@/lib/motion';
import { ProductCard } from '@/components/product/ProductCard';

interface BestSellersProps {
  products: any[]; // Defined loosely for now, matching ProductCard props structure
}

export function BestSellers({ products }: BestSellersProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-32 bg-ag-bg relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-ag-accent" />
            <h2 className="font-mono text-sm uppercase tracking-widest text-ag-text">
              Best Sellers
            </h2>
          </div>
          
          <a 
            href="/shop?sort=best-selling" 
            className="font-mono text-xs uppercase tracking-widest text-ag-text-2 hover:text-ag-accent transition-colors"
          >
            View All Best Sellers →
          </a>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <motion.div key={product.id} custom={index} variants={fadeUpStagger}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
