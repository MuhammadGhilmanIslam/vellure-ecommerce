'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export function ProductGallery({ images, alt }: { images: string[], alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const mainImage = images[activeIndex] || '/placeholder.jpg';

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="relative aspect-[4/5] bg-ag-bg-2 cursor-zoom-in group overflow-hidden"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={mainImage}
            alt={`${alt} - view ${activeIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Hover zoom indicator */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full transform scale-90 group-hover:scale-100 transition-transform">
            <ZoomIn className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square bg-ag-bg-2 overflow-hidden border-2 transition-colors",
                activeIndex === idx ? "border-ag-accent opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ag-bg">
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 text-ag-text-2 hover:text-white"
            >
              <X className="h-8 w-8" />
            </button>

            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 z-50 p-4 text-ag-text-2 hover:text-white">
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button onClick={nextImage} className="absolute right-6 z-50 p-4 text-ag-text-2 hover:text-white">
                  <ChevronRight className="h-10 w-10" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center"
            >
              <img src={mainImage} className="max-w-full max-h-[85vh] object-contain" alt={alt} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
