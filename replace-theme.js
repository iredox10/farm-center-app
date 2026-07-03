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
  // Backgrounds
  [/bg-navy-950/g, 'bg-background'],
  [/bg-navy-900\/50/g, 'bg-surface-container'],
  [/bg-navy-900/g, 'bg-surface-container-lowest'],
  [/bg-navy-800\/60/g, 'bg-surface-container'],
  [/bg-navy-800\/50/g, 'bg-surface-container'],
  [/bg-navy-800/g, 'bg-surface-container'],
  [/bg-white\/5/g, 'bg-surface-container'],
  
  // Borders
  [/border-white\/10/g, 'border-outline-variant/30'],
  [/border-white\/20/g, 'border-outline-variant'],
  [/border-white\/40/g, 'border-outline'],
  
  // Text colors
  [/text-text-primary/g, 'text-on-surface'],
  [/text-text-secondary/g, 'text-on-surface-variant'],
  [/text-text-muted/g, 'text-outline'],
  
  // Accents (green)
  [/text-green-400/g, 'text-primary'],
  [/text-green-300/g, 'text-primary/80'],
  [/bg-green-400/g, 'bg-primary'],
  [/bg-green-500\/20/g, 'bg-primary/20'],
  [/text-green-500/g, 'text-primary'],
  [/border-green-400/g, 'border-primary'],
  [/border-green-500\/30/g, 'border-primary/30'],
  [/focus:border-green-400/g, 'focus:border-primary'],
  [/focus:ring-green-400/g, 'focus:ring-primary'],
  [/group-hover:text-green-400/g, 'group-hover:text-primary'],
  [/group-hover:border-green-400/g, 'group-hover:border-primary'],
  [/hover:text-green-400/g, 'hover:text-primary'],
  [/hover:text-green-300/g, 'hover:text-primary/80'],
  [/hover:bg-green-400/g, 'hover:bg-primary'],
  [/hover:bg-green-500/g, 'hover:bg-primary/90'],
  [/text-navy-950/g, 'text-on-primary'], // usually on top of primary bg
  [/text-navy-700\/40/g, 'text-outline-variant'],

  // Shadows
  [/shadow-green-400\/20/g, 'shadow-[0_8px_24px_rgba(4,22,39,0.06)]'],
  [/shadow-green-400\/10/g, 'shadow-[0_8px_24px_rgba(4,22,39,0.06)]'],
  [/shadow-lg/g, 'shadow-sm'],

  // Glass card
  [/glass-card/g, 'bg-surface-container-lowest border border-outline-variant/30'],

  // Buttons and structural fonts: we'll try to catch CTA buttons, but for now apply font classes
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  
  // Specific tweaks
  // e.g. add font-body if not present? We don't want to mess up.
  // The rules said "Primary Buttons: bg-primary text-on-primary hover:opacity-90"
  // "CTA/Secondary Buttons: bg-secondary-container text-on-secondary-container font-label font-bold hover:bg-secondary hover:text-on-secondary"
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
