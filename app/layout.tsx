import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthModalProvider } from "@/components/auth/AuthModalContext";
import JsonLd from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://taskbounty.vercel.app'),
  title: {
    default: "TaskBounty | Escrow-protected Marketplace",
    template: "%s | TaskBounty"
  },
  description: "TaskBounty is the safest marketplace for freelance tasks. Secure payments via escrow, verified workers, and instant dispute resolution.",
  keywords: ["freelance", "marketplace", "escrow", "tasks", "bounty", "crypto payments", "secure jobs", "remote work"],
  authors: [{ name: "TaskBounty Team" }],
  creator: "TaskBounty",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "TaskBounty | Escrow-protected Marketplace",
    description: "Secure and transparent task marketplace with escrow protection.",
    siteName: "TaskBounty",
    images: [
      {
        url: "/og-image.jpg", // Needs to be added to public/
        width: 1200,
        height: 630,
        alt: "TaskBounty - Secure Freelance Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskBounty | Escrow-protected Marketplace",
    description: "Secure and transparent task marketplace with escrow protection.",
    images: ["/og-image.jpg"],
    creator: "@taskbounty",
  },
  verification: {
    google: "google-site-verification-code", // Placeholder
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd />
        <Suspense fallback={null}>
          <AuthModalProvider>
            {/* Main Layout Provider */}
            {children}
          </AuthModalProvider>
        </Suspense>
      </body>
    </html>
  );
}
