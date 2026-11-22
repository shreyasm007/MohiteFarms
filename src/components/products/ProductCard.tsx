'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/lib/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const lowestVariant = product.variants?.reduce((min, v) =>
    v.is_active && v.stock > 0 && v.price < min.price ? v : min,
    product.variants.filter(v => v.is_active && v.stock > 0)[0]
  );

  const hasStock = product.variants?.some(v => v.is_active && v.stock > 0);
  const discount = lowestVariant?.compare_at_price
    ? getDiscountPercent(lowestVariant.price, lowestVariant.compare_at_price)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (lowestVariant && hasStock) {
      addItem(product, lowestVariant);
      toast.success(`${product.name} added to cart`);
    }
  };

  const imageUrl = product.images?.[0] || '/images/placeholder-product.jpg';

  return (
    <Link href={`/products/${product.slug}`} className="block product-card group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge badge-discount text-[0.65rem]">
              {discount}% OFF
            </span>
          )}
          {!hasStock && (
            <span className="badge badge-out text-[0.65rem]">
              Out of Stock
            </span>
          )}
        </div>
        {/* Quick Add */}
        {hasStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 hover:bg-forest hover:text-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <p className="text-[0.7rem] text-earth-light font-medium uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-heading font-semibold text-forest-dark text-base mb-2 leading-snug">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-xs text-earth-light line-clamp-2 mb-3">
            {product.short_description}
          </p>
        )}
        {/* Price */}
        {lowestVariant && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-forest">
              {formatPrice(lowestVariant.price)}
            </span>
            {lowestVariant.compare_at_price && (
              <span className="text-sm text-earth-light line-through">
                {formatPrice(lowestVariant.compare_at_price)}
              </span>
            )}
            {lowestVariant.pack_size && (
              <span className="text-xs text-earth-light">/ {lowestVariant.pack_size}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
