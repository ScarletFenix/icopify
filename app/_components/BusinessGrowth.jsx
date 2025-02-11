"use client"
import { useState, useEffect } from "react";
import { FaTachometerAlt, FaArrowUp } from "react-icons/fa";

const BusinessGrowth = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="relative">
        <img
          src="https://storage.googleapis.com/a1aa/image/duPxm_HJOqSOZF0GGVt0NF8QUdTUymbUZR3hPuviLls.jpg"
          alt="Background image of people working in an office"
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Start Growing your Business Today</h1>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            <FaTachometerAlt className="mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
            DASHBOARD
          </button>
        </div>
      </div>
      
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <FaArrowUp size={20} />
        </button>
      )}

      <footer className="bg-gray-800 text-center py-4 mt-8 text-gray-400">
        © 2025 ICOPIFY. All Rights Reserved.
      </footer>
    </div>
  );
};

export default BusinessGrowth;