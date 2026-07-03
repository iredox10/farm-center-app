const fs = require('fs');
let content = fs.readFileSync('src/components/shop/ShopPageClient.tsx', 'utf8');

// Replace export default function ShopPage() {
content = content.replace(
  'export default function ShopPage() {',
  'export default function ShopPage({ shop = mockShop, featuredPhone = mockProducts[0], regularPhones = mockProducts.slice(1, 4), gamingLaptops = mockProducts.slice(4, 7) }: any) {'
);

// We need to remove local const declarations if they exist in the component.
content = content.replace('const shop = mockShop;', '');
content = content.replace('const latestIphones = mockProducts.filter((p) => p.category === \'Phones\').slice(0, 4);', '');
content = content.replace('const featuredPhone = latestIphones[0];', '');
content = content.replace('const regularPhones = latestIphones.slice(1);', '');
content = content.replace('const gamingLaptops = mockProducts.filter((p) => p.category === \'Laptops\').slice(0, 3);', '');

fs.writeFileSync('src/components/shop/ShopPageClient.tsx', content);
