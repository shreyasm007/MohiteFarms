import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy',
  description: 'Mohite Farms return and refund policy for damaged or incorrect products.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="page-enter">
      <section className="bg-forest-dark py-12 md:py-16 relative grain-overlay">
        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Return & Refund Policy</h1>
          <p className="text-cream/70 mt-2">Last updated: October 2026</p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-xl border border-sand/50 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Our Commitment</h2>
              <p className="text-sm text-earth leading-relaxed">
                We take great care in packing and shipping our products. If you receive a damaged 
                or incorrect product, we are committed to making it right.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Damaged or Incorrect Products</h2>
              <ul className="text-sm text-earth space-y-2 list-disc pl-5">
                <li>Contact us within <strong>48 hours</strong> of delivery with clear photos of the issue.</li>
                <li>We will arrange a <strong>replacement or full refund</strong> at no additional cost.</li>
                <li>Please do not dispose of the product until we confirm the resolution.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Non-Returnable Items</h2>
              <p className="text-sm text-earth leading-relaxed">
                Due to the nature of food products, we cannot accept returns for change of mind or 
                personal preference after the product has been delivered and opened. We encourage 
                you to review product descriptions and pack sizes before ordering.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Refund Process</h2>
              <ul className="text-sm text-earth space-y-2 list-disc pl-5">
                <li>Refunds for online payments will be processed to the original payment method.</li>
                <li>Refunds typically take <strong>5–7 business days</strong> to reflect in your account.</li>
                <li>For COD orders, refunds will be processed via bank transfer.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">Order Cancellation</h2>
              <p className="text-sm text-earth leading-relaxed">
                You may cancel your order before it has been shipped by contacting us. Once shipped, 
                cancellation is not possible and the regular return policy applies.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-3">How to Reach Us</h2>
              <p className="text-sm text-earth">
                For returns or refunds, contact us via{' '}
                <a href="https://wa.me/919XXXXXXXXX" className="text-forest font-semibold hover:underline">WhatsApp</a>
                {' '}or email{' '}
                <a href="mailto:contact@mohitefarms.com" className="text-forest font-semibold hover:underline">contact@mohitefarms.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
