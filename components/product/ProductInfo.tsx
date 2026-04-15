'use client';

import React, { useState } from 'react';
import { Minus, Plus, Heart, Share2, Info, RefreshCw, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart.store';
import { useWishlistStore } from '@/lib/store/wishlist.store';

export function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.length > 0 ? product.variants[0].id : null
  );

  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();

  const isSaved = wishlistStore.isInWishlist(product.id);

  const handleToggleWishlist = () => {
    if (isSaved) {
      wishlistStore.removeItem(product.id);
    } else {
      wishlistStore.addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0] || '',
      });
    }
  };

  const handleAddToCart = () => {
    cartStore.addItem({
      id: `${product.id}-${selectedVariantId || 'default'}`,
      productId: product.id,
      variantId: selectedVariantId || undefined,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      quantity,
      stock: product.stock,
      // Add variant info string if exists
    });
    cartStore.openCart();
  };

  const handleDecreaseList = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncreaseList = () => setQuantity(q => Math.min(product.stock, q + 1));

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="font-mono text-xs uppercase tracking-widest text-ag-muted flex items-center gap-2">
        <a href="/shop" className="hover:text-ag-accent transition-colors">Shop</a>
        <span>/</span>
        <a href={`/shop?category=${product.categories?.[0]?.category?.slug}`} className="hover:text-ag-accent transition-colors">
          {product.category}
        </a>
      </div>

      {/* Title & Badges */}
      <div>
        <div className="flex gap-2 mb-4">
          {product.isNew && <Badge variant="accent">New</Badge>}
          {product.isSale && <Badge variant="error">Sale</Badge>}
        </div>
        <h1 className="font-display text-4xl lg:text-5xl text-ag-text leading-tight mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 text-ag-text-2 border-b border-ag-border pb-6">
          <div className="flex items-center gap-1">
            <span className="text-ag-accent">★</span>
            <span className="font-medium text-ag-text">{(product.rating || 0).toFixed(1)}</span>
            <span className="text-ag-muted">({product.reviewsCount || 0} reviews)</span>
          </div>
          <span className="w-1 h-1 bg-ag-border rounded-full" />
          <p>{product.shortDescription || 'No description available.'}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl text-ag-text font-medium">
          {formatPrice(product.price)}
        </span>
        {product.comparePrice && (
          <span className="text-lg text-ag-muted line-through mb-1">
            {formatPrice(product.comparePrice)}
          </span>
        )}
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-4 pt-6 border-t border-ag-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-ag-border rounded-sm h-12 w-32">
            <button 
              onClick={handleDecreaseList} 
              className="w-1/3 h-full flex items-center justify-center text-ag-text-2 hover:text-ag-accent"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-1/3 h-full flex items-center justify-center font-mono text-sm">
              {quantity}
            </div>
            <button 
              onClick={handleIncreaseList} 
              className="w-1/3 h-full flex items-center justify-center text-ag-text-2 hover:text-ag-accent"
              disabled={quantity >= product.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm font-mono text-ag-muted flex items-center gap-2">
            {product.stock > 0 ? (
              <><span className="w-2 h-2 rounded-full bg-success"></span> In Stock ({product.stock})</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-error"></span> Out of Stock</>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            className="flex-1 py-6 text-sm tracking-widest"
            onClick={handleAddToCart}
            disabled={product.stock < 1}
          >
            ADD TO CART
          </Button>
          <Button 
            variant="ghost" 
            className="px-6 border-ag-border group"
            onClick={handleToggleWishlist}
          >
            <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-ag-accent text-ag-accent' : 'text-ag-text-2 group-hover:text-ag-accent'}`} />
          </Button>
          <Button variant="ghost" className="px-6 border-ag-border group">
            <Share2 className="w-5 h-5 text-ag-text-2 group-hover:text-ag-accent transition-colors" />
          </Button>
        </div>
      </div>

      {/* Accordions */}
      <div className="mt-8 border-t border-ag-border">
        {/* Simplified Accordion Items */}
        <div className="border-b border-ag-border py-4">
          <div className="flex items-center gap-3 text-ag-text pb-2">
            <Truck className="w-5 h-5 text-ag-accent" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Shipping Information</h3>
          </div>
          <p className="text-ag-text-2 text-sm leading-relaxed pl-8">
            Free standard shipping on orders over Rp 1.000.000. Orders usually ship within 24-48 hours.
          </p>
        </div>
        <div className="border-b border-ag-border py-4">
          <div className="flex items-center gap-3 text-ag-text pb-2">
            <RefreshCw className="w-5 h-5 text-ag-accent" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Returns & Exchanges</h3>
          </div>
          <p className="text-ag-text-2 text-sm leading-relaxed pl-8">
            30-day return policy for unused items in original packaging. Sale items are final.
          </p>
        </div>
        <div className="border-b border-ag-border py-4">
          <div className="flex items-center gap-3 text-ag-text pb-2">
            <Info className="w-5 h-5 text-ag-accent" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Care Instructions</h3>
          </div>
          <p className="text-ag-text-2 text-sm leading-relaxed pl-8">
            To preserve the quality of this item, please follow the specific care label instructions provided with the product.
          </p>
        </div>
      </div>
    </div>
  );
}
