'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeUpStagger } from '@/lib/motion';

interface FeaturedCategoriesProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  }[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="py-24 bg-ag-bg">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              custom={index}
              variants={fadeUpStagger}
              className="group relative h-[500px] overflow-hidden rounded-sm bg-ag-bg-2"
            >
              <Link href={`/shop?category=${category.slug}`} className="block w-full h-full">
                {/* Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={category.image || 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    Explore
                  </p>
                  <h3 className="font-display text-3xl text-white group-hover:-translate-y-2 transition-transform duration-500">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
