'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { slideInRight, fadeIn } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart.store';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items: cartItems, removeItem, updateQuantity, subtotal } = useCartStore();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-50 w-full max-w-md h-full bg-ag-bg flex flex-col border-l border-ag-border border-r-0 border-y-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ag-border">
              <h2 className="font-display text-2xl text-ag-text flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-ag-accent" />
                Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-ag-text-2 hover:text-ag-accent transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-ag-text-2 space-y-4">
                  <ShoppingBag className="h-12 w-12 opacity-20" />
                  <p>Your cart is empty.</p>
                  <Button variant="text" onClick={onClose}>Continue Shopping</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-ag-bg-2 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium line-clamp-2 pr-4">{item.name}</h4>
                            <button onClick={() => removeItem(item.productId, item.variantId)} className="text-ag-text-2 hover:text-ag-error">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {item.variantInfo && <span className="text-xs text-ag-muted mt-1 inline-block">{item.variantInfo}</span>}
                        </div>
                        <div className="flex justify-between items-end mt-auto">
                          <div className="flex items-center border border-ag-border text-sm">
                            <button 
                              className="px-2 py-1 text-ag-text-2 hover:text-ag-text hover:bg-ag-bg-2"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            >-</button>
                            <span className="px-2 py-1 w-8 text-center">{item.quantity}</span>
                            <button 
                              className="px-2 py-1 text-ag-text-2 hover:text-ag-text hover:bg-ag-bg-2"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            >+</button>
                          </div>
                          <span className="text-sm font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="border-t border-ag-border p-6 bg-ag-bg">
              <div className="flex justify-between mb-4 text-ag-text">
                <span className="font-mono text-sm uppercase">Subtotal</span>
                <span className="font-medium">Rp {subtotal().toLocaleString('id-ID')}</span>
              </div>
              <Button className="w-full" size="lg" disabled={cartItems.length === 0}>CHECKOUT</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
