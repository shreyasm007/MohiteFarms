'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="skeleton w-full h-64 max-w-2xl mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center page-enter">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-earth-light" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-forest-dark mb-3">
            Your Cart is Empty
          </h1>
          <p className="text-earth-light mb-8">
            Looks like you haven&apos;t added any products yet. Browse our farm-fresh collection.
          </p>
          <Link href="/products" className="btn-primary px-8 py-3 text-base">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-8 md:py-10">
        <div className="container-custom">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
            Shopping Cart
          </h1>
          <p className="text-cream/60 text-sm mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.variant.id}
                  className="bg-white rounded-xl border border-sand/50 p-4 flex gap-4 animate-fade-in"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                    <Image
                      src={item.product.images?.[0] || '/images/placeholder-product.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-heading font-semibold text-forest-dark text-sm md:text-base hover:text-forest transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-earth-light mt-0.5">
                          {item.variant.pack_size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant.id)}
                        className="text-earth-light hover:text-red-500 transition-colors p-1 shrink-0"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-sand rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-sand">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-forest text-sm md:text-base">
                          {formatPrice(item.variant.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[0.65rem] text-earth-light">
                            {formatPrice(item.variant.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-forest hover:text-forest-light transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-sand/50 p-6 sticky top-24">
                <h2 className="font-heading font-semibold text-forest-dark text-lg mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-earth-light">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-light">Shipping</span>
                    <span className="text-xs text-earth-light">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-sand pt-3 flex justify-between text-base">
                    <span className="font-semibold text-forest-dark">Estimated Total</span>
                    <span className="font-bold text-forest">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {subtotal < 999 && (
                  <div className="mt-4 bg-gold/10 border border-gold/30 rounded-lg p-3">
                    <p className="text-xs text-earth">
                      Add <strong>{formatPrice(999 - subtotal)}</strong> more for free shipping!
                    </p>
                    <div className="w-full bg-sand rounded-full h-1.5 mt-2">
                      <div
                        className="bg-gold rounded-full h-1.5 transition-all"
                        style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="btn-primary w-full mt-6 py-3.5 text-base"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[0.65rem] text-earth-light text-center mt-3">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
