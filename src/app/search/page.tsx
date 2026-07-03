import SearchPageClient from '@/components/search/SearchPageClient';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, PRODUCTS_COLLECTION, SHOPS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const revalidate = 60; // Cache for 60s

export default async function SearchPage() {
  let products: any[] = [];
  try {
    const { databases } = createAdminClient();

    // Fetch all active products
    const productsRes = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [Query.equal('isActive', true), Query.limit(100)]
    );

    // Fetch shops to map shop names
    const shopsRes = await databases.listDocuments(
      DATABASE_ID,
      SHOPS_COLLECTION,
      [Query.equal('isActive', true), Query.limit(100)]
    );

    const shopMap = new Map();
    shopsRes.documents.forEach((s) => shopMap.set(s.$id, s.name));

    products = productsRes.documents.map((p) => ({
      id: p.$id,
      shopId: p.shopId,
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      discountPrice: p.discountPrice || 0,
      currency: p.currency || 'NGN',
      stockQuantity: p.stockQuantity || 0,
      condition: p.condition || 'new',
      categoryIds: p.categoryIds || [],
      isActive: p.isActive,
      viewCount: p.viewCount || 0,
      createdAt: p.$createdAt,
      shopName: shopMap.get(p.shopId) || 'Unknown Shop',
    }));

  } catch (error) {
    console.error('Failed to fetch search data:', error);
  }

  const productsProp = products.length > 0 ? products : undefined;
  return <SearchPageClient initialProducts={productsProp} />;
}
