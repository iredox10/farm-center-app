const fs = require('fs');
let content = fs.readFileSync('src/components/home/HomePageClient.tsx', 'utf8');

// Replace `export default function HomePage() {` with `export default function HomePage({ products = mockProducts, shops = mockShops }: { products?: any[], shops?: any[] }) {`
content = content.replace(
  'export default function HomePage() {',
  'export default function HomePage({ products = mockProducts, shops = mockShops }: { products?: any[], shops?: any[] }) {'
);

// Replace `{mockProducts.map(` with `{products.map(`
content = content.replace(/\{mockProducts\.map\(/g, '{products.map(');

// Replace `{mockShops.map(` with `{shops.map(`
content = content.replace(/\{mockShops\.map\(/g, '{shops.map(');

fs.writeFileSync('src/components/home/HomePageClient.tsx', content);
