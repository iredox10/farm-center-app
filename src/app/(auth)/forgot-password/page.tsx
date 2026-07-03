'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { account } from '@/lib/appwrite/client';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Using window.location.origin ensures it works dynamically locally and in production
      const url = `${window.location.origin}/reset-password`;
      await account.createRecovery(data.email, url);
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      setError('root', { message: error.message || 'Failed to send reset email' });
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
        <div className="rounded-[2rem] border border-outline-variant/50 bg-white p-8 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
          {/* Back button */}
          <Link
            href="/login"
            className="mb-6 flex items-center gap-2 font-label text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-heading text-2xl font-black text-primary tracking-tight">
                  Forgot Password?
                </h1>
                <p className="mt-2 font-body text-sm text-on-surface-variant">
                  No worries, we'll send you reset instructions.
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
                  <label
                    htmlFor="email"
                    className="mb-2 block font-label text-sm font-semibold text-on-surface"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Please enter a valid email',
                        },
                      })}
                      className="w-full rounded-xl border border-outline-variant/50 bg-white py-3.5 pl-12 pr-4 text-sm font-body text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 font-label text-xs font-medium text-error">
                      {errors.email.message}
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
                    'Reset password'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="font-heading text-xl font-bold text-primary mb-2">
                Check your email
              </h2>
              <p className="font-body text-sm text-on-surface-variant mb-8">
                We sent a password reset link to <br />
                <span className="font-semibold text-on-surface">{getValues('email')}</span>
              </p>
              <Link
                href="/login"
                className="w-full text-center rounded-xl bg-surface-container py-3.5 font-label text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
