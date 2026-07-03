import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, SHOPS_COLLECTION, PROFILES_COLLECTION } from '@/lib/appwrite/config';
import { Query, ID } from 'node-appwrite';
import crypto from 'crypto';

export async function GET() {
  try {
    const { databases, users } = createAdminClient();

    // Fetch all shops
    const shopsRes = await databases.listDocuments(DATABASE_ID, SHOPS_COLLECTION, [
      Query.limit(100),
      Query.orderDesc('$createdAt')
    ]);

    // Fetch profile for each shop owner
    // For optimization in MVP, we just fetch profiles in bulk or one by one
    const enrichedShops = await Promise.all(
      shopsRes.documents.map(async (shop) => {
        try {
          const profile = await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION, shop.ownerId);
          return {
            id: shop.$id,
            name: shop.name,
            owner: profile.fullName || 'Unknown Owner',
            status: shop.isActive ? 'Active' : 'Pending',
            verified: shop.isVerified,
            joined: new Date(shop.$createdAt).toISOString().split('T')[0], // YYYY-MM-DD
          };
        } catch {
          return {
            id: shop.$id,
            name: shop.name,
            owner: 'Unknown (Profile Missing)',
            status: shop.isActive ? 'Active' : 'Pending',
            verified: shop.isVerified,
            joined: new Date(shop.$createdAt).toISOString().split('T')[0],
          };
        }
      })
    );

    return NextResponse.json({ success: true, shops: enrichedShops });
  } catch (error: any) {
    console.error('Error fetching admin shops:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopName, ownerName, ownerEmail, phone } = body;

    if (!shopName || !ownerName || !ownerEmail || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { users, databases } = createAdminClient();

    // 1. Check if user exists
    let user;
    let isNewUser = false;
    let tempPassword = null;

    try {
      const usersList = await users.list([Query.equal('email', [ownerEmail])]);
      if (usersList.total > 0) {
        user = usersList.users[0];
      }
    } catch (e) {
      console.error('Error searching for user:', e);
    }

    if (!user) {
      // Create user
      isNewUser = true;
      tempPassword = crypto.randomBytes(8).toString('hex') + 'A1!'; // e.g. a7f8d9b2A1!
      user = await users.create(
        ID.unique(),
        ownerEmail,
        phone,
        tempPassword,
        ownerName
      );
    }

    // 2. Create/Update Profile
    try {
      await databases.getDocument(DATABASE_ID, PROFILES_COLLECTION, user.$id);
      // If it exists, update role
      await databases.updateDocument(DATABASE_ID, PROFILES_COLLECTION, user.$id, {
        role: 'seller'
      });
    } catch {
      // Does not exist, create it
      await databases.createDocument(DATABASE_ID, PROFILES_COLLECTION, user.$id, {
        userId: user.$id,
        fullName: ownerName,
        phone: phone,
        role: 'seller',
        createdAt: new Date().toISOString()
      });
    }

    // 3. Create Shop
    const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const shop = await databases.createDocument(DATABASE_ID, SHOPS_COLLECTION, ID.unique(), {
      ownerId: user.$id,
      name: shopName,
      slug: slug,
      isActive: true, // Auto-active when created by admin
      isVerified: true, // Auto-verified when created by admin
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Shop created successfully',
      shopId: shop.$id,
      credentials: isNewUser ? { email: ownerEmail, password: tempPassword } : null,
      isNewUser
    });

  } catch (error: any) {
    console.error('Error creating shop:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
