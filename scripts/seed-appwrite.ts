import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error('Missing Appwrite configuration');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const DATABASE_ID = 'farm_center_db';

const shops = [
  {
    ownerId: ID.unique(),
    name: "TechHub Electronics",
    slug: "techhub-electronics",
    whatsapp: "+2348091234567",
    phone: "+2348091234567",
    isVerified: true,
    physicalAuditDate: new Date('2023-10-15').toISOString(),
    ratingAverage: 4.9,
    reviewCount: 1245,
    createdAt: new Date('2018-04-12').toISOString(),
    location: "Shop 42, Block B, FarmCenter GSM Market, Kano State, Nigeria.",
    description: "Premium Gadget Retailer in Kano.",
    isActive: true,
    allowPayOnDelivery: true,
    allowWhatsappOrder: true
  }
];

const products = [
  {
    shopId: '', // Will be updated after shop creation
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    categoryIds: ['phones'],
    price: 1450000,
    discountPrice: 1550000,
    currency: 'NGN',
    stockQuantity: 10,
    condition: 'new',
    description: '256GB, Natural Titanium.',
    certificationStatus: 'certified',
    batteryHealth: 100,
    testingWarrantyDays: 30,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    shopId: '',
    name: 'iPhone 14',
    slug: 'iphone-14',
    categoryIds: ['phones'],
    price: 620000,
    currency: 'NGN',
    stockQuantity: 5,
    condition: 'uk-used',
    description: '128GB, Midnight, Refurbished Grade A.',
    certificationStatus: 'certified',
    batteryHealth: 92,
    testingWarrantyDays: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    shopId: '',
    name: 'ROG Zephyrus G14',
    slug: 'rog-zephyrus-g14',
    categoryIds: ['laptops'],
    price: 2100000,
    currency: 'NGN',
    stockQuantity: 3,
    condition: 'new',
    description: 'Ryzen 9, 32GB RAM, 1TB SSD. High-Tech Cooling.',
    certificationStatus: 'none',
    testingWarrantyDays: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seed() {
  console.log('Seeding database...');
  
  try {
    // 1. Create Shop
    console.log('Creating shop...');
    const shopDoc = await databases.createDocument(
      DATABASE_ID,
      'shops',
      ID.unique(),
      shops[0]
    );
    console.log('Created Shop:', shopDoc.$id);

    // 2. Create Products linked to Shop
    console.log('Creating products...');
    for (const prod of products) {
      prod.shopId = shopDoc.$id;
      const prodDoc = await databases.createDocument(
        DATABASE_ID,
        'products',
        ID.unique(),
        prod
      );
      console.log('Created Product:', prodDoc.name);
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
