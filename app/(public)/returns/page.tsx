import React from 'react';
import { RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="bg-ag-bg min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ag-accent mb-3">Support</p>
          <h1 className="font-display text-4xl md:text-5xl text-ag-text mb-4">Returns &amp; Exchanges</h1>
          <p className="text-ag-text-2">Your satisfaction is our priority.</p>
        </header>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-ag-bg-2 border border-ag-border text-center">
            <Clock className="h-8 w-8 text-ag-accent mx-auto mb-3" />
            <h3 className="font-display text-lg text-ag-text mb-1">30-Day Window</h3>
            <p className="text-ag-text-2 text-sm">Return any unused item within 30 days of delivery.</p>
          </div>
          <div className="p-6 bg-ag-bg-2 border border-ag-border text-center">
            <RotateCcw className="h-8 w-8 text-ag-accent mx-auto mb-3" />
            <h3 className="font-display text-lg text-ag-text mb-1">Free Returns</h3>
            <p className="text-ag-text-2 text-sm">We cover return shipping costs for defective or incorrect items.</p>
          </div>
          <div className="p-6 bg-ag-bg-2 border border-ag-border text-center">
            <CheckCircle className="h-8 w-8 text-ag-accent mx-auto mb-3" />
            <h3 className="font-display text-lg text-ag-text mb-1">Quick Refund</h3>
            <p className="text-ag-text-2 text-sm">Refunds are processed within 5-7 business days after we receive the item.</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-ag-text-2 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl text-ag-text mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>Contact our concierge team at <a href="mailto:concierge@vellure.id" className="text-ag-accent">concierge@vellure.id</a> with your order number.</li>
              <li>You will receive a return authorization and shipping label within 24 hours.</li>
              <li>Pack the item securely in its original packaging.</li>
              <li>Drop off the package with the designated courier.</li>
              <li>Once received and inspected, your refund will be processed.</li>
            </ol>
          </div>
          <div className="p-6 bg-ag-bg-2 border border-ag-border border-l-4 border-l-ag-accent">
            <h3 className="text-ag-text font-medium mb-2 flex items-center gap-2"><XCircle className="h-4 w-4 text-red-400" /> Non-Returnable Items</h3>
            <p>Items marked as &quot;Final Sale,&quot; gift cards, and personalized/custom products are not eligible for returns or exchanges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
