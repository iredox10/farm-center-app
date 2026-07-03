import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const DATABASE_ID = 'farm_center_db';

async function updatePermissions() {
  console.log('Updating Collection Permissions...');
  try {
    // Make Profiles readable by any authenticated user
    await databases.updateCollection(
      DATABASE_ID,
      'profiles',
      'Profiles',
      [
        Permission.read(Role.any()), // Allow anyone to read profiles (needed for shop owner info, etc.)
        Permission.create(Role.users()), // Allow users to create profiles
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log('Updated profiles permissions');

    // Shops
    await databases.updateCollection(
      DATABASE_ID,
      'shops',
      'Shops',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log('Updated shops permissions');

    // Products
    await databases.updateCollection(
      DATABASE_ID,
      'products',
      'Products',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log('Updated products permissions');

    console.log('Permissions updated successfully!');
  } catch (error) {
    console.error('Error updating permissions:', error);
  }
}

updatePermissions();
