const fs = require('fs');

const file = 'src/app/shop/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Grid View replacement
const gridRegex = /<div className="p-3 sm:p-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/Link>/g;
content = content.replace(gridRegex, `<div className="p-3 flex flex-col flex-1">
                        <h3 className="font-heading font-semibold text-on-surface text-sm line-clamp-2 group-hover:text-[#0f172a] transition-colors mb-3">{product.name}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-on-surface">{formatPrice(price)}</span>
                            {hasDiscount && <span className="text-outline text-xs line-through hidden sm:inline">{formatPrice(product.price)}</span>}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug });
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>`);

// List View replacement
const listRegex = /<div className="flex-1 min-w-0 flex flex-col justify-between">[\s\S]*?<\/Link>/g;
content = content.replace(listRegex, `<div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className={\`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold font-label border mb-1 \${badge.cls}\`}>{badge.label}</div>
                          <h3 className="font-heading font-semibold text-on-surface group-hover:text-[#0f172a] transition-colors line-clamp-1">{product.name}</h3>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <span className="font-bold text-on-surface text-lg">{formatPrice(price)}</span>
                            {hasDiscount && <span className="text-outline text-sm line-through">{formatPrice(product.price)}</span>}
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              addItem({ productId: product.id, shopId: product.shopId, name: product.name, price, quantity: 1, imageUrl: '', shopName: product.shopName, slug: product.slug });
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white transition-transform active:scale-95 hover:bg-black flex-shrink-0 ml-2"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>`);

fs.writeFileSync(file, content);
console.log('Updated shop page');
