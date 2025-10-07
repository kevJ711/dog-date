"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ import Next.js Image
import Header from '../../components/ui/Header';

export default function Login() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: formData.identifier, password: formData.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Login failed");
        setSubmitting(false);
        return;
      }
      // HttpOnly cookie set by server
      router.push("/");
    } catch {
      alert("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <><Header/>
    <div
      className="min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 p-4"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 
                       transition-opacity text-sm text-yellow-100"
          >
            ← Back to home
          </Link>

          {/* Logo and title */}
          <div className="flex flex-col items-center justify-center gap-2 mb-2">
            <Image
              src="/dogdate-logo.png" // ✅ path to logo in public folder
              alt="Dog Date Logo"
              width={80}
              height={80}
              className="rounded-full shadow-md"
              priority
            />
            <h1 className="text-3xl font-bold text-yellow-100">Dog Date</h1>
          </div>

          <p className="text-yellow-50">
            Welcome back! Sign in to your account
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white/90 border border-yellow-200 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-yellow-700 mb-1">
            Log In
          </h2>
          <p className="text-sm text-gray-700 mb-6">
            Enter your account details below
          </p>

          {/* Login form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email/Username */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-yellow-700"
              >
                Email or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="john@example.com or username"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-yellow-300 
                           rounded-lg focus:ring-2 focus:ring-yellow-400 
                           focus:border-yellow-400 outline-none transition 
                           text-gray-800"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-yellow-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-yellow-300 
                           rounded-lg focus:ring-2 focus:ring-yellow-400 
                           focus:border-yellow-400 outline-none transition 
                           text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-800 px-4 py-2 font-semibold 
             text-orange-400 shadow-md transition-all duration-300 
             hover:bg-blue-800 hover:shadow-lg hover:scale-105"
            >
              {submitting ? "Signing In..." : "Log In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-700 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div></>
  );
}
