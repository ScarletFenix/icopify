"use client";
import { useState, useEffect, useCallback } from "react";
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

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative">
        <img
          loading="lazy"
          src="https://storage.googleapis.com/a1aa/image/duPxm_HJOqSOZF0GGVt0NF8QUdTUymbUZR3hPuviLls.jpg"
          alt="Collaborative team working in a modern office space"
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Start Growing Your Business Today</h1>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            aria-label="Go to Dashboard"
          >
            <FaTachometerAlt className="mr-2 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
            DASHBOARD
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto py-8 px-4">
        <h5 className="text-2xl text-info opacity-85 mb-4">All Categories</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <ul className="list-none">
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Agriculture">Agriculture</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Animals and Pets">Animals and Pets</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Art">Art</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Automobiles">Automobiles</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Business">Business</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Books">Books</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Beauty">Beauty</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Career and Employment">Career and Employment</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Computers">Computers</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Construction and Repairs">Construction and Repairs</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Culture">Culture</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=E-commerce">E-commerce</a></li>
            <li className="mb-2"><a className="text-white hover:text-blue-400" href="/publishers/search?categories=Web-development">Web-development</a></li>
          </ul>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScroll && (  
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4 mt-auto text-gray-400">
        © 2025 ICOPIFY. All Rights Reserved.
      </footer>
    </div>
  );
};

export default BusinessGrowth;
