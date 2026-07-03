'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/dashboard/ProductForm';

/* Mock product data for edit mode */
const MOCK_PRODUCTS: Record<string, {
  name: string;
  description: string;
  categoryIds: string[];
  condition: 'new' | 'uk-used' | 'refurbished';
  price: number;
  discountPrice: number;
  stockQuantity: number;
}> = {
  '1': {
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Brand new iPhone 15 Pro Max with 256GB storage. Natural Titanium finish. Comes with original box, charger, and Apple warranty. A17 Pro chip, 48MP camera system, titanium design.',
    categoryIds: ['phones'],
    condition: 'new',
    price: 950000,
    discountPrice: 0,
    stockQuantity: 5,
  },
  '2': {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra with 512GB storage and S-Pen. Titanium Gray color. Features AI-powered photo editing, 200MP camera, and Snapdragon 8 Gen 3 processor.',
    categoryIds: ['phones'],
    condition: 'new',
    price: 780000,
    discountPrice: 720000,
    stockQuantity: 3,
  },
  '3': {
    name: 'MacBook Air M3 2024',
    description: 'UK-used MacBook Air with Apple M3 chip. 15-inch Liquid Retina display. 16GB unified memory, 512GB SSD. Battery health at 94%. Comes with original charger, no box.',
    categoryIds: ['laptops'],
    condition: 'uk-used',
    price: 1200000,
    discountPrice: 0,
    stockQuantity: 1,
  },
  '4': {
    name: 'JBL Flip 6 Bluetooth Speaker',
    description: 'Professionally refurbished JBL Flip 6 portable speaker. IP67 waterproof, 12 hours battery life. Sound quality tested and certified. Comes with USB-C cable.',
    categoryIds: ['audio', 'electronics'],
    condition: 'refurbished',
    price: 85000,
    discountPrice: 75000,
    stockQuantity: 8,
  },
  '5': {
    name: 'AirPods Pro 2nd Generation',
    description: 'Brand new sealed AirPods Pro (2nd generation) with MagSafe Charging Case (USB-C). Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio.',
    categoryIds: ['audio', 'accessories'],
    condition: 'new',
    price: 185000,
    discountPrice: 0,
    stockQuantity: 0,
  },
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const product = MOCK_PRODUCTS[id];

  if (!product) {
    return (
      <div className="glass-card p-12 text-center">
        <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
          Product Not Found
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-navy-950 text-sm font-bold hover:shadow-lg hover:shadow-green-400/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

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
          <h2 className="font-heading text-2xl font-bold text-text-primary">Edit Product</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Update &quot;{product.name}&quot;
          </p>
        </div>
      </div>

      <ProductForm
        initialData={product}
        isEditing
        onSubmit={async (data, media) => {
          console.log('Updating product:', id, data, media);
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }}
      />
    </div>
  );
}
