import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Dog Date</h3>
            <p className="text-gray-300 mb-4">
              Connecting dogs and their owners for safe, fun play dates in your local area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-gray-300 hover:text-white transition">
                  Browse Dogs
                </Link>
              </li>
              <li>
                <Link href="/playdates" className="text-gray-300 hover:text-white transition">
                  Play Dates
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-gray-300 hover:text-white transition">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-300 hover:text-white transition">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Dog Date. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
