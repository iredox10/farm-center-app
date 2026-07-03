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
        className={`fixed inset-0 z-[90] bg-primary/40 backdrop-blur-sm transition-opacity duration-300 ${
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
        <div className="flex h-full flex-col bg-surface-container-lowest border-l border-outline-variant/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 p-5 bg-surface-container-lowest">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container">
                <ShoppingBag className="h-5 w-5 text-on-secondary-container" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-on-surface tracking-tight">
                  Your Cart
                </h2>
                <p className="text-xs font-label text-on-surface-variant">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 bg-surface-bright">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low shadow-sm">
                <ShoppingBag className="h-10 w-10 text-outline-variant" />
              </div>
              <div className="text-center">
                <p className="font-heading text-lg font-semibold text-on-surface">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm font-body text-on-surface-variant max-w-[250px] mx-auto">
                  Discover amazing electronics at unbeatable prices
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-label font-medium text-on-primary transition-all shadow-md hover:opacity-90 active:scale-[0.98]"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-surface-bright">
                {Object.entries(itemsByShop).map(([shopId, shopItems]) => (
                  <div key={shopId}>
                    <div className="mb-3 flex items-center gap-2">
                      <Store className="h-4 w-4 text-secondary" />
                      <span className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant">
                        {shopItems[0]?.shopName ?? shopId}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {shopItems.map((item) => (
                        <div
                          key={item.productId}
                          className="group flex gap-3 rounded-xl bg-surface-container-lowest border border-outline-variant p-3 shadow-sm transition-colors hover:border-secondary/30"
                        >
                          {/* Image placeholder */}
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high border border-outline-variant/30">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-outline-variant" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                            <div>
                              <p className="truncate text-sm font-heading font-medium text-on-surface">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-sm font-label font-semibold text-primary">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-label font-medium text-on-surface">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="flex h-7 w-7 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-label font-semibold text-on-surface-variant">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                                <button
                                  onClick={() => removeItem(item.productId)}
                                  className="flex h-7 w-7 items-center justify-center rounded text-outline transition-colors hover:bg-error-container hover:text-on-error-container"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
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
              <div className="border-t border-outline-variant/30 bg-surface-container-lowest p-5 space-y-4 shadow-[0_-4px_12px_rgba(4,22,39,0.03)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-label text-on-surface-variant">
                    Total ({totalItems} items)
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary-container px-6 py-4 font-label text-sm font-bold text-on-secondary-container transition-all shadow-md hover:opacity-90 active:scale-[0.98]"
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
