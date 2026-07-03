import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, SHOPS_COLLECTION, ORDERS_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export async function GET() {
  try {
    const { databases } = createAdminClient();

    // 1. Fetch Total Orders and Revenue
    const ordersRes = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION, [
      Query.limit(100), // In a real large-scale app, you'd want aggregation pipelines. We'll sum manually for MVP.
    ]);
    const totalOrders = ordersRes.total;
    const totalRevenue = ordersRes.documents.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    // 2. Fetch Shop Metrics
    const allShopsRes = await databases.listDocuments(DATABASE_ID, SHOPS_COLLECTION, [
      Query.limit(1000), // Get all shops for admin
    ]);
    
    let activeShops = 0;
    let pendingApprovals = 0;
    
    allShopsRes.documents.forEach((shop) => {
      if (shop.isActive) {
        activeShops++;
      }
      if (!shop.isVerified) {
        pendingApprovals++;
      }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue: `₦${totalRevenue.toLocaleString()}`,
        activeShops: activeShops.toString(),
        pendingApprovals: pendingApprovals.toString(),
        totalOrders: totalOrders.toString(),
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
