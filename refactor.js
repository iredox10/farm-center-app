const fs = require('fs');

const files = [
  'src/app/search/page.tsx',
  'src/app/product/[slug]/page.tsx',
  'src/app/shops/page.tsx',
  'src/app/shop/[slug]/page.tsx',
  'src/app/categories/page.tsx',
  'src/app/categories/[slug]/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // 1. Backgrounds
  content = content.replace(/bg-background/g, 'bg-[#fafafa]');
  content = content.replace(/bg-surface-container-lowest/g, 'bg-white');
  content = content.replace(/bg-surface-container-low/g, 'bg-[#fafafa]');
  content = content.replace(/bg-surface-container/g, 'bg-[#f3f4f6]');
  content = content.replace(/bg-surface/g, 'bg-white');
  
  // 2. Borders and Shadows
  content = content.replace(/border-outline-variant\/30/g, 'border-outline-variant/50');
  content = content.replace(/glass-card/g, 'bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)]');
  content = content.replace(/shadow-sm/g, 'shadow-[0_4px_12px_rgba(4,22,39,0.02)]');
  content = content.replace(/shadow-md/g, 'shadow-[0_4px_12px_rgba(4,22,39,0.02)]');
  content = content.replace(/shadow-lg/g, 'shadow-[0_8px_24px_rgba(4,22,39,0.06)]');
  
  // Also add shadow if missing on cards that now use bg-white
  // A bit complex with regex, we can just let hover states or general class lists handle it, but wait, the prompt says "Cards/panels should be bg-white with very subtle borders (...) and shadows shadow-[0_4px_12px_rgba(4,22,39,0.02)]".
  // Let's replace "bg-white border border-outline-variant/50 rounded-2xl" with the shadow appended.
  content = content.replace(/bg-white border border-outline-variant\/50 rounded-2xl(?!\s*shadow)/g, 'bg-white border border-outline-variant/50 shadow-[0_4px_12px_rgba(4,22,39,0.02)] rounded-2xl');

  // 3. Text primary overrides for generic text that isn't a button
  // Let's leave text-primary as is unless it's a specific cart button or UI element, or change text-primary to text-on-surface if appropriate?
  // "Currency formatting must use NGN (Naira)." formatPrice already does this in utils.ts, but we changed minimumFractionDigits to 0 so we'll check utils.ts

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
