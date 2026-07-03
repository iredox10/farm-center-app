import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, ORDERS_COLLECTION, PLATFORM_CONFIG_COLLECTION, SHOPS_COLLECTION } from '@/lib/appwrite/config';
import { Query, AppwriteException } from 'node-appwrite';

const GLOBAL_CONFIG_ID = 'global';

export async function GET() {
  try {
    const { databases } = createAdminClient();

    // 1. Fetch config to get commission rate
    let commissionRate = 5.0; // fallback
    try {
      const config = await databases.getDocument(DATABASE_ID, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_ID);
      commissionRate = config.commissionRate || 5.0;
    } catch (e: any) {
      if (e instanceof AppwriteException && e.code !== 404) {
        throw e;
      }
    }

    // 2. Fetch completed orders (e.g. status: 'delivered')
    const ordersRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION, [
      Query.limit(500),
      // In a real app we would only calculate commission for completed orders.
      // Query.equal('status', 'delivered')
    ]);

    let totalOrderVolume = 0;
    let totalPlatformCommission = 0;
    
    // Group earnings by shop
    const shopEarnings: Record<string, { shopId: string, totalSales: number, platformCut: number, sellerPayout: number }> = {};

    ordersRes.documents.forEach((order) => {
      // Basic math
      const amount = order.totalAmount || 0;
      // You can store exact commission inside the order at the time of purchase to be safe against rate changes
      const cut = order.commissionAmount || (amount * (commissionRate / 100));
      const payout = amount - cut;

      totalOrderVolume += amount;
      totalPlatformCommission += cut;

      if (!shopEarnings[order.shopId]) {
        shopEarnings[order.shopId] = {
          shopId: order.shopId,
          totalSales: 0,
          platformCut: 0,
          sellerPayout: 0
        };
      }
      
      shopEarnings[order.shopId].totalSales += amount;
      shopEarnings[order.shopId].platformCut += cut;
      shopEarnings[order.shopId].sellerPayout += payout;
    });

    // 3. Enrich with shop names
    const payoutList = await Promise.all(
      Object.values(shopEarnings).map(async (earnings) => {
        let shopName = 'Unknown Shop';
        try {
          const shop = await databases.getDocument(DATABASE_ID, SHOPS_COLLECTION, earnings.shopId);
          shopName = shop.name;
        } catch {
          // ignore
        }
        return {
          ...earnings,
          shopName
        };
      })
    );

    return NextResponse.json({
      success: true,
      metrics: {
        totalOrderVolume,
        totalPlatformCommission,
        commissionRate,
      },
      payouts: payoutList
    });
  } catch (error: any) {
    console.error('Error fetching admin commissions:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
