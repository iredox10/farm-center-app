const fs = require('fs');

const file = 'src/app/product/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Main Add to Cart button
content = content.replace(
  /'bg-primary text-on-primary hover:opacity-90 font-label font-bold active:scale-95 transition-all'/g,
  "'bg-[#0f172a] text-white hover:bg-black font-label font-bold active:scale-95 transition-all rounded-full'"
);

// Main price text color
content = content.replace(
  /font-heading text-3xl sm:text-4xl font-bold text-primary/g,
  'font-heading text-3xl sm:text-4xl font-bold text-on-surface'
);

// Related products card replacement
const relatedCardRegex = /<div className="p-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/Link>/g;
content = content.replace(relatedCardRegex, (match) => {
  return `<div className="p-3 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-on-surface text-sm line-clamp-2 group-hover:text-[#0f172a] transition-colors mb-3">
                      {p.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-on-surface">
                          {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                        </span>
                        {p.discountPrice > 0 && p.discountPrice < p.price && (
                          <span className="text-outline text-xs line-through hidden sm:inline">{formatPrice(p.price)}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          useCartStore.getState().addItem({ productId: p.id, name: p.name, price: p.discountPrice > 0 ? p.discountPrice : p.price, imageUrl: '', shopId: p.shopId, shopName: shop.name, slug: p.slug, quantity: 1 });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>`;
});

fs.writeFileSync(file, content);
console.log('Updated product page');
