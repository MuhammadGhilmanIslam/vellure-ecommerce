'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setIsLoading(false);
      alert('Invalid credentials. Try guest@vellure.id / password');
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="bg-ag-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-ag-bg-2 p-8 border border-ag-border shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <h1 className="font-display italic text-3xl text-ag-text mb-2">VELLURE</h1>
          <p className="text-ag-text-2 font-mono text-xs uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input 
            label="Password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="accent-ag-accent h-3 w-3" />
              <span className="text-xs text-ag-text-2 group-hover:text-ag-text transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-xs text-ag-accent hover:text-ag-text transition-colors">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full mt-8" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'SIGN IN'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-ag-text-2 pt-6 border-t border-ag-border">
          Don't have an account? <a href="#" className="text-ag-text hover:text-ag-accent transition-colors font-medium">Create one</a>
        </div>
        
        <div className="mt-6 text-center">
             <Link href="/admin/login" className="text-xs font-mono text-ag-muted hover:text-ag-text transition-colors">Admin Portal →</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-ag-bg min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-ag-accent" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
