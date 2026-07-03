'use client';

import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#fafafa] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-[2rem] p-8 text-center relative overflow-hidden">
        
        {/* Confetti-like background accents */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/5 rounded-full" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          
          <h1 className="font-heading text-2xl font-black text-on-surface mb-2">Order Confirmed!</h1>
          <p className="text-on-surface-variant text-sm mb-8">
            Thank you for shopping with Farm Center Market. Your order has been successfully placed.
          </p>
          
          <div className="bg-[#f3f4f6] rounded-xl p-4 mb-8 text-left">
            <h3 className="font-label font-bold text-xs text-outline uppercase tracking-wider mb-3">What happens next?</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-on-surface text-sm">Sellers are notified</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">The shops have received your order and are preparing your items.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-on-surface text-sm">Track your delivery</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">You can monitor your order status from your dashboard.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link href="/dashboard/orders" className="w-full flex items-center justify-center gap-2 bg-[#0f172a] text-white px-6 py-3.5 rounded-xl font-label font-bold hover:bg-black transition-colors">
              View My Orders <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link href="/" className="w-full flex items-center justify-center gap-2 bg-white text-on-surface border border-outline-variant/50 px-6 py-3.5 rounded-xl font-label font-bold hover:bg-[#f3f4f6] transition-colors">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
        
      </div>
    </main>
  );
}
