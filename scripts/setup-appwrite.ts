import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';
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

console.log('Connecting to Appwrite:', { endpoint, projectId });

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'farm_center_db';

async function createDatabase() {
  try {
    console.log(`Creating database: ${DATABASE_ID}...`);
    await databases.create(DATABASE_ID, 'Farm Center Database');
    console.log('Database created successfully.');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('Database already exists.');
    } else {
      throw error;
    }
  }
}

async function createCollection(collectionId: string, name: string) {
  try {
    console.log(`Creating collection: ${collectionId}...`);
    await databases.createCollection(DATABASE_ID, collectionId, name);
    console.log(`Collection ${name} created successfully.`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`Collection ${name} already exists.`);
    } else {
      throw error;
    }
  }
}

async function createStringAttribute(collectionId: string, key: string, size: number, required: boolean, array = false) {
  try {
    await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, undefined, array);
    console.log(`Attribute ${key} created on ${collectionId}.`);
  } catch (error: any) {
    if (error.code !== 409) console.error(`Error creating attribute ${key}:`, error.message);
  }
}

async function createIntegerAttribute(collectionId: string, key: string, required: boolean, array = false) {
  try {
    await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, undefined, undefined, undefined, array);
    console.log(`Attribute ${key} created on ${collectionId}.`);
  } catch (error: any) {
    if (error.code !== 409) console.error(`Error creating attribute ${key}:`, error.message);
  }
}

async function createFloatAttribute(collectionId: string, key: string, required: boolean, array = false) {
  try {
    await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, undefined, undefined, undefined, array);
    console.log(`Attribute ${key} created on ${collectionId}.`);
  } catch (error: any) {
    if (error.code !== 409) console.error(`Error creating attribute ${key}:`, error.message);
  }
}

async function createBooleanAttribute(collectionId: string, key: string, required: boolean, array = false) {
  try {
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, undefined, array);
    console.log(`Attribute ${key} created on ${collectionId}.`);
  } catch (error: any) {
    if (error.code !== 409) console.error(`Error creating attribute ${key}:`, error.message);
  }
}

async function createDatetimeAttribute(collectionId: string, key: string, required: boolean, array = false) {
    try {
        await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, undefined, array);
        console.log(`Attribute ${key} created on ${collectionId}.`);
    } catch (error: any) {
        if (error.code !== 409) console.error(`Error creating attribute ${key}:`, error.message);
    }
}

async function createIndex(collectionId: string, key: string, type: any, attributes: string[]) {
    try {
        await databases.createIndex(DATABASE_ID, collectionId, key, type, attributes);
        console.log(`Index ${key} created on ${collectionId}.`);
    } catch(error: any) {
        if (error.code !== 409) console.error(`Error creating index ${key}:`, error.message);
    }
}

