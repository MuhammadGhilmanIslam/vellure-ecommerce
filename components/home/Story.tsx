'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import Link from 'next/link';

export function Story() {
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section className="py-32 bg-ag-bg-2 overflow-hidden border-y border-ag-border">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-ag-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-ag-accent">
                About Vellure
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ag-text leading-tight mb-8">
              The pursuit of <br />
              <i className="italic text-ag-accent">timeless</i> objects.
            </h2>

            <div className="space-y-6 text-ag-text-2 text-lg leading-relaxed mb-10">
              <p>
                Founded on the principle that less is more, Vellure exists to curate and create products that defy the disposable culture of today. We believe in objects that ground you.
              </p>
              <p>
                From heavyweight essentials to artisan-crafted homeware, every piece in our collection is selected for its material integrity, narrative, and enduring aesthetic.
              </p>
            </div>

            <Link 
              href="/story" 
              className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-ag-text hover:text-ag-accent transition-colors"
            >
              Read Our Story
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </motion.div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative h-[600px] w-full bg-ag-bg lg:ml-auto max-w-md overflow-hidden rounded-sm">
            <motion.img
              style={{ y: yImage, scale: 1.1 }}
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Vellure Editorial"
              className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
