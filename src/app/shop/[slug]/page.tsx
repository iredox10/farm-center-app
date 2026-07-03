import { notFound } from 'next/navigation';
import ShopPageClient from '@/components/shop/ShopPageClient';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, SHOPS_COLLECTION, PRODUCTS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const revalidate = 60; // Cache for 60s

export default async function ShopPage({ params }: { params: { slug: string } }) {
  try {
    const { databases } = createAdminClient();

    // Fetch shop by slug
    const shopRes = await databases.listDocuments(
      DATABASE_ID,
      SHOPS_COLLECTION,
      [Query.equal('slug', params.slug), Query.limit(1)]
    );

    if (shopRes.documents.length === 0) {
      return notFound();
    }

    const sDoc = shopRes.documents[0];
    const shop = {
      id: sDoc.$id,
      name: sDoc.name,
      slug: sDoc.slug,
      description: sDoc.description,
      location: sDoc.location,
      isVerified: sDoc.isVerified,
      ratingAverage: sDoc.ratingAverage,
      reviewCount: sDoc.reviewCount,
      phone: sDoc.phone,
      whatsapp: sDoc.whatsapp,
      allowPayOnDelivery: sDoc.allowPayOnDelivery,
      physicalAuditDate: sDoc.physicalAuditDate,
      productCount: sDoc.productCount,
    };

    // Fetch all active products for the shop
    const productsRes = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [
        Query.equal('shopId', shop.id),
        Query.equal('isActive', true),
        Query.limit(50) // Assuming up to 50 products per shop for display
      ]
    );

    const products = productsRes.documents.map(p => ({
      id: p.$id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      stockQuantity: p.stockQuantity,
      condition: p.condition || 'new',
      categoryIds: p.categoryIds || [],
      tag: p.viewCount > 100 ? 'BESTSELLER' : (p.condition === 'new' ? 'BRAND NEW' : 'UK USED'),
      tagType: p.condition === 'new' ? 'bg-[#00e5ff] text-[#041627]' : 'bg-[#006875] text-white',
      image: null,
      certificationStatus: p.certificationStatus,
      batteryHealth: p.batteryHealth,
      testingWarrantyDays: p.testingWarrantyDays,
      isFeatured: p.viewCount > 200,
    }));

    return <ShopPageClient shop={shop} products={products} />;
  } catch (error) {
    console.error('Failed to fetch shop:', error);
    return <ShopPageClient />;
  }
}
