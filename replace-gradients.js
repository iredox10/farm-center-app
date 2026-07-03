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
  [/bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-on-primary hover:shadow-sm hover:shadow-green-500\/25 active:scale-95/g, 'bg-primary text-on-primary hover:opacity-90 font-label font-bold active:scale-95 transition-all'],
  [/bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-on-primary transition-all active:scale-95/g, 'bg-primary text-on-primary hover:opacity-90 font-label font-bold transition-all active:scale-95'],
  [/bg-gradient-to-r from-green-500 to-green-600 text-on-primary active:scale-95 transition-all/g, 'bg-primary text-on-primary hover:opacity-90 font-label font-bold active:scale-95 transition-all'],
  [/from-green-500\/20 via-navy-800 to-gold-500\/20/g, 'from-primary/10 via-surface-container-lowest to-secondary/10'],
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(file, content, 'utf8');
});
