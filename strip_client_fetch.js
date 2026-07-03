const fs = require('fs');
let content = fs.readFileSync('src/components/shop/ShopPageClient.tsx', 'utf8');

// We will change the component signature and remove the `useState` and `useEffect` for data fetching.
content = content.replace(
  'export default function ShopStorefrontPage({ shop, products }: any) {',
  'export default function ShopStorefrontPage({ shop, products }: any) {'
);

// Remove the conflicting states
content = content.replace('const [shop, setShop] = useState<any>(null);', '');
content = content.replace('const [products, setProducts] = useState<any[]>([]);', '');
content = content.replace('const [loading, setLoading] = useState(true);', 'const loading = false;');

// Remove the useEffect
content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[slug\]\);/m, '');

fs.writeFileSync('src/components/shop/ShopPageClient.tsx', content);
