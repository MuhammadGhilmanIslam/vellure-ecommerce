import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { Story } from '@/components/home/Story';
import { BestSellers } from '@/components/home/BestSellers';
import prisma from '@/lib/prisma';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  let categories = [];
  let bestSellers = [];

  try {
    // Fetch Featured Categories
    categories = await prisma.category.findMany({
      take: 3,
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
    });

    // Fetch Best Sellers
    const bestSellersRaw = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { totalSold: 'desc' },
      take: 4,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });

    bestSellers = bestSellersRaw.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images.map(img => img.url),
      category: { name: product.categories[0]?.category.name || 'Uncategorized' },
      rating: product.averageRating,
      reviewsCount: product.totalReviews,
      stock: product.stock,
      tags: product.tags.map(t => t.tag.name),
    }));
  } catch (error) {
    console.error('Database connection failed, using mock data for homepage demo:', error);
    
    // Fallback Mock Data
    categories = [
      { id: 'm1', name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800' },
      { id: 'm2', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800' },
      { id: 'm3', name: 'Lifestyle', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800' },
    ];

    bestSellers = [
      {
        id: 'p1',
        slug: 'gravity-tee-obsidian',
        name: 'Gravity Tee — Obsidian',
        price: 485000,
        comparePrice: null,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
        category: { name: 'Clothing' },
        rating: 4.8,
        reviewsCount: 89,
        stock: 45,
        tags: ['New Arrival', 'Best Seller'],
      },
      {
        id: 'p2',
        slug: 'drift-overshirt-sand',
        name: 'Drift Overshirt — Sand',
        price: 895000,
        comparePrice: 1195000,
        images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80'],
        category: { name: 'Clothing' },
        rating: 4.6,
        reviewsCount: 43,
        stock: 8,
        tags: ['Sale'],
      },
    ];
  }

  return (
    <>
      <Hero />
      <FeaturedCategories categories={categories} />
      <Story />
      <BestSellers products={bestSellers} />
      
      {/* Testimonials */}
      <section className="py-32 bg-ag-bg border-t border-ag-border text-center flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-display italic text-3xl md:text-5xl lg:text-6xl text-ag-text leading-tight mb-12">
            "Vellure hasn't just changed how I shop, it's changed how I consume. Intention over impulse."
          </h3>
          <p className="font-mono text-sm uppercase tracking-widest text-ag-accent">
            — Sarah K., Creative Director
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-ag-bg-2 border-t border-ag-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="font-display text-4xl text-ag-text mb-4">Stay ahead of gravity.</h2>
          <p className="text-ag-text-2 mb-10">
            Join our inner circle for early access to limited releases and editorial content.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 relative">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-transparent border-b border-ag-border py-3 px-2 text-ag-text focus:outline-none focus:border-ag-accent transition-colors block w-full"
              required
            />
            <button 
              type="submit" 
              className="px-8 py-3 bg-ag-text text-ag-bg hover:bg-ag-accent hover:text-white transition-colors font-mono text-xs uppercase tracking-widest"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
