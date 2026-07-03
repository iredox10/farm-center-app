'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Store,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getItemsByShop = useCartStore((s) => s.getItemsByShop);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const totalItems = getItemCount();
  const totalPrice = getTotal();
  const itemsByShop = getItemsByShop();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);

  const closeCart = () => {
    if (isOpen) toggleCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[100] flex h-full w-full max-w-md transform flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-navy-950/95 backdrop-blur-2xl border-l border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
                <ShoppingBag className="h-5 w-5 text-navy-950" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-text-primary">
                  Your Cart
                </h2>
                <p className="text-xs text-text-muted">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5">
                <ShoppingBag className="h-12 w-12 text-text-muted" />
              </div>
              <div className="text-center">
                <p className="font-heading text-lg font-semibold text-text-primary">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Discover amazing electronics at unbeatable prices
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-400 px-6 py-3 text-sm font-semibold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/20"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {Object.entries(itemsByShop).map(([shopId, shopItems]) => (
                  <div key={shopId}>
                    <div className="mb-3 flex items-center gap-2">
                      <Store className="h-3.5 w-3.5 text-text-muted" />
                      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                        {shopItems[0]?.shopName ?? shopId}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {shopItems.map((item) => (
                        <div
                          key={item.productId}
                          className="group flex gap-3 rounded-2xl bg-white/5 p-3 transition-colors hover:bg-white/[0.07]"
                        >
                          {/* Image placeholder */}
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-800">
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-text-muted/50" />
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div>
                              <p className="truncate text-sm font-medium text-text-primary">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-sm font-semibold text-green-400">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-text-muted transition-colors hover:bg-white/20 hover:text-text-primary"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-text-primary">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-text-muted transition-colors hover:bg-white/20 hover:text-text-primary"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs text-text-muted">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                                <button
                                  onClick={() => removeItem(item.productId)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with total */}
              <div className="border-t border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">
                    Total ({totalItems} items)
                  </span>
                  <span className="font-heading text-xl font-bold text-text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 px-6 py-4 font-heading text-sm font-bold text-navy-950 transition-all hover:shadow-lg hover:shadow-green-400/25 active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
