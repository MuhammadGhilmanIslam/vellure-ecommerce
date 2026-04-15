'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_DATA = [
  { q: 'How long does shipping take?', a: 'Standard shipping within Indonesia takes 3-5 business days. Express shipping is available for 1-2 business day delivery. International orders may take 7-14 business days depending on location.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for all unused items in their original packaging. Sale items are final sale and cannot be returned. Please contact our support team to initiate a return.' },
  { q: 'Do you ship internationally?', a: 'Yes! We currently ship to 15+ countries across Southeast Asia, East Asia, and select regions in Europe and North America. Shipping costs are calculated at checkout.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive an email with a tracking number and a link to track your package in real-time through our courier partners (JNE, SiCepat, J&T).' },
  { q: 'Are your products sustainably made?', a: 'Absolutely. Every product on our platform is evaluated against strict criteria for durability, ethical labor, and environmental impact. Our packaging is 100% recycled and recyclable.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled or modified within 1 hour of placement. After that, we begin processing and are unable to make changes. Contact concierge@vellure.id immediately if you need to make changes.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, AMEX), bank transfers (BCA, BNI, Mandiri, BRI), e-wallets (GoPay, OVO, DANA, ShopeePay), and Cash on Delivery for select areas.' },
  { q: 'How do I contact customer support?', a: 'You can reach our concierge team at concierge@vellure.id or through our Contact page. We respond within 24 hours on business days.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Support</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Frequently Asked Questions</h1>
          <p className="text-ag-text-2">Can&apos;t find what you&apos;re looking for? <a href="/contact" className="text-ag-accent hover:text-ag-text transition-colors">Contact us</a>.</p>
        </header>

        <div className="space-y-2">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className="border border-ag-border bg-ag-bg-2/50 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-ag-bg-2 transition-colors"
              >
                <span className="text-ag-text font-medium pr-4">{item.q}</span>
                <ChevronDown className={`h-5 w-5 text-ag-muted shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 text-ag-text-2 text-sm leading-relaxed border-t border-ag-border/50 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
