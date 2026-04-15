'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop"
          alt="Vellure Hero"
          className="object-cover w-full h-full"
          style={{ filter: 'brightness(0.55) saturate(0.8) contrast(1.1)' }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A08] via-[#0A0A08]/30 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A08]/60 to-transparent" />

      {/* Content */}
      <div className="container relative z-20 mx-auto px-6 max-w-7xl h-full flex flex-col justify-end pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[1px] w-12 bg-ag-accent" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ag-accent">
              New Collection · 2026
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] mb-6 text-white"
          >
            Feel the{' '}
            <em className="italic font-normal not-italic" style={{ fontStyle: 'italic' }}>
              Pull
            </em>{' '}
            <br />
            of the Unexpected.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 max-w-lg mb-10 leading-relaxed"
          >
            Vellure is a premium lifestyle platform curating objects of intention — for those who demand substance over spectacle.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/shop">
              <Button size="lg" className="px-10 py-4 text-sm tracking-widest bg-white text-[#0A0A08] hover:bg-white/90 font-medium">
                SHOP NOW
              </Button>
            </Link>
            <Link href="/story">
              <Button size="lg" variant="ghost" className="px-10 py-4 text-sm tracking-widest text-white border-white/30 hover:bg-white/10 hover:border-white/50">
                OUR STORY
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
