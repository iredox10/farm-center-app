const fs = require('fs');

const files = [
  'src/app/product/[slug]/page.tsx',
  'src/app/shops/page.tsx',
  'src/app/shop/[slug]/page.tsx',
];

const replacements = [
  [/from-navy-700\/30 to-navy-900\/50/g, 'from-surface-container/50 to-surface-container-lowest'],
  [/from-navy-950\/80 to-transparent/g, 'from-background/80 to-transparent'],
  [/from-navy-950 via-navy-950\/50 to-transparent/g, 'from-background via-background/50 to-transparent'],
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  fs.writeFileSync(file, content, 'utf8');
});
