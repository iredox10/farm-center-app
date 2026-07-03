import HomePageClient from '@/components/home/HomePageClient';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, PRODUCTS_COLLECTION, SHOPS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let products: any[] = [];
  let shops: any[] = [];

  try {
    const { databases } = createAdminClient();

    // Fetch popular products
    const productsRes = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION,
      [
        Query.equal('isActive', true),
        Query.orderDesc('viewCount'),
        Query.limit(8)
      ]
    );

    // Fetch popular shops
    const shopsRes = await databases.listDocuments(
      DATABASE_ID,
      SHOPS_COLLECTION,
      [
        Query.equal('isActive', true),
        Query.orderDesc('productCount'),
        Query.limit(8)
      ]
    );

    // Map the Appwrite data to the expected UI shapes if they exist, otherwise fallback
    if (productsRes.documents.length > 0) {
      products = productsRes.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        price: doc.price,
        image: null,
        condition: doc.condition || 'new',
        shop: doc.shopId, // We might need a real name here, but this is a fallback
        shopId: doc.shopId,
        rating: 0,
        reviews: 0,
        badge: doc.viewCount > 100 ? 'bestseller' : 'wishlist',
      }));
    }

    if (shopsRes.documents.length > 0) {
      shops = shopsRes.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        products: doc.productCount || 0,
        rating: doc.ratingAverage || 0,
        description: doc.description || '',
      }));
    }
    
    // Attempt to join shop names for products
    if (products.length > 0 && shops.length > 0) {
      products = products.map(p => {
        const shopInfo = shops.find(s => s.id === p.shopId);
        return {
          ...p,
          shop: shopInfo ? shopInfo.name : 'Unknown Shop'
        };
      });
    }

  } catch (error) {
    console.error('Failed to fetch data from Appwrite:', error);
  }

  // If no data found, we will pass undefined to fallback to the mock data defined in the client component
  const productsProp = products.length > 0 ? products : undefined;
  const shopsProp = shops.length > 0 ? shops : undefined;

  return <HomePageClient products={productsProp} shops={shopsProp} />;
}
