'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart.store';

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    comparePrice?: number | null;
    images: string[];
    category: { name: string };
    rating: number;
    reviewsCount: number;
    stock: number;
    tags: string[]; // e.g. "NEW", "SALE"
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, openCart } = useCartStore();

  // Calculate discount percentage
  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '/placeholder.jpg',
      price: product.price,
      stock: product.stock,
      quantity: 1
    });

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 400);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle wishlist
  };

  const mainImage = product.images[0] || '/placeholder.jpg';

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div 
        className="flex flex-col border border-ag-border hover:border-ag-border/80 transition-colors duration-300 rounded-sm overflow-hidden bg-ag-bg relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.tags.includes('NEW') && <Badge variant="accent">NEW</Badge>}
          {discountPercent > 0 && <Badge variant="error">SALE {discountPercent}%</Badge>}
          {product.stock > 0 && product.stock <= 5 && <Badge variant="warning">LOW STOCK</Badge>}
          {product.stock === 0 && <Badge variant="neutral">SOLD OUT</Badge>}
        </div>

        {/* Wishlist Action */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full bg-ag-bg-2/80 backdrop-blur-sm text-ag-text-2 hover:text-ag-accent transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 lg:translate-x-0"
          )}
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ag-bg-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        {/* Info Area */}
        <div className="p-4 flex flex-col flex-1 relative overflow-hidden bg-ag-bg relative">
          <div className="flex justify-between items-start mb-1">
            <span className="font-mono text-[10px] uppercase text-ag-muted tracking-wider">
              {product.category.name}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 text-ag-muted text-xs">
                <Star className="h-3 w-3 fill-ag-accent text-ag-accent" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="opacity-50">({product.reviewsCount})</span>
              </div>
            )}
          </div>
          
          <h3 className="font-display text-lg text-ag-text line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-2 flex items-center flex-wrap gap-2">
            <span className="text-ag-accent font-medium">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-ag-muted text-sm line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Add to Cart slide-up */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ag-bg via-ag-bg to-transparent transition-all duration-300 transform",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}>
            <Button 
              className="w-full shadow-lg" 
              size="sm" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
