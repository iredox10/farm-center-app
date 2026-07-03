'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { account } from '@/lib/appwrite/client';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!userId || !secret) {
      setError('root', { message: 'Invalid or expired password reset link.' });
      return;
    }

    setIsLoading(true);
    try {
      await account.updateRecovery(userId, secret, data.password);
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      setError('root', { message: error.message || 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId || !secret) {
    return (
      <div className="text-center p-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-error/10 mb-4">
          <Lock className="h-8 w-8 text-error" />
        </div>
        <h2 className="font-heading text-xl font-bold text-primary mb-2">Invalid Link</h2>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block w-full rounded-xl bg-primary px-6 py-3.5 font-label text-sm font-bold text-on-primary transition-colors hover:opacity-90"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="font-heading text-xl font-bold text-primary mb-2">
          Password Reset Successfully
        </h2>
        <p className="font-body text-sm text-on-surface-variant mb-8">
          You can now log in using your new password.
        </p>
        <Link
          href="/login"
          className="w-full rounded-xl bg-primary py-3.5 font-label text-sm font-bold text-on-primary transition-colors hover:opacity-90"
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-black text-primary tracking-tight">
          Create new password
        </h1>
        <p className="mt-2 font-body text-sm text-on-surface-variant">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-xl bg-error/10 p-4 text-center">
            <p className="font-label text-sm font-semibold text-error">
              {errors.root.message}
            </p>
          </div>
        )}

        <div>
          <label className="mb-2 block font-label text-sm font-semibold text-on-surface">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              {...register('password')}
              className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 pr-12 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              placeholder="Confirm new password"
              {...register('confirmPassword')}
              className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 pr-12 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 font-label text-xs font-medium text-error">
              {errors.confirmPassword.message}
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
            'Reset Password'
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 bg-[#fafafa] relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-secondary-container/10 blur-[100px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-primary-container/10 blur-[100px] translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="rounded-[2rem] border border-outline-variant/50 bg-white p-8 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
          <Suspense fallback={<div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
