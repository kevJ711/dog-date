"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const name = `${formData.firstName} ${formData.lastName}`.trim();
    const username = formData.email.split("@")[0];

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: formData.email, username, password: formData.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "Signup failed");
        return;
      }
      alert("Account created. Please log in.");
      router.push("/login");
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 p-4">
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

          {/* Placeholder logo/title */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 flex items-center justify-center 
                            rounded-full bg-yellow-200 text-yellow-700 
                            font-bold text-lg">
              DD
            </div>
            <h1 className="text-3xl font-bold text-yellow-100">Dog Date</h1>
          </div>

          <p className="text-yellow-50">
            Get started with Dog Date and find your pup's new best friends
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white/90 border border-yellow-200 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-yellow-700 mb-1">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-700 mb-6">
            Get started with Dog Date and find your pup&apos;s new best friends
          </p>

          {/* Sign up form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-yellow-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-yellow-300 
                             rounded-lg focus:ring-2 focus:ring-yellow-400 
                             focus:border-yellow-400 outline-none transition 
                             text-gray-800"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-yellow-300 
                             rounded-lg focus:ring-2 focus:ring-yellow-400 
                             focus:border-yellow-400 outline-none transition 
                             text-gray-800"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-yellow-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-yellow-300 
                           rounded-lg focus:ring-2 focus:ring-yellow-400 
                           focus:border-yellow-400 outline-none transition 
                           text-gray-800"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-yellow-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
              className="w-full rounded-xl bg-blue-800 px-4 py-2 font-semibold 
             text-orange-400 shadow-md transition-all duration-300 
             hover:bg-blue-800 hover:shadow-lg hover:scale-105"
            >
            Create Account
            </button>


          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-700 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
