import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Legal</p>
          <h1 className="font-display text-4xl text-ag-text mb-2">Terms of Service</h1>
          <p className="text-ag-muted text-sm font-mono">Last updated: April 1, 2026</p>
        </header>
        <div className="prose prose-invert max-w-none prose-p:text-ag-text-2 prose-p:leading-relaxed prose-headings:text-ag-text prose-headings:font-display prose-li:text-ag-text-2 space-y-8">
          <section><h2>1. Acceptance of Terms</h2><p>By accessing and using Vellure, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p></section>
          <section><h2>2. Accounts</h2><p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating an account.</p></section>
          <section><h2>3. Orders & Pricing</h2><p>All prices are listed in Indonesian Rupiah (IDR) and include applicable taxes. We reserve the right to modify prices at any time. Orders are confirmed only after successful payment processing.</p></section>
          <section><h2>4. Intellectual Property</h2><p>All content on this platform, including text, images, logos, and design, is the property of Vellure and is protected by Indonesian and international copyright laws.</p></section>
          <section><h2>5. Limitation of Liability</h2><p>Vellure shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or products.</p></section>
          <section><h2>6. Governing Law</h2><p>These terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia.</p></section>
        </div>
      </div>
    </div>
  );
}
