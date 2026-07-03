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
    console.log('Email login:', data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    console.log('Phone login:', data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-green-400/5 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gold-400/5 blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-navy-900/60 p-8 backdrop-blur-2xl shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/20">
              <ShoppingBag className="h-7 w-7 text-navy-950" />
            </div>
            <div>
              <h1 className="text-center font-heading text-2xl font-bold text-text-primary">
                Welcome back
              </h1>
              <p className="mt-1 text-center text-sm text-text-muted">
                Sign in to your Farm Center Market account
              </p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="mb-6 flex rounded-2xl bg-white/5 p-1">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === 'email'
                  ? 'bg-white/10 text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === 'phone'
                  ? 'bg-white/10 text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
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
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                />
                {emailForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {emailForm.formState.errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {emailForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-400 transition-colors hover:text-green-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-6 py-3.5 font-heading text-sm font-bold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Phone Tab */}
          {activeTab === 'phone' && (
            <form
              onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  Phone number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-text-muted">
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
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-6 py-3.5 font-heading text-sm font-bold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-text-muted">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-text-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-green-400 transition-colors hover:text-green-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
