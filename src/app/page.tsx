"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Heart, Calendar } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-300 to-blue-900 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <Image
              src="/dogdate-logo.png"
              alt="Dog Date Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800">Dog Date</h1>
          </div>

          {/* Navbar / Right Section */}
          <div className="flex items-center gap-4">
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md">
                  <Link
                    href="/owner-profile"
                    className="block px-4 py-2 hover:bg-gradient-to-br from-red-700 via-orange-400 to-yellow-400 text-gray-700"
                  >
                    Owner Profile
                  </Link>
                  <Link
                    href="/dog-profile"
                    className="block px-4 py-2 hover:bg-gradient-to-br from-red-700 via-orange-400 to-yellow-400 text-gray-700"
                  >
                    Dog Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-orange-700 via-yellow-500 to-orange-600 text-gray-300 rounded-md hover:bg-blue-700 shadow-md transition font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex flex-col items-center justify-center flex-grow text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
          Find Play Dates for Your Dog
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-indigo-900 mb-10">
          Connect with local dog owners and discover the perfect playmates for your furry friend. Safe, easy, and tail-waggingly fun!
        </p>

        {/* ✅ New Section Below the Paragraph */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/get-started"
            className="px-8 py-4 text-lg rounded-full bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
          >
            Start Matching <Heart className="inline w-5 h-5 ml-2" />
          </Link>
          <Link
            href="/browse"
            className="px-8 py-4 text-lg rounded-full border border-white text-white font-semibold hover:bg-white hover:text-blue-700 transition"
          >
            <Calendar className="inline w-5 h-5 mr-2" /> Browse Dogs
          </Link>
        </div>
      </section>
    </main>
  );
}
