import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full whatsapp-gradient flex items-center justify-center">
              <i className="fab fa-whatsapp text-white text-xl"></i>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">WappMarket</span>
              <span className="block text-xs text-gray-500">Find. Chat. Do Business.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-primary transition-colors">Marketplace</Link>
            <Link to="/register-business" className="text-gray-700 hover:text-primary transition-colors">For Businesses</Link>
            
            <Link to="/login" className="text-gray-700 hover:text-primary transition-colors">Sign In</Link>
            <Link to="/register" className="px-4 py-2 text-white whatsapp-gradient rounded-lg hover:opacity-90 transition">Get Started</Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-primary">Marketplace</Link>
              <Link to="/register-business" className="text-gray-700 hover:text-primary">For Businesses</Link>
              <div className="pt-4 space-y-2">
                <Link to="/login" className="block text-center text-gray-700 hover:text-primary">Sign In</Link>
                <Link to="/register" className="block text-center text-white whatsapp-gradient rounded-lg py-2 hover:opacity-90">Get Started</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
