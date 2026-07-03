'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { account } from '@/lib/appwrite/client';
import { useAuthStore } from '@/stores/auth';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(11, 'Please enter a valid phone number')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormData>();
  const phoneForm = useForm<PhoneFormData>();

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      // 1. Appwrite Session
      await account.createEmailPasswordSession(data.email, data.password);
      
      // 2. Initialize Zustand Store (fetches profile)
      const authStore = useAuthStore.getState();
      await authStore.initialize();
      const profile = authStore.profile;

      // 3. Set a mock session cookie so the proxy middleware allows access (can be updated later for SSR)
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: 'mock-session-id' }),
      });
      
      // 4. Redirect based on role
      const targetPath = profile?.role === 'admin' ? '/admin' : (profile?.role === 'seller' ? '/dashboard/shop' : '/dashboard');
      window.location.href = targetPath;
    } catch (err: any) {
      console.error(err);
      emailForm.setError('root', { message: err.message || 'Failed to login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      // Redirect to our verify page with a mock user session detail
      window.location.href = `/verify?userId=mock-user-id&phone=${data.phone}`;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 bg-[#fafafa] relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-secondary-container/10 blur-[100px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-primary-container/10 blur-[100px] translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div className="rounded-[2rem] border border-outline-variant/50 bg-white p-8 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <ShoppingBag className="h-8 w-8 text-on-primary" />
            </div>
            <div>
              <h1 className="text-center font-heading text-2xl font-black text-primary tracking-tight">
                Welcome back
              </h1>
              <p className="mt-1.5 text-center font-body text-sm text-on-surface-variant">
                Sign in to your Farm Center Market account
              </p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="mb-8 flex rounded-xl bg-surface-container p-1.5">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-label font-bold transition-all duration-200 ${
                activeTab === 'email'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-label font-bold transition-all duration-200 ${
                activeTab === 'phone'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
          </div>

          {/* Email Tab */}
          {activeTab === 'email' && (
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-5"
            >
              {emailForm.formState.errors.root && (
                <div className="rounded-xl bg-error/10 p-4 text-center">
                  <p className="font-label text-sm font-semibold text-error">
                    {emailForm.formState.errors.root.message}
                  </p>
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-label text-sm font-semibold text-on-surface"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...emailForm.register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                />
                {emailForm.formState.errors.email && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-label text-sm font-semibold text-on-surface"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...emailForm.register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 pr-12 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {emailForm.formState.errors.password && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {emailForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="font-label text-sm font-bold text-secondary transition-colors hover:text-secondary-container hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label text-base font-bold text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Phone Tab */}
          {activeTab === 'phone' && (
            <form
              onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-label text-sm font-semibold text-on-surface"
                >
                  Phone number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-xl border border-outline-variant bg-surface-container px-4 font-label text-sm font-semibold text-on-surface-variant">
                    +234
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="8012345678"
                    {...phoneForm.register('phone', {
                      required: 'Phone number is required',
                      minLength: {
                        value: 10,
                        message: 'Enter a valid phone number',
                      },
                      maxLength: {
                        value: 11,
                        message: 'Enter a valid phone number',
                      },
                    })}
                    className="flex-1 rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label text-base font-bold text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/50" />
            <span className="font-label text-xs font-semibold uppercase tracking-wider text-outline">or</span>
            <div className="h-px flex-1 bg-outline-variant/50" />
          </div>

          {/* Register link */}
          <p className="text-center font-body text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-label font-bold text-secondary transition-colors hover:text-secondary-container hover:underline ml-1"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
