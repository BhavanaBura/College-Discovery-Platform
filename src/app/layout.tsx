// src/app/layout.tsx
// Root layout — wraps every page with providers and nav

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CollegeDiscover — Find Your Perfect College",
  description: "Discover, compare, and save top colleges across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 min-h-screen`}>
        {/* Providers wraps the app with NextAuth SessionProvider */}
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
