const fs = require('fs');
let content = fs.readFileSync('src/components/search/SearchPageClient.tsx', 'utf8');

content = content.replace(
  'function SearchContent() {',
  'function SearchContent({ initialProducts = allMockProducts }: { initialProducts?: any[] }) {'
);

content = content.replace(
  'return allMockProducts',
  'return (initialProducts || allMockProducts)'
);

content = content.replace(
  'export default function SearchPage() {',
  'export default function SearchPage({ initialProducts }: { initialProducts?: any[] }) {'
);

content = content.replace(
  '<SearchContent />',
  '<SearchContent initialProducts={initialProducts} />'
);

fs.writeFileSync('src/components/search/SearchPageClient.tsx', content);
