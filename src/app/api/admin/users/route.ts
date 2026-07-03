import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, PROFILES_COLLECTION } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export async function GET() {
  try {
    const { databases } = createAdminClient();

    const profilesRes = await databases.listDocuments(DATABASE_ID, PROFILES_COLLECTION, [
      Query.limit(100),
      Query.orderDesc('$createdAt')
    ]);

    const users = profilesRes.documents.map((profile) => ({
      id: profile.$id,
      fullName: profile.fullName || 'Unknown',
      phone: profile.phone || 'N/A',
      role: profile.role,
      joined: new Date(profile.$createdAt).toISOString().split('T')[0],
      status: 'Active', // Mocking status since Appwrite Auth maintains true status, but we don't have block status in profiles by default
      avatarUrl: profile.avatarUrl || null,
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
