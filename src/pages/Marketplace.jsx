import React from "react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const categories = [
    "Food & Beverage", "Beauty & Salon", "Home Services", "Education",
    "Health & Wellness", "Retail", "Automotive", "Professional Services"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="whatsapp-gradient text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Business Marketplace</h1>
          <p className="text-xl opacity-90">Discover and connect with local businesses on WhatsApp</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Search</label>
              <input type="text" placeholder="What are you looking for?" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input type="text" placeholder="City, State, or Area" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option>All Categories</option>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <button className="mt-6 w-full md:w-auto px-8 py-3 whatsapp-gradient text-white font-semibold rounded-lg hover:opacity-90">
            Search Businesses
          </button>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <Link
                key={category}
                to={`/marketplace?category=${encodeURIComponent(category)}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 group-hover:whatsapp-gradient transition">
                  <i className="fas fa-store text-gray-600 group-hover:text-white"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">{category}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-store text-gray-400 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Marketplace Coming Soon</h2>
          <p className="text-gray-600 mb-8">We"re building the best platform for local WhatsApp businesses</p>
          <Link to="/register-business" className="inline-block whatsapp-gradient text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90">
            Be the First to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
