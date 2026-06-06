// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CD</span>
            </div>
            <span className="font-bold text-xl text-gray-900">CollegeDiscover</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/colleges" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Browse Colleges
            </Link>
            <Link href="/compare" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Compare
            </Link>
            {session && (
              <Link href="/saved" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Saved
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hi, {session.user?.name?.split(" ")[0]}!
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-secondary text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-gray-700 mb-1" />
            <div className="w-6 h-0.5 bg-gray-700 mb-1" />
            <div className="w-6 h-0.5 bg-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          <Link href="/colleges" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Browse Colleges
          </Link>
          <Link href="/compare" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
            Compare
          </Link>
          {session ? (
            <>
              <Link href="/saved" className="block py-2 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Saved Colleges
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                className="block w-full text-left py-2 text-red-600 font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/auth/signin" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
