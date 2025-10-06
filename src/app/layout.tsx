import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dog Date - Find Play Dates for Your Furry Friend",
  description: "Connect with local dog owners and discover the perfect playmates for your furry friend. Safe, easy, and tail-waggingly fun!",
  keywords: ["dog", "playdate", "pets", "dogs", "meetup", "social"],
  authors: [{ name: "Dog Date Team" }],
  openGraph: {
    title: "Dog Date - Find Play Dates for Your Furry Friend",
    description: "Connect with local dog owners and discover the perfect playmates for your furry friend.",
    type: "website",
  },
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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
