'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronRight, Lock, MapPin, Truck, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart.store';
import { checkoutSchema, CheckoutInput } from '@/lib/validations';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const STEPS = ['Contact', 'Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const { register, handleSubmit, formState: { errors, isValid }, trigger, watch, setValue } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  });

  const formValues = watch();

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (!mounted || items.length === 0) return null;

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ['customerEmail', 'customerName', 'customerPhone', 'address'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['courier', 'courierService'];
    }

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: CheckoutInput) => {
    if (currentStep !== 3) return;
    
    setIsSubmitting(true);
    // Simulate API call to create order
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      router.push('/checkout/success?order=AG-TEST-123'); // Placeholder redirect
    }, 2000);
  };

  const currentSubtotal = subtotal();
  const shippingCost = formValues.courier ? 35000 : 0; // Fake shipping cost
  const total = currentSubtotal + shippingCost;

  // Render Steps content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Contact & Address
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-ag-muted" /> Contact Information
              </h2>
              <div className="grid gap-4">
                <Input label="Email Address" type="email" error={errors.customerEmail?.message} {...register('customerEmail')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" error={errors.customerName?.message} {...register('customerName')} />
                  <Input label="Phone Number" error={errors.customerPhone?.message} {...register('customerPhone')} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ag-muted" /> Shipping Address
              </h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-ag-text-2 font-mono uppercase">Province</label>
                    <select className="w-full bg-transparent border-b border-ag-border py-4 text-ag-text focus:outline-none focus:border-ag-accent transition-colors" {...register('address.province')}>
                      <option value="" className="bg-ag-bg">Select Province</option>
                      <option value="DKI Jakarta" className="bg-ag-bg">DKI Jakarta</option>
                      <option value="Jawa Barat" className="bg-ag-bg">Jawa Barat</option>
                      <option value="Banten" className="bg-ag-bg">Banten</option>
                    </select>
                    {errors.address?.province && <span className="text-error text-xs">{errors.address.province.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-ag-text-2 font-mono uppercase">City</label>
                    <select className="w-full bg-transparent border-b border-ag-border py-4 text-ag-text focus:outline-none focus:border-ag-accent transition-colors" {...register('address.city')}>
                      <option value="" className="bg-ag-bg">Select City</option>
                      <option value="Jakarta Selatan" className="bg-ag-bg">Jakarta Selatan</option>
                      <option value="Bandung" className="bg-ag-bg">Bandung</option>
                    </select>
                    {errors.address?.city && <span className="text-error text-xs">{errors.address.city.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="District (Kecamatan)" error={errors.address?.district?.message} {...register('address.district')} />
                  <Input label="Postal Code" error={errors.address?.postalCode?.message} {...register('address.postalCode')} />
                </div>
                
                <div className="relative">
                  <textarea 
                    placeholder="Full Address (Street, Building, House Number)"
                    className="w-full bg-transparent border-b border-ag-border py-4 text-ag-text focus:outline-none focus:border-ag-accent transition-colors min-h-[100px] resize-none"
                    {...register('address.fullAddress')}
                  />
                  {errors.address?.fullAddress && <span className="text-error text-xs absolute -bottom-5 left-0">{errors.address.fullAddress.message}</span>}
                </div>
                
                {/* Fake inputs to satisfy schema for the address sub-object name/phone which aren't in this mockup distinctly but required by schema */}
                <input type="hidden" value={formValues.customerName || 'Pending'} {...register('address.name')} />
                <input type="hidden" value={formValues.customerPhone || '000000000'} {...register('address.phone')} />

              </div>
            </div>
            
            <Button size="lg" className="w-full mt-8" onClick={handleNextStep}>CONTINUE TO SHIPPING</Button>
          </div>
        );

      case 1: // Shipping
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-ag-muted" /> Shipping Method
             </h2>
             
             <div className="space-y-4">
                <label className={`block border p-6 rounded-sm cursor-pointer transition-colors ${formValues.courier === 'JNE' ? 'border-ag-accent bg-ag-accent/5' : 'border-ag-border hover:border-ag-accent/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="radio" value="JNE" {...register('courier')} className="accent-ag-accent" onClick={() => setValue('courierService', 'REG')} />
                      <span className="font-medium text-ag-text">JNE Regular</span>
                    </div>
                    <span className="text-ag-text font-medium">{formatPrice(35000)}</span>
                  </div>
                  <p className="text-ag-text-2 text-sm pl-7">Estimated delivery: 2-3 business days</p>
                </label>

                <label className={`block border p-6 rounded-sm cursor-pointer transition-colors ${formValues.courier === 'SICEPAT' ? 'border-ag-accent bg-ag-accent/5' : 'border-ag-border hover:border-ag-accent/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input type="radio" value="SICEPAT" {...register('courier')} className="accent-ag-accent" onClick={() => setValue('courierService', 'BEST')} />
                      <span className="font-medium text-ag-text">SiCepat BEST</span>
                    </div>
                    <span className="text-ag-text font-medium">{formatPrice(45000)}</span>
                  </div>
                  <p className="text-ag-text-2 text-sm pl-7">Estimated delivery: 1-2 business days</p>
                </label>
                {errors.courier && <span className="text-error text-xs">{errors.courier.message}</span>}
             </div>

             <div className="flex gap-4 mt-8">
               <Button variant="ghost" onClick={handlePrevStep} className="w-1/3">BACK</Button>
               <Button size="lg" className="w-2/3" onClick={handleNextStep}>CONTINUE TO PAYMENT</Button>
             </div>
          </div>
        );

      case 2: // Payment
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-ag-muted" /> Payment Method
             </h2>
             
             <div className="space-y-4">
                {/* Simulated payment selector for the wizard, in reality integration handles this */}
                <div className="border border-ag-accent bg-ag-accent/5 p-6 rounded-sm text-center">
                   <p className="text-ag-text mb-2 font-medium">Midtrans Payment Gateway</p>
                   <p className="text-ag-text-2 text-sm">After review, you will be securely redirected to Midtrans to complete your purchase using Credit Card, GoPay, BCA Virtual Account, or other methods.</p>
                </div>
             </div>

             <div className="flex gap-4 mt-8">
               <Button variant="ghost" onClick={handlePrevStep} className="w-1/3">BACK</Button>
               <Button size="lg" className="w-2/3" onClick={handleNextStep}>REVIEW ORDER</Button>
             </div>
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-ag-muted" /> Review Your Order
             </h2>
             
             <div className="bg-ag-bg-2 p-6 rounded-sm border border-ag-border space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ag-muted mb-2">Contact</h4>
                    <p className="text-sm text-ag-text">{formValues.customerEmail}</p>
                    <p className="text-sm text-ag-text">{formValues.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ag-muted mb-2">Shipping To</h4>
                    <p className="text-sm text-ag-text">{formValues.customerName}</p>
                    <p className="text-sm text-ag-text">{formValues.address?.fullAddress}</p>
                    <p className="text-sm text-ag-text">{formValues.address?.district}, {formValues.address?.city}</p>
                    <p className="text-sm text-ag-text">{formValues.address?.province} {formValues.address?.postalCode}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-ag-border border-dashed">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-ag-muted mb-4">Method</h4>
                  <div className="flex justify-between text-sm text-ag-text">
                    <span>{formValues.courier} - {formValues.courierService}</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                </div>
             </div>
             
             <Input label="Add Notes to Order (Optional)" {...register('notes')} />

             <div className="flex gap-4 mt-8">
               <Button variant="ghost" onClick={handlePrevStep} className="w-1/3">BACK</Button>
               <Button size="lg" className="w-2/3" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'PLACE ORDER & PAY'}
               </Button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ag-bg pt-20 pb-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Content Area */}
          <div className="lg:w-7/12">
            <Link href="/cart" className="text-xs font-mono uppercase tracking-widest text-ag-muted hover:text-ag-text transition-colors mb-12 inline-block">
              ← Return to Cart
            </Link>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-2 whitespace-nowrap ${isActive ? 'text-ag-text' : isCompleted ? 'text-ag-accent' : 'text-ag-muted'}`}>
                      <span className={`flex justify-center items-center h-6 w-6 rounded-full text-xs font-bold border ${isActive ? 'border-ag-text bg-ag-text text-ag-bg' : isCompleted ? 'border-ag-accent' : 'border-ag-muted'}`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest">{step}</span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isCompleted ? 'text-ag-accent' : 'text-ag-border'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Form Area */}
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>
          </div>

          {/* Sticky Order Summary Right Panel */}
          <div className="lg:w-5/12 hidden lg:block">
            <div className="sticky top-28 bg-ag-bg-2 p-8 border border-ag-border rounded-sm">
               <h3 className="font-display text-xl mb-6 flex justify-between items-end">
                 Order Summary <span className="text-sm font-mono text-ag-muted">{items.length} items</span>
               </h3>

               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                 {items.map(item => (
                   <div key={item.id} className="flex gap-4 items-center">
                     <div className="w-16 h-20 bg-ag-bg relative shrink-0 border border-ag-border">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                       <span className="absolute -top-2 -right-2 bg-ag-accent text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">{item.quantity}</span>
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                       <h4 className="text-sm font-medium text-ag-text truncate">{item.name}</h4>
                       <span className="text-xs text-ag-muted mt-1">{item.variantInfo || 'Standard'}</span>
                     </div>
                     <span className="text-sm font-medium text-ag-text shrink-0">{formatPrice(item.price * item.quantity)}</span>
                   </div>
                 ))}
               </div>

               <div className="border-t border-ag-border pt-6 space-y-3 text-sm text-ag-text-2">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span className="text-ag-text">{formatPrice(currentSubtotal)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span className="text-ag-text">{shippingCost > 0 ? formatPrice(shippingCost) : 'Calculated next step'}</span>
                 </div>
               </div>

               <div className="border-t border-ag-border pt-6 mt-6 flex justify-between items-end">
                 <span className="font-mono text-sm uppercase tracking-widest text-ag-text">Total</span>
                 <div className="text-right">
                   <span className="text-xs text-ag-muted mr-2">IDR</span>
                   <span className="text-3xl font-display text-ag-accent">{formatPrice(total)}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
