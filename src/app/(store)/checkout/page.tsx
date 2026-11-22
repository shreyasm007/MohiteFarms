'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, CreditCard, Truck, ChevronLeft, Loader2,
  ShieldCheck, ArrowRight, Banknote
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, calculateShipping, INDIAN_STATES } from '@/lib/utils';
import type { DeliveryAddress, ShippingConfig, RazorpayPaymentResponse } from '@/lib/types';
import toast from 'react-hot-toast';

type Step = 'address' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotalWeightGrams, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [userInfo, setUserInfo] = useState<{ email?: string; phone?: string }>({});

  const [address, setAddress] = useState<DeliveryAddress>({
    name: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  useEffect(() => {
    setMounted(true);
    // Fetch shipping config
    const supabase = createClient();
    supabase
      .from('shipping_config')
      .select('*')
      .eq('is_active', true)
      .single()
      .then(({ data }) => {
        if (data) setShippingConfig(data);
      });

    // Get user info
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserInfo({
          email: user.email || '',
          phone: user.phone || '',
        });
        setAddress(prev => ({
          ...prev,
          email: user.email || '',
          phone: user.phone?.replace('+91', '') || '',
        }));
      }
    });
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const weightGrams = mounted ? getTotalWeightGrams() : 0;

  const shippingCharge = shippingConfig
    ? calculateShipping(subtotal, weightGrams, shippingConfig)
    : 60;

  const codCharge = paymentMethod === 'cod' && shippingConfig
    ? shippingConfig.cod_extra_charge
    : 0;

  const total = subtotal + shippingCharge + codCharge;

  const validateAddress = (): boolean => {
    if (!address.name.trim()) { toast.error('Please enter your name'); return false; }
    if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number'); return false;
    }
    if (!address.address_line1.trim()) { toast.error('Please enter your address'); return false; }
    if (!address.city.trim()) { toast.error('Please enter your city'); return false; }
    if (!address.state) { toast.error('Please select your state'); return false; }
    if (!/^\d{6}$/.test(address.pincode)) { toast.error('Please enter a valid 6-digit pincode'); return false; }
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateAddress()) {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loadRazorpay = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      // Create order on backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            variant_id: i.variant.id,
            quantity: i.quantity,
          })),
          address,
          payment_method: 'online',
        }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || 'Failed to create order');
        setLoading(false);
        return;
      }

      // Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.data.key_id,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'Mohite Farms',
        description: 'Farm-fresh grains & flour',
        order_id: data.data.order_id,
        handler: async (response: RazorpayPaymentResponse) => {
          // Verify payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              db_order_id: data.data.db_order_id,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.push(`/order-confirmation/${verifyData.data.order_number}`);
          } else {
            toast.error('Payment verification failed. Contact support if amount was deducted.');
          }
        },
        prefill: {
          name: address.name,
          email: address.email || userInfo.email,
          contact: `+91${address.phone}`,
        },
        theme: {
          color: '#1a3a2a',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment was cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            variant_id: i.variant.id,
            quantity: i.quantity,
          })),
          address,
          payment_method: 'cod',
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/order-confirmation/${data.data.order_number}`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (!mounted) {
    return (
      <div className="container-custom py-16">
        <div className="skeleton w-full h-96 max-w-3xl mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-heading font-bold text-forest-dark mb-3">
          Nothing to checkout
        </h1>
        <p className="text-earth-light mb-6">Your cart is empty.</p>
        <Link href="/products" className="btn-primary px-8">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-6 md:py-8">
        <div className="container-custom">
          <Link href="/cart" className="text-cream/60 hover:text-gold-light text-sm inline-flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Checkout</h1>
          {/* Steps */}
          <div className="flex items-center gap-3 mt-4">
            <div className={`flex items-center gap-1.5 text-sm ${step === 'address' ? 'text-gold font-semibold' : 'text-cream/60'}`}>
              <MapPin className="w-4 h-4" />
              <span>Address</span>
            </div>
            <div className="w-8 h-px bg-cream/30" />
            <div className={`flex items-center gap-1.5 text-sm ${step === 'payment' ? 'text-gold font-semibold' : 'text-cream/60'}`}>
              <CreditCard className="w-4 h-4" />
              <span>Payment</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* ADDRESS STEP */}
              {step === 'address' && (
                <div className="bg-white rounded-xl border border-sand/50 p-5 md:p-6 animate-fade-in">
                  <h2 className="font-heading font-semibold text-forest-dark text-lg mb-5 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold-dark" />
                    Delivery Address
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="input-label">Mobile Number *</label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-cream border-2 border-sand rounded-lg text-sm text-earth">+91</span>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                          className="input-field flex-1"
                          placeholder="10-digit number"
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Email (optional)</label>
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        className="input-field"
                        placeholder="For order updates"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Address Line 1 *</label>
                      <input
                        type="text"
                        value={address.address_line1}
                        onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                        className="input-field"
                        placeholder="House no., Building, Street"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Address Line 2</label>
                      <input
                        type="text"
                        value={address.address_line2}
                        onChange={(e) => setAddress({ ...address, address_line2: e.target.value })}
                        className="input-field"
                        placeholder="Area, Landmark (optional)"
                      />
                    </div>
                    <div>
                      <label className="input-label">City *</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="input-field"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="input-label">State *</label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">PIN Code *</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                        className="input-field"
                        placeholder="6-digit PIN"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="btn-primary w-full mt-6 py-3.5 text-base"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* PAYMENT STEP */}
              {step === 'payment' && (
                <div className="animate-fade-in space-y-5">
                  {/* Address Summary */}
                  <div className="bg-white rounded-xl border border-sand/50 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold text-forest-dark text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold-dark" />
                        Delivering to
                      </h3>
                      <button
                        onClick={() => setStep('address')}
                        className="text-xs text-forest font-semibold hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-sm text-earth">
                      <strong>{address.name}</strong> • +91 {address.phone}
                    </p>
                    <p className="text-xs text-earth-light mt-1">
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                      , {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-xl border border-sand/50 p-5">
                    <h3 className="font-heading font-semibold text-forest-dark text-lg mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gold-dark" />
                      Payment Method
                    </h3>

                    <div className="space-y-3">
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'online'
                            ? 'border-forest bg-forest/5'
                            : 'border-sand hover:border-forest/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="w-4 h-4 text-forest"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-forest-dark flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-forest" />
                            Pay Online
                          </p>
                          <p className="text-xs text-earth-light mt-0.5">
                            UPI, Credit/Debit Card, Net Banking, Wallets
                          </p>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                      </label>

                      {shippingConfig?.is_cod_available && (
                        <label
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === 'cod'
                              ? 'border-forest bg-forest/5'
                              : 'border-sand hover:border-forest/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="w-4 h-4 text-forest"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-forest-dark flex items-center gap-2">
                              <Banknote className="w-4 h-4 text-forest" />
                              Cash on Delivery
                            </p>
                            <p className="text-xs text-earth-light mt-0.5">
                              Extra ₹{shippingConfig.cod_extra_charge} COD charge applies
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    <button
                      onClick={paymentMethod === 'online' ? handleOnlinePayment : handleCODOrder}
                      disabled={loading}
                      className="btn-primary w-full mt-6 py-3.5 text-base"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : paymentMethod === 'online' ? (
                        <>Pay {formatPrice(total)}</>
                      ) : (
                        <>Place Order • {formatPrice(total)}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-sand/50 p-5 sticky top-24">
                <h2 className="font-heading font-semibold text-forest-dark text-lg mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                  {items.map((item) => (
                    <div key={item.variant.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-dark shrink-0">
                        <Image
                          src={item.product.images?.[0] || '/images/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-forest-dark truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[0.65rem] text-earth-light">
                          {item.variant.pack_size} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-forest shrink-0">
                        {formatPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sand pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-earth-light">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-light flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Shipping
                    </span>
                    <span className="font-medium">
                      {shippingCharge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shippingCharge)
                      )}
                    </span>
                  </div>
                  {codCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-earth-light">COD Charge</span>
                      <span className="font-medium">{formatPrice(codCharge)}</span>
                    </div>
                  )}
                  <div className="border-t border-sand pt-2 flex justify-between text-base">
                    <span className="font-semibold text-forest-dark">Total</span>
                    <span className="font-bold text-forest">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
