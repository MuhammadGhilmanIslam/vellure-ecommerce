import React from 'react';
import { ExternalLink } from 'lucide-react';

const PRESS_ITEMS = [
  { title: 'Vellure Redefines Dark Luxury in Indonesian E-Commerce', outlet: 'TechInAsia', date: 'March 2026', url: '#' },
  { title: '"The Anti-Fast Fashion Platform" — How Vellure Curates Quality', outlet: 'Kompas Lifestyle', date: 'February 2026', url: '#' },
  { title: 'Top 10 Indonesian Startups to Watch in 2026', outlet: 'DailySocial', date: 'January 2026', url: '#' },
  { title: 'Vellure Launches Exclusive Obsidian Collection', outlet: 'Hypebeast ID', date: 'December 2025', url: '#' },
];

export default function PressPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Company</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Press &amp; Media</h1>
          <p className="text-ag-text-2 max-w-lg mx-auto">For media inquiries, brand assets, and interview requests, reach out to <a href="mailto:press@vellure.id" className="text-ag-accent">press@vellure.id</a>.</p>
        </header>

        <div className="space-y-4">
          {PRESS_ITEMS.map((item, i) => (
            <a key={i} href={item.url} className="block p-6 bg-ag-bg-2 border border-ag-border hover:border-ag-accent/30 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-ag-accent mb-2">{item.outlet} · {item.date}</p>
                  <h3 className="text-ag-text font-medium text-lg group-hover:text-ag-accent transition-colors">{item.title}</h3>
                </div>
                <ExternalLink className="h-5 w-5 text-ag-muted shrink-0 mt-1 group-hover:text-ag-accent transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
