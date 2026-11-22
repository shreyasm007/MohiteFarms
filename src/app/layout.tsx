import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "Mohite Farms | Farm-Fresh Khapli Wheat & Shalu Grains from Maharashtra",
    template: "%s | Mohite Farms",
  },
  description:
    "Naturally grown Khapli wheat and Shalu jowar, straight from our farm in Tondoli, Kadegaon, Maharashtra. Pure grains and freshly milled flour, delivered to your doorstep.",
  keywords: [
    "Khapli wheat", "emmer wheat", "Shalu jowar", "sorghum", "organic grains",
    "Maharashtra", "farm fresh", "Kadegaon", "natural farming", "whole wheat atta",
    "jowar flour", "gluten free", "Mohite Farms",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Mohite Farms",
    title: "Mohite Farms | Farm-Fresh Khapli Wheat & Shalu Grains",
    description: "Naturally grown Khapli wheat and Shalu jowar from Tondoli, Kadegaon, Maharashtra.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a3a2a',
                color: '#fff',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              },
            }}
          />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
