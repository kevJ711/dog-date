import Link from "next/link";
import { Heart, Calendar, MapPin, Shield, Users, Star } from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-orange-600" />,
      title: "Smart Matching",
      description:
        "Our algorithm matches dogs based on size, temperament, play style, and location for perfect compatibility.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Nearby Dogs",
      description:
        "Find dog playmates in your neighborhood. Set your radius and discover dogs within walking distance.",
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      title: "Safety First",
      description:
        "Verified profiles, vaccination status tracking, and safety reports keep your furry friend protected.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
      title: "Easy Scheduling",
      description:
        "Send playdate requests with preferred dates, times, and locations. Simple scheduling that works for everyone.",
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Dog Owner Community",
      description:
        "Connect with fellow dog lovers, share tips, and build lasting friendships through your furry companions.",
    },
    {
      icon: <Star className="w-8 h-8 text-orange-600" />,
      title: "Rate & Review",
      description:
        "Leave feedback after playdates to help other owners find the best matches for their dogs.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 via-blue-500 to-blue-200 flex flex-col min-h-screen overflow-y-auto">
      {/* ✅ Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
          Find Play Dates for Your Dog
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-indigo-900 mb-10">
          Connect with local dog owners and discover the perfect playmates for
          your furry friend. Safe, easy, and tail-waggingly fun!
        </p>

        {/* ✅ Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/browse"
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

      {/* 🐾 Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Why Dogs Love Us
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Everything you need to find the perfect playmates for your dog,
              all in one adorable app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 text-center rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-100 border border-orange-200 shadow-md hover:shadow-lg transition transform hover:scale-105"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
