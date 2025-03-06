import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Header from "@/components/header/Header";
import BottomHeader from "@/components/header/BottomHeader";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import RazorpayLoader from "@/components/RazorpayLoader"; // Razorpay client-side script

export const metadata: Metadata = {
  title: "Amazon Clone - Best Online Shopping Experience",
  description:
    "Shop the best deals on electronics, fashion, home appliances, and more. Fast delivery and secure checkout.",
  keywords: [
    "Amazon Clone",
    "Online Shopping",
    "Best Deals",
    "Electronics",
    "Fashion",
    "Fast Delivery",
    "Secure Checkout",
  ],
  openGraph: {
    title: "Amazon Clone - Best Online Shopping Experience",
    description:
      "Shop the best deals on electronics, fashion, home appliances, and more. Fast delivery and secure checkout.",
    url: "https://your-amazon-clone.com",
    siteName: "Amazon Clone",
    images: [
      {
        url: "https://your-amazon-clone.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amazon Clone Homepage",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourTwitterHandle",
    title: "Amazon Clone - Best Online Shopping Experience",
    description:
      "Shop the best deals on electronics, fashion, home appliances, and more. Fast delivery and secure checkout.",
    images: ["https://your-amazon-clone.com/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://your-amazon-clone.com" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <CartProvider>
          <Header />
          <BottomHeader />
          <RazorpayLoader /> {/* Ensures Razorpay script is loaded */}
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
