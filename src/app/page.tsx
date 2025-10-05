"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200"
    >
      {/* Header / Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3">
            <Image
              src="/dogdate-logo.png" // ✅ make sure this is in /public
              alt="Dog Date Logo"
              width={40}
              height={40}
              className="object-contain rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-800">Dog Date</h1>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#safety"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Safety
            </a>
          </nav>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-800 hover:text-blue-600 font-medium transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="intro"
        className="flex flex-col items-center justify-center text-white text-center min-h-screen px-6"
      >
        <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
          Introducing Dog Date 🐾
        </h1>
        <p className="font-mono text-lg sm:text-xl max-w-2xl text-white/90">
          Dog owners want safe, easy ways to find compatible playmates nearby.
          Existing social apps are general-purpose and don’t account for
          dog-specific preferences like size, temperament, and vaccination
          status.
        </p>
      </section>
    </main>
  );
}
