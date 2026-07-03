import { Client, Users, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error('Missing Appwrite configuration in .env');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const users = new Users(client);
const databases = new Databases(client);

const DATABASE_ID = 'farm_center_db';
const PROFILES_COLLECTION = 'profiles';

const ADMIN_EMAIL = 'idreesadam200@gmail.com';
const ADMIN_PASSWORD = 'farmpassword123';
const ADMIN_NAME = 'Idrees Adam';
const ADMIN_PHONE = '+2348123456789';

async function createSuperAdmin() {
  console.log('Creating Super Admin account...');

  try {
    // 1. Create User in Appwrite Auth
    const user = await users.create(
      ID.unique(),
      ADMIN_EMAIL,
      ADMIN_PHONE,
      ADMIN_PASSWORD,
      ADMIN_NAME
    );
    console.log(`Successfully created Appwrite Auth user! ID: ${user.$id}`);

    // 2. Create Profile Document in Database with role 'admin'
    const profile = await databases.createDocument(
      DATABASE_ID,
      PROFILES_COLLECTION,
      user.$id, // Use the auth user ID as the document ID for 1-1 mapping
      {
        userId: user.$id,
        fullName: ADMIN_NAME,
        phone: ADMIN_PHONE,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    );
    console.log(`Successfully created Admin profile document! ID: ${profile.$id}`);
    
    console.log('\n--- SUPER ADMIN CREDENTIALS ---');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('-------------------------------');
    console.log('You can now log in to the admin dashboard using these credentials.');

  } catch (error: any) {
    if (error.code === 409) {
      console.error('Error: A user with this email or phone number already exists.');
    } else {
      console.error('Error creating super admin:', error);
    }
  }
}

createSuperAdmin();
