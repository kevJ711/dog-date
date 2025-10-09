import Link from "next/link";
import { Heart, Calendar } from "lucide-react";
import Footer from "@/components/footer"; // ✅ import the Footer component

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 flex flex-col">
      {/* Main Content */}
      <section className="flex-1 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
          Find Play Dates for Your Dog
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-indigo-900 mb-10">
          Connect with local dog owners and discover the perfect playmates for your furry friend. Safe, easy, and tail-waggingly fun!
        </p>

        {/* ✅ Buttons */}
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

      {/* ✅ Add Footer */}
      <Footer />
    </div>
  );
}
