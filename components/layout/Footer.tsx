import React from 'react';
import Link from 'next/link';
import { Link2, MessageCircle, Video } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ag-bg-2 border-t border-ag-border mt-auto">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="font-display italic text-2xl tracking-wide text-ag-text">
                VELLURE
              </Link>
              <p className="mt-4 text-sm text-ag-text-2 leading-relaxed">
                Where gravity meets commerce. Curated premium lifestyle essentials designed for the modern aesthete.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="p-2 border border-ag-border rounded-full text-ag-text-2 hover:text-ag-accent hover:border-ag-accent transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter/X" className="p-2 border border-ag-border rounded-full text-ag-text-2 hover:text-ag-accent hover:border-ag-accent transition-colors">
                <Link2 className="w-4 h-4" />
              </a>
              <a href="#" aria-label="TikTok" className="p-2 border border-ag-border rounded-full text-ag-text-2 hover:text-ag-accent hover:border-ag-accent transition-colors">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-ag-text mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-ag-text-2">
              <li><Link href="/shop" className="hover:text-ag-accent transition-colors">All Products</Link></li>
              <li><Link href="/shop?tag=new" className="hover:text-ag-accent transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?tag=sale" className="hover:text-ag-accent transition-colors">Sale</Link></li>
              <li><Link href="/categories" className="hover:text-ag-accent transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-ag-text mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-ag-text-2">
              <li><Link href="/about" className="hover:text-ag-accent transition-colors">About Us</Link></li>
              <li><Link href="/story" className="hover:text-ag-accent transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-ag-accent transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-ag-accent transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-ag-text mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-ag-text-2">
              <li><Link href="/faq" className="hover:text-ag-accent transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-ag-accent transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-ag-accent transition-colors">Returns</Link></li>
              <li><Link href="/contact" className="hover:text-ag-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ag-border border-opacity-50">
        <div className="container mx-auto px-6 py-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ag-muted">
            &copy; {new Date().getFullYear()} Vellure. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-ag-muted">
            <Link href="/privacy" className="hover:text-ag-text transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ag-text transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
