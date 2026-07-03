import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, PLATFORM_CONFIG_COLLECTION } from '@/lib/appwrite/config';
import { AppwriteException } from 'node-appwrite';

const GLOBAL_CONFIG_ID = 'global';

export async function GET() {
  try {
    const { databases } = createAdminClient();

    let config;
    try {
      config = await databases.getDocument(DATABASE_ID, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_ID);
    } catch (error: any) {
      if (error instanceof AppwriteException && error.code === 404) {
        // Document doesn't exist, create default
        config = await databases.createDocument(DATABASE_ID, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_ID, {
          commissionRate: 5.0, // Default 5%
        });
      } else {
        throw error;
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { commissionRate } = body;

    if (typeof commissionRate !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid commission rate' }, { status: 400 });
    }

    const { databases } = createAdminClient();

    const config = await databases.updateDocument(DATABASE_ID, PLATFORM_CONFIG_COLLECTION, GLOBAL_CONFIG_ID, {
      commissionRate,
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
