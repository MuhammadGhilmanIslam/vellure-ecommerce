'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoginError('');
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setLoginError('Invalid credentials or insufficient permissions.');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-[#0A0A08] rounded-full mb-6">
            <ShieldCheck className="h-8 w-8 text-[#C8A96E]" />
          </div>
          <h1 className="font-display italic text-4xl text-[#1A1814] mb-2">VELLURE</h1>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#5A5650]">ADMIN ACCESS</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E4DE] p-10 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 font-mono">
                {loginError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5A5650]">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                autoComplete="email"
                className="w-full border-0 border-b border-[#C8C4BE] bg-transparent py-3 text-[#1A1814] focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
                placeholder="admin@vellure.id"
              />
              {errors.email && (
                <span className="text-red-500 text-xs font-mono">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5A5650]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  autoComplete="current-password"
                  className="w-full border-0 border-b border-[#C8C4BE] bg-transparent py-3 pr-10 text-[#1A1814] focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-[#5A5650] hover:text-[#1A1814] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs font-mono">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0A0A08] text-white py-4 font-mono text-xs uppercase tracking-[0.25em] hover:bg-[#C8A96E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> AUTHENTICATING...</>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8A8680] mt-8 font-mono">
          VELLURE · Restricted Access Only
        </p>
      </div>
    </div>
  );
}
