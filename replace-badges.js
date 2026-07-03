const fs = require('fs');

const files = [
  'src/app/search/page.tsx',
  'src/app/product/[slug]/page.tsx',
  'src/app/shops/page.tsx',
  'src/app/shop/[slug]/page.tsx',
  'src/app/categories/page.tsx',
  'src/app/categories/[slug]/page.tsx'
];

const replacements = [
  [/bg-blue-500\/20/g, 'bg-secondary/20'],
  [/text-blue-400/g, 'text-secondary'],
  [/border-blue-500\/30/g, 'border-secondary/30'],
  [/bg-yellow-500\/20/g, 'bg-tertiary/20'],
  [/text-yellow-400/g, 'text-tertiary'],
  [/border-yellow-500\/30/g, 'border-tertiary/30'],
  [/bg-navy-950\/95/g, 'bg-surface-container-lowest/95'],
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(file, content, 'utf8');
});
