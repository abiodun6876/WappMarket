import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full whatsapp-gradient flex items-center justify-center">
                <i className="fab fa-whatsapp text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold">WappMarket</span>
            </div>
            <p className="text-gray-400">Connecting local businesses with customers through WhatsApp.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-primary">Browse Businesses</Link></li>
              <li><Link to="/register-business" className="text-gray-400 hover:text-primary">Register Business</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/marketplace?category=food" className="text-gray-400 hover:text-primary">Food & Beverage</Link></li>
              <li><Link to="/marketplace?category=beauty" className="text-gray-400 hover:text-primary">Beauty & Salon</Link></li>
              <li><Link to="/marketplace?category=home" className="text-gray-400 hover:text-primary">Home Services</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <div className="space-y-3">
              <input type="email" placeholder="Your email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg" />
              <button className="w-full px-4 py-3 whatsapp-gradient text-white font-semibold rounded-lg hover:opacity-90">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {currentYear} WappMarket. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-primary text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
