'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Contact Us</h1>
          <p className="text-ag-text-2 max-w-lg mx-auto">We&apos;d love to hear from you. Reach out for any inquiries, collaborations, or support.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ag-bg-2 border border-ag-border"><Mail className="h-5 w-5 text-ag-accent" /></div>
              <div>
                <h3 className="text-ag-text font-medium mb-1">Email</h3>
                <a href="mailto:concierge@vellure.id" className="text-ag-text-2 text-sm hover:text-ag-accent transition-colors">concierge@vellure.id</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ag-bg-2 border border-ag-border"><Phone className="h-5 w-5 text-ag-accent" /></div>
              <div>
                <h3 className="text-ag-text font-medium mb-1">Phone</h3>
                <p className="text-ag-text-2 text-sm">+62 812 3456 7890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ag-bg-2 border border-ag-border"><MapPin className="h-5 w-5 text-ag-accent" /></div>
              <div>
                <h3 className="text-ag-text font-medium mb-1">Address</h3>
                <p className="text-ag-text-2 text-sm">Jl. Sudirman No. 88<br/>Jakarta Selatan 12190, Indonesia</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ag-bg-2 border border-ag-border"><Clock className="h-5 w-5 text-ag-accent" /></div>
              <div>
                <h3 className="text-ag-text font-medium mb-1">Business Hours</h3>
                <p className="text-ag-text-2 text-sm">Mon — Fri: 09:00 — 18:00 WIB<br/>Sat: 10:00 — 15:00 WIB</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-ag-bg-2 p-8 border border-ag-border">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ag-muted mb-2">Full Name</label>
              <input type="text" required className="w-full bg-ag-bg border border-ag-border px-4 py-3 text-sm text-ag-text focus:outline-none focus:border-ag-accent transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ag-muted mb-2">Email Address</label>
              <input type="email" required className="w-full bg-ag-bg border border-ag-border px-4 py-3 text-sm text-ag-text focus:outline-none focus:border-ag-accent transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ag-muted mb-2">Subject</label>
              <select className="w-full bg-ag-bg border border-ag-border px-4 py-3 text-sm text-ag-text focus:outline-none focus:border-ag-accent transition-colors">
                <option>General Inquiry</option>
                <option>Order Support</option>
                <option>Returns & Exchanges</option>
                <option>Press & Media</option>
                <option>Collaboration</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ag-muted mb-2">Message</label>
              <textarea required rows={5} className="w-full bg-ag-bg border border-ag-border px-4 py-3 text-sm text-ag-text focus:outline-none focus:border-ag-accent transition-colors resize-none" placeholder="Tell us how we can help..." />
            </div>
            <button type="submit" className={`w-full py-4 font-mono text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${sent ? 'bg-emerald-600 text-white' : 'bg-ag-accent text-ag-bg hover:bg-ag-text'}`}>
              {sent ? '✓ Message Sent!' : <><Send className="h-4 w-4" /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
