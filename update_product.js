const fs = require('fs');
let content = fs.readFileSync('src/components/product/ProductPageClient.tsx', 'utf8');

// Replace `export default function ProductDetailPage() {` with `export default function ProductDetailPage({ product = mockProduct, shop = mockShop, relatedProducts = mockRelated, reviewsData = initialReviews }: any) {`
content = content.replace(
  'export default function ProductDetailPage() {',
  'export default function ProductDetailPage({ product = mockProduct, shop = mockShop, relatedProducts = mockRelated, reviewsData = initialReviews }: any) {'
);

// We need to change `const product = mockProduct;` to empty or remove it. But we just set it in props.
content = content.replace('const product = mockProduct;', '');
content = content.replace('const shop = mockShop;', '');

// Replace `const [reviews, setReviews] = useState<Review[]>(initialReviews);`
content = content.replace(
  'const [reviews, setReviews] = useState<Review[]>(initialReviews);',
  'const [reviews, setReviews] = useState<Review[]>(reviewsData || initialReviews);'
);

content = content.replace(/mockRelated/g, 'relatedProducts');

fs.writeFileSync('src/components/product/ProductPageClient.tsx', content);
