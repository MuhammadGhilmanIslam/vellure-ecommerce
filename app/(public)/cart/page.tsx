'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for Zustand persistence
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ag-bg flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="h-32 w-32 bg-ag-bg-2 border border-ag-border rounded-full flex items-center justify-center mb-8 relative animate-[bounce_4s_ease-in-out_infinite]">
          <ShoppingBag className="h-12 w-12 text-ag-muted relative z-10" />
          <div className="absolute inset-0 bg-ag-accent/5 rounded-full blur-xl mix-blend-screen" />
        </div>
        <h1 className="font-display text-4xl text-ag-text mb-4">Your cart is floating in space.</h1>
        <p className="text-ag-text-2 mb-10 text-lg max-w-md">
          You haven't added anything to your cart yet. Let's find something intentional for you.
        </p>
        <Link href="/shop">
          <Button size="lg" className="px-10">START SHOPPING</Button>
        </Link>
      </div>
    );
  }

  const currentSubtotal = subtotal();
  const shippingEstimate = currentSubtotal > 1000000 ? 0 : 'Calculated at checkout';

  return (
    <div className="min-h-screen bg-ag-bg pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <h1 className="font-display text-4xl lg:text-5xl text-ag-text mb-12">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="hidden border-b border-ag-border pb-4 mb-6 sm:grid grid-cols-12 gap-4 text-xs font-mono uppercase tracking-widest text-ag-muted">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-6 items-center border-b border-ag-border pb-8 last:border-0 border-opacity-50">
                  
                  {/* Product Details */}
                  <div className="col-span-6 flex items-center gap-6 w-full">
                    <Link href={`/product/${item.slug}`} className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-ag-bg-2" />
                    </Link>
                    <div className="flex flex-col">
                      <Link href={`/product/${item.slug}`} className="font-display text-xl text-ag-text hover:text-ag-accent transition-colors mb-2">
                        {item.name}
                      </Link>
                      <span className="text-sm text-ag-text-2 mb-1">{formatPrice(item.price)}</span>
                      {item.variantId && <span className="text-xs text-ag-muted">Variant: {item.variantInfo || item.variantId}</span>}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3 w-full flex sm:justify-center items-center">
                    <div className="flex items-center border border-ag-border rounded-sm h-10 w-28">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="w-1/3 h-full flex items-center justify-center text-ag-text-2 hover:text-ag-accent"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-1/3 h-full flex items-center justify-center font-mono text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="w-1/3 h-full flex items-center justify-center text-ag-text-2 hover:text-ag-accent"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-3 w-full flex justify-between sm:flex-col sm:items-end sm:justify-center gap-4">
                    <span className="font-medium text-ag-text">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button 
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-xs font-mono uppercase tracking-widest text-ag-text-2 hover:text-error transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-ag-bg-2 p-8 rounded-sm sticky top-28">
              <h2 className="font-mono text-sm uppercase tracking-widest text-ag-text mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-ag-text-2 border-b border-ag-border pb-6 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-ag-text">{formatPrice(currentSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-ag-text">
                    {typeof shippingEstimate === 'string' ? shippingEstimate : formatPrice(shippingEstimate)}
                  </span>
                </div>
                {/* Coupon UI Mock */}
                <div className="pt-4 mt-4 border-t border-ag-border border-dashed">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Promo code" className="flex-1 bg-ag-bg border border-ag-border px-3 py-2 text-sm focus:outline-none focus:border-ag-accent" disabled />
                    <Button variant="ghost" disabled>APPLY</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-display text-xl text-ag-text">Total</span>
                <div className="text-right">
                  <span className="block font-medium text-2xl text-ag-text">
                    {formatPrice(currentSubtotal + (typeof shippingEstimate === 'number' ? shippingEstimate : 0))}
                  </span>
                  <span className="text-xs text-ag-muted mt-1">IDR including VAT</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => router.push('/checkout')}
                >
                  PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <Link href="/shop" className="text-xs font-mono uppercase tracking-widest text-ag-text-2 hover:text-ag-accent transition-colors">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
