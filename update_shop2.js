const fs = require('fs');
let content = fs.readFileSync('src/components/shop/ShopPageClient.tsx', 'utf8');

// The first replacement we did was:
// export default function ShopPage({ shop = mockShop, featuredPhone = mockProducts[0], regularPhones = mockProducts.slice(1, 4), gamingLaptops = mockProducts.slice(4, 7) }: any) {

content = content.replace(
  'export default function ShopPage({ shop = mockShop, featuredPhone = mockProducts[0], regularPhones = mockProducts.slice(1, 4), gamingLaptops = mockProducts.slice(4, 7) }: any) {',
  'export default function ShopPage({ shop = mockShop, products = mockProducts }: any) {'
);

// We need to restore `const formattedProducts = products;`
// We will replace `const formattedProducts = mockProducts;`
content = content.replace(
  'const formattedProducts = mockProducts;',
  'const formattedProducts = products || mockProducts;'
);

fs.writeFileSync('src/components/shop/ShopPageClient.tsx', content);
