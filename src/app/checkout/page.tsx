'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Truck, 
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
// Note: We'll use the Paystack Pop dynamically when needed.

type PaymentMethod = 'paystack' | 'pay_on_delivery' | 'whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const { user, profile } = useAuthStore();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    address: '',
    city: '',
    state: 'Kano', // Default for Farm Center Market
  });

  // Calculate totals
  const subtotal = getTotal();
  const deliveryFee = items.length > 0 ? 1500 : 0; // Flat delivery fee for mock purposes
  const total = subtotal + deliveryFee;

  // Protect route & check cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'whatsapp') {
        // WhatsApp order flow
        const shopNames = Array.from(new Set(items.map(i => i.shopName))).join(', ');
        const orderSummary = items.map(i => `${i.quantity}x ${i.name} (₦${i.price.toLocaleString()})`).join('%0A');
        
        const message = `*NEW ORDER FROM FARM CENTER MARKET*%0A%0A*Customer*: ${shippingInfo.fullName}%0A*Phone*: ${shippingInfo.phone}%0A*Address*: ${shippingInfo.address}, ${shippingInfo.city}%0A%0A*Order Details*:%0A${orderSummary}%0A%0A*Subtotal*: ₦${subtotal.toLocaleString()}%0A*Delivery*: ₦${deliveryFee.toLocaleString()}%0A*Total*: ₦${total.toLocaleString()}`;
        
        // Use a mock shop number for demonstration
        const shopPhone = '2348000000000';
        window.open(`https://wa.me/${shopPhone}?text=${message}`, '_blank');
        
        // In a real app, we'd save the order first. For now, clear cart and redirect
        useCartStore.getState().clearCart();
        router.push('/order-success');
        return;
      }

      if (paymentMethod === 'paystack') {
        // Initialize Paystack Inline
        const PaystackPop = (await import('@paystack/inline-js')).default;
        
        const paystack = new PaystackPop();
        
        paystack.newTransaction({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_mock',
          email: user?.email || 'customer@farmcentermarket.com',
          amount: total * 100, // Paystack uses kobo
          currency: 'NGN',
          ref: `FC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          onSuccess: (transaction: any) => {
            console.log('Payment complete! Reference: ' + transaction.reference);
            useCartStore.getState().clearCart();
            router.push('/order-success');
          },
          onCancel: () => {
            console.log('Transaction was canceled');
            setIsProcessing(false);
          }
        });
      }

      if (paymentMethod === 'pay_on_delivery') {
        // Mock save order
        await new Promise(r => setTimeout(r, 1500));
        useCartStore.getState().clearCart();
        router.push('/order-success');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null; // Avoid flashing during redirect

  return (
    <main className="min-h-screen bg-[#fafafa] pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="w-10 h-10 rounded-full bg-white border border-outline-variant/50 flex items-center justify-center hover:bg-[#f3f4f6] transition-colors text-on-surface">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-on-surface">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping */}
            <div className={`bg-white rounded-2xl border ${step === 1 ? 'border-primary shadow-sm' : 'border-outline-variant/50'} overflow-hidden transition-all duration-300`}>
              <div className={`p-5 flex items-center justify-between ${step === 1 ? 'bg-primary/5' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-primary text-white' : 'bg-[#f3f4f6] text-on-surface-variant'}`}>
                    {step > 1 ? <CheckCircle2 className="w-5 h-5 text-primary" /> : '1'}
                  </div>
                  <h2 className={`font-heading font-bold ${step === 1 ? 'text-primary' : 'text-on-surface'}`}>Delivery Details</h2>
                </div>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-sm font-label font-bold text-primary hover:underline">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 && (
                <form onSubmit={handleNextStep} className="p-6 pt-2 border-t border-outline-variant/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Enter your full name" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="08012345678" 
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">Delivery Address</label>
                    <textarea 
                      required 
                      rows={2}
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      placeholder="Street address, apartment, suite, etc." 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">City</label>
                      <input 
                        required 
                        type="text" 
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="e.g. Kano" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-label font-semibold text-on-surface mb-1.5">State</label>
                      <select 
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      >
                        <option value="Kano">Kano State</option>
                        <option value="Jigawa">Jigawa State</option>
                        <option value="Kaduna">Kaduna State</option>
                        <option value="Katsina">Katsina State</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full md:w-auto md:ml-auto flex items-center justify-center gap-2 bg-[#0f172a] text-white px-8 py-3.5 rounded-xl font-label font-bold hover:bg-black transition-colors">
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white rounded-2xl border ${step === 2 ? 'border-primary shadow-sm' : 'border-outline-variant/50'} overflow-hidden transition-all duration-300`}>
              <div className={`p-5 flex items-center justify-between ${step === 2 ? 'bg-primary/5' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-primary text-white' : 'bg-[#f3f4f6] text-on-surface-variant'}`}>
                    2
                  </div>
                  <h2 className={`font-heading font-bold ${step === 2 ? 'text-primary' : 'text-on-surface'}`}>Payment Method</h2>
                </div>
              </div>

              {step === 2 && (
                <div className="p-6 border-t border-outline-variant/50 space-y-4">
                  
                  {/* Paystack Option */}
                  <label className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'border-primary bg-primary/5' : 'border-outline-variant/50 bg-white hover:border-outline'}`}>
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'paystack'}
                          onChange={() => setPaymentMethod('paystack')}
                          className="w-4 h-4 text-primary focus:ring-primary accent-primary" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading font-bold text-on-surface">Pay Online (Secure)</h3>
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-on-surface-variant mb-2">Pay securely with your Card, Bank Transfer, or USSD via Paystack.</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-max">
                          <ShieldCheck className="w-3.5 h-3.5" /> Buyer Protection Included
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Pay on Delivery Option */}
                  <label className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'pay_on_delivery' ? 'border-primary bg-primary/5' : 'border-outline-variant/50 bg-white hover:border-outline'}`}>
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'pay_on_delivery'}
                          onChange={() => setPaymentMethod('pay_on_delivery')}
                          className="w-4 h-4 text-primary focus:ring-primary accent-primary" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading font-bold text-on-surface">Pay on Delivery</h3>
                          <Truck className="w-5 h-5 text-on-surface-variant" />
                        </div>
                        <p className="text-sm text-on-surface-variant">Pay with cash or transfer when the item arrives.</p>
                      </div>
                    </div>
                  </label>

                  {/* WhatsApp Option */}
                  <label className={`block relative p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-[#25D366] bg-[#25D366]/5' : 'border-outline-variant/50 bg-white hover:border-outline'}`}>
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'whatsapp'}
                          onChange={() => setPaymentMethod('whatsapp')}
                          className="w-4 h-4 text-[#25D366] focus:ring-[#25D366] accent-[#25D366]" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading font-bold text-on-surface">Order via WhatsApp</h3>
                          <div className="w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant">Send your order directly to the seller via WhatsApp.</p>
                      </div>
                    </div>
                  </label>

                  <div className="pt-4">
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 bg-[#0f172a] text-white px-8 py-4 rounded-xl font-label font-bold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                    </button>
                    <p className="text-center text-xs text-outline mt-3 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Your data is securely encrypted.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-outline-variant/50 sticky top-24 p-6 shadow-[0_4px_12px_rgba(4,22,39,0.02)]">
              <h2 className="font-heading font-bold text-lg text-on-surface mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                      {/* Placeholder for image */}
                      <span className="font-label font-bold text-outline-variant text-xs">{item.quantity}x</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-sm font-semibold text-on-surface line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-outline mb-1">{item.shopName}</p>
                      <p className="font-bold text-sm text-on-surface">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-outline-variant/50 pt-4 space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-semibold text-on-surface">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Delivery Fee</span>
                  <span className="font-semibold text-on-surface">{formatPrice(deliveryFee)}</span>
                </div>
              </div>
              
              <div className="border-t border-outline-variant/50 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-heading font-bold text-on-surface">Total</span>
                  <span className="font-heading font-bold text-primary text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-blue-50 text-blue-800 rounded-xl p-3 flex gap-3 text-xs items-start">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                <p>Items may be delivered separately if they are from different shops.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
