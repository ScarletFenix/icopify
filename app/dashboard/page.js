"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    FaTachometerAlt, 
    FaUser, 
    FaSignOutAlt, 
    FaStar, 
    FaTasks, 
    FaUsers, 
    FaLink, 
    FaBriefcase, 
    FaColumns, 
    FaQuestionCircle, 
    FaWallet, 
    FaUserClock, 
    FaUsers as FaUsersIcon,
    FaArrowUp // For scroll-to-top button
} from 'react-icons/fa';
import { TiHomeOutline } from "react-icons/ti";
import { RxRocket } from "react-icons/rx";
import { GrTask } from "react-icons/gr";
import { PiUserList } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
import { MdOutlineManageHistory } from "react-icons/md";
import { FiMenu } from 'react-icons/fi';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import AddWebsiteForm from "../_components/publisher/AddWebsiteForm";

export default function DashboardPage() {
    const router = useRouter();
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
            window.removeEventListener('scroll', handleScroll);
        };
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
        router.push("/login");
    };

    const handleNavClick = (content) => {
        setActiveContent(content);
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
        { name: "Dashboard", icon: <TiHomeOutline className="w-6 h-6" />, tooltip: "Dashboard" },
        { name: "All My Projects", icon: <GrTask className="w-6 h-6" />, tooltip: "All My Projects" },
        { name: "All Publishers", icon: <FaUsers className="w-6 h-6" />, tooltip: "All Publishers" },
        { name: "Link Insertions", icon: <FaLink className="w-6 h-6" />, tooltip: "Link Insertions" },
        { name: "Recommended Sites", icon: <FaStar className="w-6 h-6" />, tooltip: "Recommended Sites" },
    ];

    const publisherLinks = [
        { name: "Dashboard", icon: <TiHomeOutline className="w-6 h-6" />, tooltip: "Dashboard" },
        { name: "Open Offers", icon: <RxRocket className="w-6 h-6" />, tooltip: "Open Offers" },
        { name: "Guest Post Tasks", icon: <GrTask className="w-6 h-6" />, tooltip: "Guest Post Tasks" },
        { name: "My Platform", icon: <PiUserList className="w-6 h-6" />, tooltip: "My Platform" },
        { name: "FAQ", icon: <FaQuestionCircle className="w-6 h-6" />, tooltip: "FAQ" },
        { name: "Balance", icon: <FaSackDollar className="w-6 h-6" />, tooltip: "Balance" },
        { name: "Activity Log", icon: <MdOutlineManageHistory className="w-6 h-6" />, tooltip: "Activity Log" },
        { name: "Invite People", icon: <FaUsersIcon className="w-6 h-6" />, tooltip: "Invite People" },
    ];

    const links = user.role === "buyer" ? buyerLinks : publisherLinks;

    return (
        <div className="min-h-screen flex flex-col bg-[#EDF2F9]">
            {/* First Navbar (Top Navbar) */}
            <nav className="w-full bg-[#f5f5f5] text-[#282828] p-4 flex fixed justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-[#] text-[#282828] hover:bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 hidden lg:block"
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
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-[#282828]"
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
            <nav className={`bg-[#f5f5f5] text-[#282828] p-2 flex flex-col fixed left-0 top-16 h-full z-10 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <div className="border-t border-gray-600"></div>
                <div className="flex flex-col space-y-4 mt-2">
                    {links.map((item) => (
                        <button 
                            key={item.name} 
                            onClick={() => handleNavClick(item.name)}
                            className={`flex items-center w-full p-2 rounded transition-all duration-300 group ${
                                activeContent === item.name
                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                    : "hover:bg-gradient-to-r from-orange-500 to-red-500"
                            }`}
                            data-tooltip-id="sidebar-tooltip"
                            data-tooltip-content={item.tooltip}
                            aria-label={item.tooltip}
                        >
                            {/* Ensure Icons Always Visible */}
                            <span className="w-10 flex justify-center">{item.icon}</span>
                            
                            {/* Show Text Only When Expanded */}
                            <span className={`text-[#282828] transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100 ml-2' : 'opacity-0 hidden'}`}>
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <div className={`flex-1 ${isSidebarExpanded ? 'pl-64' : 'pl-16'} mt-16 transition-all duration-300 overflow-y-auto`}>
                <main className="flex flex-col items-center justify-start space-y-4 p-4 w-full h-full">
                    {activeContent === "Profile" && (
                        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#475569]">Username</label>
                                    <p className="mt-1 text-lg text-[#1E293B]">{user.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#475569]">Email</label>
                                    <p className="mt-1 text-lg text-[#1E293B]">{user.email}</p>
                                </div>
                                <div>
                                    <div className="flex items-center mt-1">
                                        <span className="text-sm text-gray-600 mr-2">{user.role === "buyer" ? "Buyer" : "Publisher"}</span>
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" className="hidden" onChange={toggleRole} checked={user.role === "publisher"} />
                                            <div className="relative">
                                                <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${user.role === "publisher" ? "transform translate-x-full bg-blue-600" : ""}`}></div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeContent === "My Platform" && (
                        <div className="w-full h-full bg-white p-6 mt-0 rounded-md shadow-md">
                            <AddWebsiteForm />
                        </div>
                    )}
                </main>
            </div>

            {/* Tooltip */}
            <ReactTooltip
                id="sidebar-tooltip"
                place="right"
                type="dark"
                effect="solid"
                className="!bg-[#282828] !text-white !px-3 !py-2 !rounded-lg"
                arrowColor="#282828"
                delayShow={100} // Add a 300ms delay
            />

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