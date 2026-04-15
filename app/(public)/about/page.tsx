'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Heart, Globe, Award } from 'lucide-react';

const STATS = [
  { value: '2024', label: 'Founded' },
  { value: '156+', label: 'Curated Products' },
  { value: '12K', label: 'Happy Customers' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const VALUES = [
  { icon: Leaf, title: 'Sustainable Sourcing', desc: 'Every material is traced back to its origin. We work only with certified ethical suppliers.' },
  { icon: Heart, title: 'Crafted With Love', desc: 'Each product undergoes rigorous quality checks before it earns the Vellure seal.' },
  { icon: Globe, title: 'Global Reach', desc: 'We ship to 15+ countries, bringing intentional design to doorsteps worldwide.' },
  { icon: Award, title: 'Award-Winning Design', desc: 'Recognized by leading design publications for our commitment to aesthetic excellence.' },
];

export default function AboutPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-0">
      {/* Hero Section */}
      <section className="container mx-auto px-6 max-w-6xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-4">About Vellure</p>
            <h1 className="font-display text-5xl md:text-6xl text-ag-text mb-6 leading-tight">
              We Design for <em>Those Who Notice.</em>
            </h1>
            <p className="text-ag-text-2 leading-relaxed text-lg mb-8">
              Vellure is not just a store — it&apos;s a philosophy. We believe that the objects
              you surround yourself with should carry weight, meaning, and outlast the fleeting
              trends of the season. Every detail is considered. Nothing is accidental.
            </p>
            <Link href="/story" className="inline-flex items-center gap-2 text-ag-accent font-mono text-sm uppercase tracking-widest hover:text-ag-text transition-colors group">
              Read Our Story <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
              alt="Vellure workspace"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ag-bg/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-ag-border py-12 mb-24 bg-ag-bg-2/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="font-display text-4xl text-ag-accent mb-2">{s.value}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-ag-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="container mx-auto px-6 max-w-5xl mb-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl text-ag-text mb-4">The Dark Luxury Philosophy</h2>
          <p className="text-ag-text-2 max-w-2xl mx-auto leading-relaxed">
            We strip away the excess. We let the materials speak. We obsess over the micro-interactions,
            the hidden seams, and the weight of every element.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          {VALUES.map(v => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-8 bg-ag-bg-2 border border-ag-border hover:border-ag-accent/30 transition-colors group">
                <Icon className="h-8 w-8 text-ag-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl text-ag-text mb-2">{v.title}</h3>
                <p className="text-ag-text-2 text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sustainability */}
      <section className="container mx-auto px-6 max-w-6xl mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop"
              alt="Sustainability"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-4">Responsibility</p>
            <h2 className="font-display text-4xl text-ag-text mb-6">Sustainability &amp; Sourcing</h2>
            <p className="text-ag-text-2 leading-relaxed mb-6">
              We reject the cycle of fast consumption. Every product on our platform is evaluated
              against strict criteria for durability, ethical labor, and environmental impact.
              We partner exclusively with independent studios and artisans who prioritize
              generational craft over seasonal trends.
            </p>
            <p className="text-ag-text-2 leading-relaxed">
              Our matte-black packaging is 100% recycled and recyclable. We offset 200% of our
              shipping carbon footprint through verified environmental programs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-ag-bg-2 border-t border-ag-border py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="font-display text-3xl text-ag-text mb-4">Get In Touch</h2>
          <p className="text-ag-text-2 mb-8 max-w-md mx-auto">
            For press inquiries, customer support, or collaboration proposals, reach out to our concierge team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-block bg-ag-accent text-ag-bg px-10 py-4 font-mono text-sm tracking-widest uppercase hover:bg-ag-text transition-colors">
              Contact Us
            </Link>
            <a href="mailto:concierge@vellure.id" className="inline-block border border-ag-border text-ag-text px-10 py-4 font-mono text-sm tracking-widest uppercase hover:border-ag-accent hover:text-ag-accent transition-colors">
              concierge@vellure.id
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
