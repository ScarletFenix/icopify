"use client";
import { useEffect, useState } from "react";
import StatsSection from './StatsSection';
import { FaUserPlus, FaTag, FaTachometerAlt } from 'react-icons/fa';

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section 
      className="relative h-screen flex flex-col items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: "url(/hero-bg.jpg)" }}
    >
      <div className="text-center text-white flex-1 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-[55px] font-bold mb-4 leading-tight">
          Premium Guest Posting <span className="text-yellow-400">Services</span>
        </h1>
        <h3 className="text-xl md:text-2xl lg:text-3xl mb-2 font-semibold">
          Get <span className="text-yellow-400">Backlinks</span> From High-Quality Websites
        </h3>
        <h4 className="text-lg md:text-xl lg:text-2xl mb-6">
          Only Pay If You Are Satisfied With The Results
        </h4>
        <div className="space-x-4 flex justify-center">
          {isLoggedIn ? (
            <a 
              href="/dashboard" 
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 relative overflow-hidden transition-all duration-300 hover:bg-yellow-400 hover:text-dark shadow-lg hover:shadow-yellow-400/50"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}
            >
              <FaTachometerAlt /> Dashboard
            </a>
          ) : (
            <a 
              href="/register-1" 
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 relative overflow-hidden transition-all duration-300 hover:bg-yellow-400 hover:text-dark shadow-lg hover:shadow-yellow-400/50"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}
            >
              <FaUserPlus /> Sign Up Now
            </a>
          )}
          <a 
            href="#viewPricing" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <FaTag /> View Pricing
          </a>
        </div>
        <p className="mt-4 text-sm md:text-base lg:text-lg">
          Starting From <span className="font-bold text-yellow-400">$4.99</span>
        </p>
      </div>
      <StatsSection />
    </section>
  );
}