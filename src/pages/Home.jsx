import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    { icon: "fa-globe", title: "Public Visibility", desc: "Get discovered by local customers" },
    { icon: "fa-comment", title: "Instant Connection", desc: "Start WhatsApp chats with one click" },
    { icon: "fa-money-bill-wave", title: "Zero Cost", desc: "No website or app development costs" },
    { icon: "fa-shield-alt", title: "Trust & Verification", desc: "Verified businesses build confidence" }
  ];

  const steps = [
    { number: "01", title: "Register", desc: "Business owners register with basic details" },
    { number: "02", title: "List", desc: "Your business appears in our marketplace" },
    { number: "03", title: "Connect", desc: "Customers find and chat with you on WhatsApp" },
    { number: "04", title: "Grow", desc: "Build your local reputation and customer base" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden whatsapp-gradient text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find. Chat. <span className="text-light">Do Business.</span>
            </h1>
            <p className="text-xl mb-10 opacity-90">
              Connect directly with trusted local whatsapp businesses around your location. 
              No websites, no apps—just human conversations that drive commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace" className="bg-white text-primary font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-center text-lg">
                <i className="fas fa-store mr-2"></i>Explore Businesses
              </Link>
              <Link to="/register-business" className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 text-center text-lg">
                <i className="fas fa-user-plus mr-2"></i>List Your Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">How WappMarket Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-20 h-20 rounded-full whatsapp-gradient flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose WappMarket?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition">
                <div className="w-16 h-16 rounded-full whatsapp-gradient flex items-center justify-center mx-auto mb-6">
                  <i className={`fas ${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 whatsapp-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join local businesses connecting with customers through WhatsApp.
          </p>
          <Link to="/register-business" className="inline-block bg-white text-primary font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg">
            Start Free Listing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