async function setup() {
  await createDatabase();

  // 1. Profiles
  await createCollection('profiles', 'Profiles');
  await createStringAttribute('profiles', 'userId', 50, true);
  await createStringAttribute('profiles', 'fullName', 100, true);
  await createStringAttribute('profiles', 'phone', 20, true);
  await createStringAttribute('profiles', 'role', 20, true);
  await createStringAttribute('profiles', 'avatarUrl', 500, false);
  await createDatetimeAttribute('profiles', 'createdAt', true);

  // 2. Shops
  await createCollection('shops', 'Shops');
  await createStringAttribute('shops', 'ownerId', 50, true);
  await createStringAttribute('shops', 'name', 100, true);
  await createStringAttribute('shops', 'slug', 100, true);
  await createStringAttribute('shops', 'description', 5000, false);
  await createStringAttribute('shops', 'logoFileId', 50, false);
  await createStringAttribute('shops', 'bannerFileId', 50, false);
  await createStringAttribute('shops', 'phone', 20, false);
  await createStringAttribute('shops', 'whatsapp', 20, false);
  await createStringAttribute('shops', 'location', 500, false);
  await createStringAttribute('shops', 'primaryColor', 20, false);
  await createStringAttribute('shops', 'secondaryColor', 20, false);
  await createStringAttribute('shops', 'fontChoice', 50, false);
  await createStringAttribute('shops', 'layoutStyle', 50, false);
  await createStringAttribute('shops', 'announcementText', 500, false);
  await createBooleanAttribute('shops', 'allowPayOnDelivery', false);
  await createBooleanAttribute('shops', 'allowWhatsappOrder', false);
  await createBooleanAttribute('shops', 'isVerified', false);
  await createBooleanAttribute('shops', 'isActive', false);
  await createIntegerAttribute('shops', 'productCount', false);
  await createStringAttribute('shops', 'subscriptionTier', 50, false);
  await createDatetimeAttribute('shops', 'createdAt', true);
  await createDatetimeAttribute('shops', 'physicalAuditDate', false);
  await createFloatAttribute('shops', 'ratingAverage', false);
  await createIntegerAttribute('shops', 'reviewCount', false);

  // 3. Products
  await createCollection('products', 'Products');
  await createStringAttribute('products', 'shopId', 50, true);
  await createStringAttribute('products', 'name', 200, true);
  await createStringAttribute('products', 'slug', 200, true);
  await createStringAttribute('products', 'description', 10000, false);
  await createFloatAttribute('products', 'price', true);
  await createFloatAttribute('products', 'discountPrice', false);
  await createStringAttribute('products', 'currency', 10, true);
  await createIntegerAttribute('products', 'stockQuantity', true);
  await createStringAttribute('products', 'condition', 50, true); // new, uk-used, refurbished
  await createStringAttribute('products', 'categoryIds', 50, true, true); // array of strings
  await createBooleanAttribute('products', 'isActive', true);
  await createIntegerAttribute('products', 'viewCount', false);
  await createDatetimeAttribute('products', 'createdAt', true);
  await createDatetimeAttribute('products', 'updatedAt', true);
  await createStringAttribute('products', 'certificationStatus', 50, false);
  await createIntegerAttribute('products', 'batteryHealth', false);
  await createIntegerAttribute('products', 'testingWarrantyDays', false);

  // 4. Product Media
  await createCollection('product_media', 'Product Media');
  await createStringAttribute('product_media', 'productId', 50, true);
  await createStringAttribute('product_media', 'fileId', 50, true);
  await createStringAttribute('product_media', 'type', 20, true); // image, video
  await createIntegerAttribute('product_media', 'sortOrder', true);
  await createBooleanAttribute('product_media', 'isPrimary', true);

  // 5. Categories
  await createCollection('categories', 'Categories');
  await createStringAttribute('categories', 'name', 100, true);
  await createStringAttribute('categories', 'slug', 100, true);
  await createStringAttribute('categories', 'icon', 100, false);
  await createStringAttribute('categories', 'parentId', 50, false);

  // 6. Orders
  await createCollection('orders', 'Orders');
  await createStringAttribute('orders', 'buyerId', 50, true);
  await createStringAttribute('orders', 'shopId', 50, true);
  await createStringAttribute('orders', 'orderNumber', 50, true);
  await createFloatAttribute('orders', 'totalAmount', true);
  await createFloatAttribute('orders', 'commissionAmount', true);
  await createStringAttribute('orders', 'status', 50, true);
  await createStringAttribute('orders', 'paymentMethod', 50, true);
  await createStringAttribute('orders', 'paymentReference', 100, false);
  await createStringAttribute('orders', 'buyerName', 100, true);
  await createStringAttribute('orders', 'buyerPhone', 20, true);
  await createStringAttribute('orders', 'buyerEmail', 100, false);
  await createStringAttribute('orders', 'shippingAddress', 500, true);
  await createStringAttribute('orders', 'shippingCity', 100, true);
  await createStringAttribute('orders', 'shippingState', 100, true);
  await createDatetimeAttribute('orders', 'createdAt', true);

  // 7. Order Items
  await createCollection('order_items', 'Order Items');
  await createStringAttribute('order_items', 'orderId', 50, true);
  await createStringAttribute('order_items', 'productId', 50, true);
  await createStringAttribute('order_items', 'productName', 200, true);
  await createIntegerAttribute('order_items', 'quantity', true);
  await createFloatAttribute('order_items', 'unitPrice', true);
  await createFloatAttribute('order_items', 'subtotal', true);

  // Wait for attributes to propagate
  console.log("Waiting 3 seconds for attributes to settle before creating indexes...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Indexes
  await createIndex('products', 'idx_shopId', 'key', ['shopId']);
  await createIndex('products', 'idx_search', 'fulltext', ['name', 'description']);
  await createIndex('shops', 'idx_slug', 'key', ['slug']);
  await createIndex('shops', 'idx_ownerId', 'key', ['ownerId']);
  await createIndex('orders', 'idx_buyerId', 'key', ['buyerId']);
  await createIndex('orders', 'idx_shopId', 'key', ['shopId']);
  await createIndex('order_items', 'idx_orderId', 'key', ['orderId']);

  // Create Storage Buckets
  const createBucket = async (bucketId: string, name: string) => {
    try {
      console.log(`Creating bucket: ${bucketId}...`);
      await storage.createBucket(bucketId, name, [
          Permission.read(Role.any()), // Public read access
      ], false, undefined, undefined, ['jpg', 'png', 'jpeg', 'webp', 'mp4']);
      console.log(`Bucket ${name} created successfully.`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`Bucket ${name} already exists.`);
      } else {
        throw error;
      }
    }
  };

  await createBucket('product_media_bucket', 'Product Media');
  await createBucket('shop_assets_bucket', 'Shop Assets');
  await createBucket('avatars_bucket', 'Avatars');

  console.log('Appwrite Setup Complete!');
}

setup().catch(console.error);
