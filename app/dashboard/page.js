"use client";
import { useState, useEffect, useRef } from "react";
import {
    FaUser,
    FaSignOutAlt,
    FaStar,
    FaUsers,
    FaLink,
    FaQuestionCircle,
    FaUsers as FaUsersIcon,
    FaArrowUp, // For scroll-to-top button
} from "react-icons/fa";
import { TiHomeOutline } from "react-icons/ti";
import { RxRocket } from "react-icons/rx";
import { GrTask } from "react-icons/gr";
import { PiUserList } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
import { MdOutlineManageHistory } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import AddWebsiteForm from "../_components/publisher/AddWebsiteForm";
import DashboardStats from "../_components/publisher/DashboardStats"; // Import DashboardStats component
import Profile from "../_components/modals/Profile"; // Import Profile component

import "../../styles/custom-scrollbar.css";

export default function DashboardPage() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Set to true by default
    const [activeContent, setActiveContent] = useState("Dashboard");
    const [isMounted, setIsMounted] = useState(false);
    const dropdownRef = useRef(null);
    const [user, setUser] = useState({ id: "12345", username: "User", email: "user@example.com", role: "buyer" });
    const [showScrollButton, setShowScrollButton] = useState(false); // For scroll-to-top button

    useEffect(() => {
        setIsMounted(true);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }

        // Set sidebar expanded state based on screen width
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarExpanded(false);
            } else {
                setIsSidebarExpanded(true);
            }
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);

        // Refresh token every 1 hour
        const interval = setInterval(() => {
            refreshToken();
        }, 60 * 60 * 1000); // 1 hour

        // Scroll event listener for scroll-to-top button
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        // Set active content based on URL
        const query = new URLSearchParams(window.location.search);
        const content = query.get("content");
        if (content) {
            setActiveContent(content);
        }
    }, []);

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                handleLogout();
                return;
            }

            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("jwt", data.jwt);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            handleLogout();
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const handleNavClick = (content) => {
        setActiveContent(content);
        if (content !== "Dashboard") {
            window.history.pushState(null, "", `/dashboard?content=${content}`);
        }
    };

    const toggleRole = () => {
        const newRole = user.role === "buyer" ? "publisher" : "buyer";
        const updatedUser = { ...user, role: newRole };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isMounted) return (
        <div className="min-h-screen flex items-center justify-center bg-[#EDF2F9]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    const buyerLinks = [
        { name: "Dashboard", icon: <TiHomeOutline className="w-6 h-6" />, tooltip: "Overview of your projects and tasks" },
        { name: "All My Projects", icon: <GrTask className="w-6 h-6" />, tooltip: "View and manage all your projects" },
        { name: "All Publishers", icon: <FaUsers className="w-6 h-6" />, tooltip: "Explore and connect with publishers" },
        { name: "Link Insertions", icon: <FaLink className="w-6 h-6" />, tooltip: "Manage your link insertion tasks" },
        { name: "Recommended Sites", icon: <FaStar className="w-6 h-6" />, tooltip: "Discover recommended sites for collaboration" },
    ];

    const publisherLinks = [
        { name: "Dashboard", icon: <TiHomeOutline className="w-6 h-6" />, tooltip: "Your homepage" },
        { name: "Open Offers", icon: <RxRocket className="w-6 h-6" />, tooltip: "Your offers" },
        { name: "Guest Post Tasks", icon: <GrTask className="w-6 h-6" />, tooltip: "See all tasks" },
        { name: "My Platform", icon: <PiUserList className="w-6 h-6" />, tooltip: "See your sites" },
        { name: "FAQ", icon: <FaQuestionCircle className="w-6 h-6" />, tooltip: "How topUrlz work" },
        { name: "Balance", icon: <FaSackDollar className="w-6 h-6" />, tooltip: "See your invoices" },
        { name: "Activity Log", icon: <MdOutlineManageHistory className="w-6 h-6" />, tooltip: "See your activity" },
        { name: "Invite People", icon: <FaUsersIcon className="w-6 h-6" />, tooltip: "Earn commission" },
    ];

    const links = user.role === "buyer" ? buyerLinks : publisherLinks;

    return (
        <div className="min-h-screen flex flex-col bg-[#EDF2F9]">
            {/* First Navbar (Top Navbar) */}
            <nav className="w-full bg-[#f5f5f5] text-[#282828] p-4 flex fixed justify-between items-center shadow-md z-20">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg text-[#282828] hover:bg-gradient-to-r from-orange-300 to-red-300 transition-all duration-300 hidden lg:block"
                        aria-label="Toggle Sidebar"
                        aria-expanded={isSidebarExpanded}
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                    <a href="/" className="text-[#282828] text-xl font-bold">
                        <img src="/whitel" alt="Logo" className="h-12" />
                    </a>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-300 to-red-300 flex items-center justify-center text-[#282828]"
                        aria-label="User Menu"
                    >
                        <span className="text-lg">{user.username.charAt(0)}</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg text-black">
                            <div className="px-4 py-2 border-b">
                                <p className="font-semibold">Welcome, {user.username}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-sm text-gray-600 mr-2">Role: {user.role}</span>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="hidden" onChange={toggleRole} checked={user.role === "publisher"} />
                                        <div className="relative">
                                            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${user.role === "publisher" ? "transform translate-x-full bg-blue-600" : ""}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <button
                                onClick={() => handleNavClick("Profile")}
                                className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
                                aria-label="Profile"
                            >
                                <FaUser className="w-4 h-4" />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-red-200 flex items-center space-x-2 text-red-600"
                                aria-label="Logout"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Sidebar Navigation */}
            <nav className={`bg-[#f5f5f5] text-[#282828] p-2 flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] z-10 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'} overflow-y-auto custom-scrollbar`}>
                <div className="border-t border-gray-600"></div>
                <div className="flex flex-col space-y-4 mt-2">
                    {links.map((item) => (
                        <button 
                            key={item.name} 
                            onClick={() => handleNavClick(item.name)}
                            className={`flex flex-col rounded-lg items-center w-full p-2  transition-all duration-300 group ${
                                activeContent === item.name
                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                    : "hover:bg-gradient-to-r from-orange-300 to-red-300"
                            }`}
                            aria-label={item.tooltip}
                        >
                            {/* Icon Row */}
                            <div className="w-10 h-10 flex items-center justify-center">
                                {item.icon}
                            </div>

                            {/* Link Name and Tooltip Row */}
                            <div className={`text-center transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                <span className="text-sm font-medium">{item.name}</span>
                                <p className={`text-xs mt-1 ${activeContent === item.name ? 'text-white' : 'text-[#282828]'}`}>{item.tooltip}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <div className={`flex-1 ${isSidebarExpanded ? 'pl-64' : 'pl-16'} mt-16 transition-all duration-300 overflow-y-auto z-0`}>
                <main className="flex flex-col items-center justify-start space-y-4 p-4 w-full h-full">
                    {activeContent === "Dashboard" && user.role === "publisher" && (
                        <div className="w-full h-full mt-1 rounded-lg shadow-md">
                            <DashboardStats />
                        </div>
                    )}
                    {activeContent === "Profile" && (
                        <Profile user={user} toggleRole={toggleRole} />
                    )}
                    {activeContent === "My Platform" && (
                        <div className="w-full h-full bg-white p-6 mt-0 rounded-md shadow-md">
                            <AddWebsiteForm />
                        </div>
                    )}
                </main>
            </div>

            {/* Scroll-to-Top Button */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:opacity-90"
                    aria-label="Scroll to Top"
                >
                    <FaArrowUp className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}