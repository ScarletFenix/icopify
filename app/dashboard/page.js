"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaTachometerAlt, FaUser, FaSignOutAlt, FaStar, FaTasks } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';

export default function DashboardPage() {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activeContent, setActiveContent] = useState("Dashboard");
    const [isMounted, setIsMounted] = useState(false);
    const dropdownRef = useRef(null);
    const [user, setUser] = useState({ username: "User", email: "user@example.com" });

    useEffect(() => {
        setIsMounted(true);
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => !prev);
    };

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("jwt");
            localStorage.removeItem("user");
            router.push("/login");
        }
    };

    const handleNavClick = (content) => {
        setActiveContent(content);
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

    if (!isMounted) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-[#EDF2F9]">
            {/* First Navbar (Top Navbar) */}
            <nav className="w-full bg-[#132238] text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-[#1E293B] text-white hover:bg-[#334155] transition-all duration-300 hidden lg:block"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                    <a href="/" className="text-white text-xl font-bold">
                        <img src="/whitelogo1.webp" alt="Logo" className="h-12" />
                    </a>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center text-white"
                    >
                        <span className="text-lg">{user.username.charAt(0)}</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg text-black">
                            <div className="px-4 py-2 border-b">
                                <p className="font-semibold">Welcome, {user.username}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <button
                                onClick={() => handleNavClick("Profile")}
                                className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center space-x-2"
                            >
                                <FaUser className="w-4 h-4" />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-red-200 flex items-center space-x-2 text-red-600"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Second Navbar (Side Navbar) */}
            <nav className={`bg-[#132238] text-white p-2 flex flex-col fixed left-0 top-16 h-full z-10 transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <div className="border-t border-gray-600"></div>
                <div className="flex flex-col space-y-4 mt-2">
                    <button onClick={() => handleNavClick("Dashboard")} className="block p-2 hover:bg-[#334155] rounded flex items-center justify-center lg:justify-start lg:space-x-2 transition-all duration-300">
                        <FaTachometerAlt className="w-5 h-5" />
                        <span className={`transition-all duration-300 transform ${isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} hidden lg:inline`}>Dashboard</span>
                    </button>
                    <button onClick={() => handleNavClick("All My Projects")} className="block p-2 hover:bg-[#334155] rounded flex items-center justify-center lg:justify-start lg:space-x-2 transition-all duration-300">
                        <FaTasks className="w-5 h-5" />
                        <span className={`transition-all duration-300 transform ${isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} hidden lg:inline`}>All My Projects</span>
                    </button>
                    <button onClick={() => handleNavClick("All Publishers")} className="block p-2 hover:bg-[#334155] rounded flex items-center justify-center lg:justify-start lg:space-x-2 transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <span className={`transition-all duration-300 transform ${isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} hidden lg:inline`}>All Publishers</span>
                    </button>
                    <button onClick={() => handleNavClick("Link Insertions")} className="block p-2 hover:bg-[#334155] rounded flex items-center justify-center lg:justify-start lg:space-x-2 transition-all duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                        <span className={`transition-all duration-300 transform ${isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} hidden lg:inline`}>Link Insertions</span>
                    </button>
                    <button onClick={() => handleNavClick("Recommended Sites")} className="block p-2 hover:bg-[#334155] rounded flex items-center justify-center lg:justify-start lg:space-x-2 transition-all duration-300">
                        <FaStar className="w-5 h-5" />
                        <span className={`transition-all duration-300 transform ${isSidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} hidden lg:inline`}>Recommended Sites</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className={`flex-1 ${isSidebarExpanded ? 'pl-64' : 'pl-16'} mt-16 transition-all duration-300`}>
                {/* Main Content */}
                <main className="flex flex-col items-center justify-center space-y-4 p-4">
                    <h1 className="text-4xl font-bold text-[#1E293B]">{activeContent}</h1>
                    {activeContent === "Welcome" && (
                        <p className="text-[#475569]">Welcome to the Dashboard. Select an option from the navigation to see more details.</p>
                    )}
                    {activeContent === "Profile" && (
                        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 text-[#1E293B]">Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#475569]">Username</label>
                                    <p className="mt-1 text-lg text-[#1E293B]">{user.username}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#475569]">Email</label>
                                    <p className="mt-1 text-lg text-[#1E293B]">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}