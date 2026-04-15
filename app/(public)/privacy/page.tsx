import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Legal</p>
          <h1 className="font-display text-4xl text-ag-text mb-2">Privacy Policy</h1>
          <p className="text-ag-muted text-sm font-mono">Last updated: April 1, 2026</p>
        </header>
        <div className="prose prose-invert max-w-none prose-p:text-ag-text-2 prose-p:leading-relaxed prose-headings:text-ag-text prose-headings:font-display prose-li:text-ag-text-2 prose-strong:text-ag-text space-y-8">
          <section><h2>1. Information We Collect</h2><p>We collect personal information you provide directly to us, including your name, email address, shipping address, phone number, and payment information when you create an account, make a purchase, or contact our support team.</p></section>
          <section><h2>2. How We Use Your Information</h2><p>We use your information to process orders, communicate with you about products and services, personalize your shopping experience, and improve our platform. We will never sell your personal data to third parties.</p></section>
          <section><h2>3. Data Security</h2><p>We implement industry-standard security measures including SSL encryption, secure payment gateways (Midtrans), and regular security audits to protect your personal information.</p></section>
          <section><h2>4. Cookies</h2><p>We use essential cookies to maintain your session and shopping cart. Analytics cookies help us understand how you interact with our site. You can manage cookie preferences through your browser settings.</p></section>
          <section><h2>5. Your Rights</h2><p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:concierge@vellure.id" className="text-ag-accent">concierge@vellure.id</a> for any privacy-related requests.</p></section>
        </div>
      </div>
    </div>
  );
}
