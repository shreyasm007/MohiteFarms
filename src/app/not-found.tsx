import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-8xl font-heading font-bold text-sand mb-4">404</p>
        <h1 className="text-2xl font-heading font-bold text-forest-dark mb-3">
          Page Not Found
        </h1>
        <p className="text-earth-light mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary px-8 py-3">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
