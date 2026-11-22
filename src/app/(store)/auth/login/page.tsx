'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type AuthMode = 'options' | 'phone' | 'otp';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [mode, setMode] = useState<AuthMode>('options');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if already logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace(redirect);
    });
  }, [router, redirect]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      toast.error('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const fullPhone = cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });

    if (error) {
      toast.error(error.message || 'Failed to send OTP');
      setLoading(false);
      return;
    }

    toast.success('OTP sent to your phone!');
    setMode('otp');
    setCountdown(60);
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const cleanPhone = phone.replace(/\s/g, '');
    const fullPhone = cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      toast.error(error.message || 'Invalid OTP');
      setLoading(false);
      return;
    }

    toast.success('Signed in successfully!');
    router.replace(redirect);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 page-enter">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-forest-dark font-bold text-lg font-heading">M</span>
            </div>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-forest-dark mt-4 mb-1">
            Welcome to Mohite Farms
          </h1>
          <p className="text-earth-light text-sm">
            Sign in to continue to checkout
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sand/50 shadow-sm p-6 md:p-8">
          {/* Sign In Options */}
          {mode === 'options' && (
            <div className="space-y-4 animate-fade-in">
              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-sand rounded-xl hover:border-forest/30 hover:bg-cream/50 transition-all text-sm font-medium disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-sand" />
                <span className="text-xs text-earth-light">or</span>
                <div className="flex-1 h-px bg-sand" />
              </div>

              {/* Phone */}
              <button
                onClick={() => setMode('phone')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-forest text-white rounded-xl hover:bg-forest-dark transition-all text-sm font-medium"
              >
                <Phone className="w-5 h-5" />
                Continue with Mobile Number
              </button>
            </div>
          )}

          {/* Phone Input */}
          {mode === 'phone' && (
            <div className="animate-fade-in">
              <button
                onClick={() => setMode('options')}
                className="text-sm text-earth-light hover:text-forest transition-colors mb-4"
              >
                ← Back
              </button>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-1">
                Enter Mobile Number
              </h2>
              <p className="text-xs text-earth-light mb-5">
                We&apos;ll send a 6-digit OTP to verify your number
              </p>
              <div className="flex gap-2 mb-4">
                <div className="flex items-center px-3 bg-cream border-2 border-sand rounded-lg text-sm font-medium text-earth">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="input-field flex-1"
                  autoFocus
                  maxLength={10}
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading || phone.length < 10}
                className="btn-primary w-full py-3"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* OTP Verification */}
          {mode === 'otp' && (
            <div className="animate-fade-in">
              <button
                onClick={() => { setMode('phone'); setOtp(''); }}
                className="text-sm text-earth-light hover:text-forest transition-colors mb-4"
              >
                ← Change Number
              </button>
              <h2 className="font-heading font-semibold text-forest-dark text-lg mb-1">
                Verify OTP
              </h2>
              <p className="text-xs text-earth-light mb-5">
                Enter the 6-digit code sent to +91 {phone}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="input-field text-center text-lg tracking-[0.5em] font-bold mb-4"
                autoFocus
                maxLength={6}
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="btn-primary w-full py-3 mb-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify & Sign In'
                )}
              </button>
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-earth-light">
                    Resend OTP in <span className="font-semibold text-forest">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleSendOTP}
                    className="text-xs text-forest font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[0.7rem] text-earth-light mt-6">
          By signing in, you agree to our{' '}
          <Link href="/policies/terms" className="underline hover:text-forest">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/policies/privacy" className="underline hover:text-forest">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
