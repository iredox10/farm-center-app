'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/dashboard/ProductForm';

export default function AddProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/products"
          className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary">Add New Product</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Fill in the details to list your product
          </p>
        </div>
      </div>

      <ProductForm
        onSubmit={async (data, media) => {
          // In production, this would call Appwrite to create the product
          console.log('Creating product:', data, media);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }}
      />
    </div>
  );
}
