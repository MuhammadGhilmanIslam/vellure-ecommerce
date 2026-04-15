import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/product/ProductCard';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        variants: { include: { values: { include: { variantValue: { include: { variantOption: true } } } } } },
        variantOptions: { include: { values: true }, orderBy: { sortOrder: 'asc' } },
      },
    });

    if (product && product.status === 'ACTIVE') {
      // Fetch related products (same category)
      const categoryId = product.categories[0]?.categoryId;
      if (categoryId) {
        const relatedProductsRaw = await prisma.product.findMany({
          where: {
            status: 'ACTIVE',
            id: { not: product.id },
            categories: { some: { categoryId } },
          },
          take: 4,
          include: {
            categories: { include: { category: true } },
            tags: { include: { tag: true } },
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          },
        });

        relatedProducts = relatedProductsRaw.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          comparePrice: p.comparePrice,
          images: p.images.map((img: any) => img.url),
          category: { name: p.categories[0]?.category.name || 'Uncategorized' },
          rating: p.averageRating,
          reviewsCount: p.totalReviews,
          stock: p.stock,
          tags: p.tags.map((t: any) => t.tag.name),
        }));
      }
    }
  } catch (error) {
    console.error('Database connection failed, using mock data for product detail demo:', error);
    // Mock Product Data
    product = {
      id: 'p1',
      slug: params.slug,
      name: params.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      description: '<p>This is a premium product designed with intention. Crafted from higher-grade materials, it offers both durability and timeless aesthetic. Perfect for those who appreciate the finer details of modern lifestyle objects.</p>',
      price: 485000,
      comparePrice: 595000,
      stock: 45,
      averageRating: 4.8,
      totalReviews: 124,
      status: 'ACTIVE',
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1591047139829-d91aec36adca?w=800&q=80' }
      ],
      categories: [{ category: { name: 'Clothing', slug: 'clothing' } }],
      tags: [{ tag: { name: 'New Arrival', slug: 'new-arrival' } }],
    };

    relatedProducts = [
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

  if (!product) {
    notFound();
  }

  const transformedProduct = {
    ...product,
    images: product.images.map((i: any) => i.url),
    category: product.categories[0]?.category.name || 'Uncategorized',
    isNew: product.tags.some((t: any) => t.tag.slug === 'new-arrival'),
    isSale: product.tags.some((t: any) => t.tag.slug === 'sale'),
  };

  return (
    <div className="bg-ag-bg pt-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={transformedProduct.images} alt={product.name} />
          </div>

          {/* Right Column: Info & Actions */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-28">
               <ProductInfo product={transformedProduct} />
            </div>
          </div>
          
        </div>

        {/* Detailed Description */}
        <div className="py-24 border-t border-ag-border mt-12 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl mb-8">Product Lore</h2>
          <div 
            className="prose prose-invert prose-p:text-ag-text-2 prose-headings:font-display prose-a:text-ag-accent max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
        </div>

        {/* Reviews Summary Placeholder */}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-24 border-t border-ag-border">
            <h2 className="font-display text-3xl mb-12">You may also consider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
