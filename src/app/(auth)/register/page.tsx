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
import { account, databases } from '@/lib/appwrite/client';
import { DATABASE_ID, PROFILES_COLLECTION, SHOPS_COLLECTION } from '@/lib/appwrite/config';
import { ID } from 'appwrite';
import { useAuthStore } from '@/stores/auth';

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
    try {
      // 1. Create User in Appwrite Auth
      const user = await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.fullName
      );
      
      // Update phone (requires active session usually, or server SDK, but let's just store it in profile)
      // We will store phone in profile instead of Auth if it throws errors without verification
      
      // 2. Create Session (Login)
      await account.createEmailPasswordSession(data.email, data.password);

      // 3. Create Profile in Database
      await databases.createDocument(
        DATABASE_ID,
        PROFILES_COLLECTION,
        user.$id,
        {
          userId: user.$id,
          fullName: data.fullName,
          phone: data.phone,
          role: accountType || 'buyer',
          createdAt: new Date().toISOString(),
        }
      );

      // 4. If Seller, Create Shop Placeholder
      if (accountType === 'seller' && data.shopName) {
        await databases.createDocument(
          DATABASE_ID,
          SHOPS_COLLECTION,
          ID.unique(),
          {
            ownerId: user.$id,
            name: data.shopName,
            slug: data.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            createdAt: new Date().toISOString(),
            isActive: false, // Needs to complete onboarding/verification
          }
        );
      }

      // 5. Initialize Store
      await useAuthStore.getState().initialize();

      // 6. Set mock session cookie for middleware
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: 'mock-session-id' }),
      });

      // 7. Redirect based on role
      window.location.href = accountType === 'seller' ? '/dashboard/shop' : '/dashboard';
      
    } catch (err: any) {
      console.error(err);
      // We can use setError to display the error on the UI
      alert(err.message || 'Failed to register account');
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

      <div className="relative w-full max-w-lg z-10">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-label text-xs font-bold transition-colors ${
                step >= 1
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {step > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>
            <span
              className={`font-label text-sm font-bold ${
                step >= 1 ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Account Type
            </span>
          </div>
          <div className="h-px w-10 bg-outline-variant/50" />
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-label text-xs font-bold transition-colors ${
                step >= 2
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              2
            </div>
            <span
              className={`font-label text-sm font-bold ${
                step >= 2 ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Details
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] border border-outline-variant/50 bg-white p-8 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <ShoppingBag className="h-8 w-8 text-on-primary" />
            </div>
            <div>
              <h1 className="text-center font-heading text-2xl font-black text-primary tracking-tight">
                {step === 1 ? 'Create your account' : 'Complete your profile'}
              </h1>
              <p className="mt-1.5 text-center font-body text-sm text-on-surface-variant">
                {step === 1
                  ? 'Choose how you want to use Farm Center Market'
                  : 'Fill in your details to get started'}
              </p>
            </div>
          </div>

          {/* Step 1: Account type selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Buyer card */}
                <button
                  onClick={() => setAccountType('buyer')}
                  className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                    accountType === 'buyer'
                      ? 'border-secondary bg-secondary-container/10 shadow-md shadow-secondary/10'
                      : 'border-outline-variant/50 bg-white hover:border-outline hover:bg-[#f3f4f6]'
                  }`}
                >
                  {accountType === 'buyer' && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                      <Check className="h-3.5 w-3.5 text-on-secondary" />
                    </div>
                  )}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
                      accountType === 'buyer'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-[#fafafa] text-on-surface-variant group-hover:bg-[#f3f4f6] group-hover:text-primary'
                    }`}
                  >
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-on-surface">
                      I want to Buy
                    </p>
                    <p className="mt-1.5 font-body text-xs text-on-surface-variant">
                      Browse and purchase electronics from trusted sellers
                    </p>
                  </div>
                </button>

                {/* Seller card */}
                <button
                  onClick={() => setAccountType('seller')}
                  className={`group relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                    accountType === 'seller'
                      ? 'border-secondary bg-secondary-container/10 shadow-md shadow-secondary/10'
                      : 'border-outline-variant/50 bg-white hover:border-outline hover:bg-[#f3f4f6]'
                  }`}
                >
                  {accountType === 'seller' && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                      <Check className="h-3.5 w-3.5 text-on-secondary" />
                    </div>
                  )}
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
                      accountType === 'seller'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant group-hover:bg-surface-container-high group-hover:text-primary'
                    }`}
                  >
                    <Store className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-on-surface">
                      I want to Sell
                    </p>
                    <p className="mt-1.5 font-body text-xs text-on-surface-variant">
                      Open your shop and reach thousands of buyers in Kano
                    </p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => accountType && setStep(2)}
                disabled={!accountType}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label text-base font-bold text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Registration form */}
          {step === 2 && (
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('fullName', {
                    required: 'Full name is required',
                  })}
                  className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                />
                {errors.fullName && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
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
                  className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                />
                {errors.email && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-xl border border-outline-variant bg-surface-container px-4 font-label text-sm font-semibold text-on-surface-variant">
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
                    className="flex-1 rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {accountType === 'seller' && (
                <div>
                  <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
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
                    className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                  />
                  {errors.shopName && (
                    <p className="mt-2 font-label text-xs font-medium text-error">
                      {errors.shopName.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
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
                {errors.password && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
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
                    className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 pr-12 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 font-label text-xs font-medium text-error">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  {...register('agreeTerms', {
                    required: 'You must agree to the terms',
                  })}
                  className="mt-1 h-4 w-4 rounded border-outline-variant bg-white text-secondary focus:ring-secondary/30 accent-secondary"
                />
                <span className="font-body text-sm text-on-surface-variant leading-relaxed">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="font-label font-bold text-secondary transition-colors hover:text-secondary-container hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="font-label font-bold text-secondary transition-colors hover:text-secondary-container hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="font-label text-xs font-medium text-error">
                  {errors.agreeTerms.message}
                </p>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-6 py-4 font-label text-base font-bold text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label text-base font-bold text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sign in link */}
          <div className="mt-8 border-t border-outline-variant/50 pt-8">
            <p className="text-center font-body text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link
                href="/login"
                className="ml-1 font-label font-bold text-secondary transition-colors hover:text-secondary-container hover:underline"
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
