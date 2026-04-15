'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

const mockProduct = {
  id: '1',
  slug: 'test-product',
  name: 'Signature Dark Roast Coffee Beans 500g',
  price: 250000,
  comparePrice: 350000,
  images: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop'],
  category: { name: 'COFFEE' },
  rating: 4.8,
  reviewsCount: 124,
  stock: 12,
  tags: ['NEW', 'SALE'],
};

export default function TestUIPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ag-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <h1 className="font-display text-display-md mb-16 text-ag-text">UI Components</h1>

        <section className="mb-16">
          <h2 className="text-xl font-mono uppercase tracking-widest text-ag-text-2 mb-8 border-b border-ag-border pb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="text" icon={<ArrowRight className="h-4 w-4"/>} iconPosition="right">Text Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-mono uppercase tracking-widest text-ag-text-2 mb-8 border-b border-ag-border pb-4">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-mono uppercase tracking-widest text-ag-text-2 mb-8 border-b border-ag-border pb-4">Inputs</h2>
          <div className="grid max-w-md gap-4">
            <Input label="Email Address" type="email" placeholder="Enter your email" />
            <Input label="Password" type="password" placeholder="Enter your password" />
            <Input label="With Error" error="This field is required" />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-mono uppercase tracking-widest text-ag-text-2 mb-8 border-b border-ag-border pb-4">Modals & Overlays</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal title="Example Modal" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <p className="text-ag-text-2 mb-6 mt-4">
              This is a demonstration of the modal component with scaleIn animation and backdrop blur.
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-mono uppercase tracking-widest text-ag-text-2 mb-8 border-b border-ag-border pb-4">Product Card</h2>
          <div className="w-full max-w-[300px]">
             <ProductCard product={mockProduct} />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
