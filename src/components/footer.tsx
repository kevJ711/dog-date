import { Heart, MapPin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/dogdate-logo.png"
                alt="Dog Date Logo"
                className="w-10 h-10 object-contain"
              />
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-800">Dog Date</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Bringing dogs and their humans together for unforgettable play
              dates. Because every dog deserves a best friend.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Available in 50+ cities!</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-600 hover:text-orange-500">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-orange-500">How It Works</a></li>
              <li><a href="#safety" className="text-gray-600 hover:text-orange-500">Safety</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Success Stories</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-orange-500">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2025 Dog Date. Made with <Heart className="w-4 h-4 inline mx-1 text-orange-300 fill-orange-500" /> for dog lovers everywhere.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:barkmates@dogdate.com"
              className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition">
                
              <Mail className="w-4 h-4" />
              <span className="text-sm">barkmates@dogdate.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
