"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Heart, Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  return (
    <header className="w-full bg-blue-200/80 backdrop-blur-sm border-b border-blue-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/dogdate-logo.png"
            alt="Dog Date Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800">Dog Date</h1>
        </Link>

        {/* Navbar / Right Section */}
        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Browse Dogs
            </Link>
            <Link
              href="/playdates"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Play Dates
            </Link>
            <Link
              href="/likes"
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Likes
            </Link>
          </nav>

          {/* Conditional Auth UI */}
          {loading ? (
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          ) : user ? (
            /* User is logged in - show dropdown menu */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700 font-medium">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <Link
                    href="/profile/owner"
                    className="block px-4 py-2 hover:bg-gray-50 text-gray-700 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Owner Profile
                  </Link>
                  <Link
                    href="/profile/dog"
                    className="block px-4 py-2 hover:bg-gray-50 text-gray-700 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dog Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-50 text-gray-700 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* User is not logged in - show auth buttons */
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-700 text-white rounded-md hover:from-orange-700 hover:via-yellow-600 hover:to-orange-800 shadow-md transition font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
