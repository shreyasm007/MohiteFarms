'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product, Category } from '@/lib/types';

interface ProductsFilterProps {
  categories: Category[];
  products: Product[];
}

export function ProductsFilter({ categories, products }: ProductsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-forest text-white shadow-md'
                : 'bg-white text-earth border border-sand hover:border-forest/30'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-forest text-white shadow-md'
                  : 'bg-white text-earth border border-sand hover:border-forest/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-earth-light text-lg">No products found.</p>
        </div>
      )}
    </>
  );
}
