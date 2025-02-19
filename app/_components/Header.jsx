"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 shadow-md ${
        isScrolled ? "bg-[#0B1727]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <a href="/" className="text-white text-xl font-bold">
          <img src="/whitelogo1.webp" alt="Logo" className="h-12" />
        </a>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-6 h-6 flex flex-col justify-between">
            <span
              className={`block h-0.5 bg-white transition-all ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-white transition-all ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-white transition-all ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </div>
        </button>
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-white hover:text-orange-400">
            Link Building
          </a>
          <a
            href="/digital-pr-seo"
            className="text-white hover:text-orange-400"
          >
            Digital PR & SEO
          </a>
          <a
            href="/website-fix-design"
            className="text-white hover:text-orange-400"
          >
            Fix & Design Site
          </a>
          <a
            href="/content-writing"
            className="text-white hover:text-orange-400"
          >
            Content Writing
          </a>
          {isLoggedIn ? (
            <a href="/dashboard" className="text-white hover:text-orange-400">
              Dashboard
            </a>
          ) : (
            <>
              <a href="/login" className="text-white hover:text-orange-400">
                Login
              </a>
              <a href="/register-1" className="text-white hover:text-orange-400">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-[#0B1727] text-white flex flex-col items-center py-4 space-y-4 shadow-sm">
          <a href="/" className="hover:text-orange-400">
            Link Building
          </a>
          <a href="/digital-pr-seo" className="hover:text-orange-400">
            Digital PR & SEO
          </a>
          <a href="/website-fix-design" className="hover:text-orange-400">
            Fix & Design Site
          </a>
          <a href="/content-writing" className="hover:text-orange-400">
            Content Writing
          </a>
          {isLoggedIn ? (
            <a href="/dashboard" className="hover:text-orange-400">
              Dashboard
            </a>
          ) : (
            <>
              <a href="/login" className="hover:text-orange-400">
                Login
              </a>
              <a href="/register-1" className="hover:text-orange-400">
                Sign Up
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}