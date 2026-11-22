import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Service' };
export default function TermsPage() {
  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Terms of Service</h1>
          <p className="text-cream/70 mt-2">Last updated: October 2026</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-xl border border-sand/50 p-6 md:p-8 space-y-6 text-sm text-earth leading-relaxed">
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Acceptance of Terms</h2>
              <p>By accessing and using the Mohite Farms website and placing orders, you agree to be bound by these Terms of Service.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Products & Pricing</h2>
              <p>All product descriptions and prices are listed on our website. Prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices without prior notice.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Orders</h2>
              <p>Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Order confirmation will be sent after successful payment or COD confirmation.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Payment</h2>
              <p>Payments are processed securely through Razorpay. We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (where available).</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Shipping & Delivery</h2>
              <p>Please refer to our <a href="/policies/shipping" className="text-forest font-semibold hover:underline">Shipping Policy</a> for details on delivery timelines and charges.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Returns & Refunds</h2>
              <p>Please refer to our <a href="/policies/returns" className="text-forest font-semibold hover:underline">Return & Refund Policy</a> for details.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Limitation of Liability</h2>
              <p>Mohite Farms shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Governing Law</h2>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Sangli, Maharashtra.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
