const fs = require('fs');
let content = fs.readFileSync('src/components/shop/ShopPageClient.tsx', 'utf8');

content = content.replace(
  'export default function ShopStorefrontPage() {',
  'export default function ShopStorefrontPage({ shop, products }: any) {'
);

fs.writeFileSync('src/components/shop/ShopPageClient.tsx', content);
