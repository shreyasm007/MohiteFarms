'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Minus, Plus, ChevronLeft, Check, Truck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/types';
import toast from 'react-hot-toast';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const activeVariants = product.variants?.filter((v) => v.is_active) || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    activeVariants.find((v) => v.stock > 0) || activeVariants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const images = product.images?.length
    ? product.images
    : ['/images/placeholder-product.jpg'];

  const discount = selectedVariant?.compare_at_price
    ? getDiscountPercent(selectedVariant.price, selectedVariant.compare_at_price)
    : 0;

  const inStock = selectedVariant?.stock > 0;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;
    addItem(product, selectedVariant, quantity);
    toast.success(`${product.name} (${selectedVariant.pack_size}) added to cart`);
    setQuantity(1);
  };

  return (
    <div className="container-custom py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-earth-light mb-6">
        <Link href="/products" className="hover:text-forest transition-colors inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Products
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <span>{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-forest-dark font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-dark mb-3">
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge badge-discount">
                {discount}% OFF
              </span>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    i === activeImage ? 'border-forest' : 'border-sand hover:border-forest/30'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="text-gold-dark text-xs font-semibold tracking-widest uppercase mb-2">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-forest-dark mb-4">
            {product.name}
          </h1>

          {/* Price */}
          {selectedVariant && (
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-forest">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compare_at_price && (
                <span className="text-lg text-earth-light line-through">
                  {formatPrice(selectedVariant.compare_at_price)}
                </span>
              )}
              {discount > 0 && (
                <span className="badge badge-discount">Save {discount}%</span>
              )}
            </div>
          )}

          {/* Pack Size Selector */}
          <div className="mb-6">
            <p className="input-label">Pack Size</p>
            <div className="flex flex-wrap gap-2">
              {activeVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                  disabled={variant.stock <= 0}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                    selectedVariant?.id === variant.id
                      ? 'border-forest bg-forest text-white'
                      : variant.stock > 0
                      ? 'border-sand bg-white text-earth hover:border-forest/40'
                      : 'border-sand/50 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                  }`}
                >
                  {variant.pack_size}
                  {variant.stock <= 0 && ' (Out)'}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          {selectedVariant && (
            <div className="mb-6">
              {inStock ? (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">
                    In Stock
                    {selectedVariant.stock <= 10 && (
                      <span className="text-orange-600 ml-1">
                        (Only {selectedVariant.stock} left)
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <p className="text-red-600 text-sm font-medium">Currently out of stock</p>
              )}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          {inStock && (
            <div className="flex items-center gap-3 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center border-2 border-sand rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 h-10 flex items-center justify-center font-semibold text-sm border-x-2 border-sand">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 py-3 text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          )}

          {/* Shipping Info */}
          <div className="bg-cream rounded-xl p-4 mb-6 border border-sand/50">
            <div className="flex items-center gap-2 text-sm font-medium text-forest-dark mb-1">
              <Truck className="w-4 h-4 text-gold-dark" />
              Shipping Information
            </div>
            <p className="text-xs text-earth-light">
              Free shipping on orders above ₹999. Standard delivery across India.
              Shipped fresh from our farm in Tondoli, Maharashtra.
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">
                About This Product
              </h2>
              <div className="text-sm text-earth leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
