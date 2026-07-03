'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { account } from '@/lib/appwrite/client';
import { useAuthStore } from '@/stores/auth';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const phone = searchParams.get('phone') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('Missing verification session details. Please go back and try again.');
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (code.length < 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Create Appwrite Session using the OTP code
      const session = await account.createSession(userId, code);

      // 2. Set custom session cookie for the Next.js server proxy
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: session.$id }),
      });

      // 3. Initialize authentication state
      await useAuthStore.getState().initialize();

      // 4. Redirect to dashboard or home
      router.push('/dashboard');
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setError(err?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    setIsResending(true);
    setError('');
    setResendStatus('');

    try {
      await account.createPhoneToken(userId || 'unique()', phone);
      setResendStatus('A new code has been sent successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-outline-variant/50 bg-white p-8 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
      {/* Icon & Title */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20">
          <ShieldCheck className="h-8 w-8 text-on-secondary" />
        </div>
        <div>
          <h1 className="text-center font-heading text-2xl font-black text-primary tracking-tight">
            Verify Phone Number
          </h1>
          <p className="mt-1.5 text-center font-body text-sm text-on-surface-variant">
            Enter the 6-digit code sent to <span className="font-semibold text-primary">{phone || 'your phone'}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-error-container p-4 text-sm font-label font-bold text-on-error-container">
          {error}
        </div>
      )}

      {resendStatus && (
        <div className="mb-6 rounded-xl bg-secondary-container p-4 text-sm font-label font-bold text-on-secondary-container">
          {resendStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="code"
            className="mb-2 block font-label text-sm font-semibold text-on-surface"
          >
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-xl border border-outline-variant/50 bg-white px-4 py-3.5 text-center font-heading text-2xl font-bold tracking-[0.5em] text-on-surface placeholder:text-outline transition-all focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/30"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !userId}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label text-base font-bold text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Verify & Sign In'
          )}
        </button>
      </form>

      {/* Resend actions */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={handleResend}
          disabled={isResending || !phone}
          className="font-label text-sm font-bold text-secondary transition-colors hover:text-secondary-container hover:underline disabled:opacity-50"
        >
          {isResending ? 'Resending...' : "Didn't receive code? Resend Code"}
        </button>

        <Link
          href="/login"
          className="flex items-center gap-2 font-label text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 bg-[#fafafa] relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-secondary-container/10 blur-[100px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-primary-container/10 blur-[100px] translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <Suspense fallback={
          <div className="rounded-[2rem] border border-outline-variant/50 bg-white p-8 shadow-[0_4px_12px_rgba(4,22,39,0.02)] flex flex-col items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 font-body text-sm text-on-surface-variant">Loading verification content...</p>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
