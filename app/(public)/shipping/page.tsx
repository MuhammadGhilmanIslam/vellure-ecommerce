import React from 'react';
import { Truck, Clock, Globe, Package } from 'lucide-react';

const SHIPPING_OPTIONS = [
  { icon: Package, title: 'Standard Shipping', time: '3-5 Business Days', price: 'Rp 15.000 — Rp 25.000', desc: 'Available nationwide via JNE REG, SiCepat REG, or J&T EZ.' },
  { icon: Truck, title: 'Express Shipping', time: '1-2 Business Days', price: 'Rp 30.000 — Rp 50.000', desc: 'Priority handling via JNE YES, SiCepat BEST, or Grab Same-Day.' },
  { icon: Globe, title: 'International Shipping', time: '7-14 Business Days', price: 'Calculated at checkout', desc: 'Available to 15+ countries. Duties and taxes may apply at destination.' },
  { icon: Clock, title: 'Free Shipping', time: '3-5 Business Days', price: 'FREE', desc: 'All orders over Rp 1.000.000 qualify for free standard shipping within Indonesia.' },
];

export default function ShippingPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Support</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Shipping Information</h1>
          <p className="text-ag-text-2">We deliver with care, anywhere you are.</p>
        </header>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {SHIPPING_OPTIONS.map(opt => {
            const Icon = opt.icon;
            return (
              <div key={opt.title} className="p-8 bg-ag-bg-2 border border-ag-border hover:border-ag-accent/30 transition-colors">
                <Icon className="h-8 w-8 text-ag-accent mb-4" />
                <h3 className="font-display text-xl text-ag-text mb-1">{opt.title}</h3>
                <p className="font-mono text-xs text-ag-accent mb-3">{opt.time} · {opt.price}</p>
                <p className="text-ag-text-2 text-sm leading-relaxed">{opt.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-ag-border pt-12 space-y-6 text-sm text-ag-text-2 leading-relaxed">
          <h2 className="font-display text-2xl text-ag-text">Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>All orders are processed within 24 hours on business days (Mon-Fri).</li>
            <li>Delivery times are estimates and may vary during peak seasons or holidays.</li>
            <li>A tracking number will be sent via email once your order has shipped.</li>
            <li>For any shipping-related issues, contact <a href="mailto:concierge@vellure.id" className="text-ag-accent hover:text-ag-text transition-colors">concierge@vellure.id</a>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
