'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Store,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

type AccountType = 'buyer' | 'seller' | null;

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  shopName?: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    console.log('Register:', { ...data, accountType });
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-green-400/5 blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/3 h-96 w-96 rounded-full bg-gold-400/5 blur-[128px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= 1
                  ? 'bg-gradient-to-r from-green-500 to-green-400 text-navy-950'
                  : 'bg-white/10 text-text-muted'
              }`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>
            <span
              className={`text-sm font-medium ${
                step >= 1 ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              Account Type
            </span>
          </div>
          <div className="h-px w-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= 2
                  ? 'bg-gradient-to-r from-green-500 to-green-400 text-navy-950'
                  : 'bg-white/10 text-text-muted'
              }`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium ${
                step >= 2 ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              Details
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-navy-900/60 p-8 backdrop-blur-2xl shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/20">
              <ShoppingBag className="h-7 w-7 text-navy-950" />
            </div>
            <div>
              <h1 className="text-center font-heading text-2xl font-bold text-text-primary">
                {step === 1 ? 'Create your account' : 'Complete your profile'}
              </h1>
              <p className="mt-1 text-center text-sm text-text-muted">
                {step === 1
                  ? 'Choose how you want to use Farm Center Market'
                  : 'Fill in your details to get started'}
              </p>
            </div>
          </div>

          {/* Step 1: Account type selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Buyer card */}
                <button
                  onClick={() => setAccountType('buyer')}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                    accountType === 'buyer'
                      ? 'border-green-400 bg-green-400/5 shadow-lg shadow-green-400/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {accountType === 'buyer' && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-400">
                      <Check className="h-3.5 w-3.5 text-navy-950" />
                    </div>
                  )}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                      accountType === 'buyer'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-white/5 text-text-muted group-hover:bg-white/10 group-hover:text-text-secondary'
                    }`}
                  >
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-text-primary">
                      I want to Buy
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Browse and purchase electronics from trusted sellers
                    </p>
                  </div>
                </button>

                {/* Seller card */}
                <button
                  onClick={() => setAccountType('seller')}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                    accountType === 'seller'
                      ? 'border-green-400 bg-green-400/5 shadow-lg shadow-green-400/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  {accountType === 'seller' && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-400">
                      <Check className="h-3.5 w-3.5 text-navy-950" />
                    </div>
                  )}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
                      accountType === 'seller'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-white/5 text-text-muted group-hover:bg-white/10 group-hover:text-text-secondary'
                    }`}
                  >
                    <Store className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-text-primary">
                      I want to Sell
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      Open your shop and reach thousands of buyers in Kano
                    </p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => accountType && setStep(2)}
                disabled={!accountType}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-6 py-3.5 font-heading text-sm font-bold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/25 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Registration form */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('fullName', {
                    required: 'Full name is required',
                  })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-text-muted">
                    +234
                  </div>
                  <input
                    type="tel"
                    placeholder="8012345678"
                    {...register('phone', {
                      required: 'Phone number is required',
                      minLength: {
                        value: 10,
                        message: 'Enter a valid phone number',
                      },
                    })}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {accountType === 'seller' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TechHub Electronics"
                    {...register('shopName', {
                      required:
                        accountType === 'seller'
                          ? 'Shop name is required'
                          : false,
                    })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                  />
                  {errors.shopName && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.shopName.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password', {
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
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-green-400/50 focus:outline-none focus:ring-1 focus:ring-green-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms', {
                    required: 'You must agree to the terms',
                  })}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-green-400 focus:ring-green-400/30 accent-green-400"
                />
                <span className="text-sm text-text-muted">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-green-400 hover:text-green-300"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-green-400 hover:text-green-300"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-400">
                  {errors.agreeTerms.message}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3.5 text-sm font-medium text-text-secondary transition-all hover:bg-white/5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-6 py-3.5 font-heading text-sm font-bold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sign in link */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-green-400 transition-colors hover:text-green-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
