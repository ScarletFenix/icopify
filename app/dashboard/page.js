    "use client";
        import { useState, useEffect, useRef } from "react";
        import {
            FaUser, FaSignOutAlt, FaStar, FaUsers, FaLink, FaQuestionCircle, FaUsers as FaUsersIcon, FaArrowUp,
        } from "react-icons/fa";
        import { TiHomeOutline } from "react-icons/ti";
        import { RxRocket } from "react-icons/rx";
        import { GrTask } from "react-icons/gr";
        import { PiUserList } from "react-icons/pi";
        import { FaSackDollar } from "react-icons/fa6";
        import { MdOutlineManageHistory } from "react-icons/md";
        import { FiMenu } from "react-icons/fi";
        import AddWebsiteForm from "../_components/publisher/AddWebsiteForm";
        import DashboardStats from "../_components/publisher/DashboardStats";
        import Profile from "../_components/modals/Profile";
        import "../../styles/custom-scrollbar.css";
        import SitesTable from "../_components/publisher/SitesTable";
        import loadingAnimation from "../../public/animations/loading.json";
        import Lottie from "lottie-react";
        

        export default function DashboardPage() {
            const [isDropdownOpen, setIsDropdownOpen] = useState(false);
            const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
            const [activeContent, setActiveContent] = useState("Dashboard");
            const [isMounted, setIsMounted] = useState(false);
            const dropdownRef = useRef(null);
            const [user, setUser] = useState(null);
            const [showScrollButton, setShowScrollButton] = useState(false);


useEffect(() => {
  const timer = setTimeout(() => {
    setIsMounted(true);
  }, 5000); // Show loading animation for 5 seconds

  return () => clearTimeout(timer); // Cleanup timeout
}, []);

            useEffect(() => {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const jwt = localStorage.getItem("jwt");
            
                if (!storedUser || !jwt) {
                    window.location.href = "/login";
                    return;
                }
            
                // Default to publisher if role is not specified
                const userWithDefaultRole = {
                    ...storedUser,
                    role: storedUser.role || "publisher"
                };
            
                setUser(userWithDefaultRole);
                localStorage.setItem("user", JSON.stringify(userWithDefaultRole));
                setIsMounted(true);
            
            

                setUser(storedUser);
                setIsMounted(true);

                const handleResize = () => {
                    setIsSidebarExpanded(window.innerWidth >= 768);
                };

                handleResize();
                window.addEventListener('resize', handleResize);

                const interval = setInterval(refreshToken, 60 * 60 * 1000);

                const handleScroll = () => {
                    setShowScrollButton(window.scrollY > 200);
                };

                window.addEventListener('scroll', handleScroll);
                return () => {
                    clearInterval(interval);
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('scroll', handleScroll);
                };
            }, []);

            useEffect(() => {
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

            const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
            const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

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

            const toggleRole = async () => {
                const newRoleType = user.roleType === "buyer" ? "publisher" : "buyer";
                const updatedUser = { ...user, roleType: newRoleType };
            
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                        },
                        body: JSON.stringify({ roleType: newRoleType })
                    });
            
                    if (response.ok) {
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        setActiveContent("Dashboard");
                    } else {
                        console.error("Failed to update roleType in Strapi");
                    }
                } catch (error) {
                    console.error("Error updating roleType:", error);
                }
            };
            
            
            
            

            useEffect(() => {
                const handleClickOutside = (event) => {
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setIsDropdownOpen(false);
                    }
                };

                document.addEventListener("mousedown", handleClickOutside);
                return () => document.removeEventListener("mousedown", handleClickOutside);
            }, []);

            const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

            if (!isMounted)
                return (
                  <div className="min-h-screen flex items-center justify-center bg-[#EDF2F9]">
                    <Lottie animationData={loadingAnimation} loop={true} className="w-24 h-24" />
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

            const links = user.roleType === "buyer" ? buyerLinks : publisherLinks;


            return (
                <div className="min-h-screen flex flex-col bg-[#EDF2F9]">
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
                                <img src="/logoipsum-327.svg" alt="Logo" className="h-12" />
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
                                        <span className="text-sm text-gray-600 mr-2">Role: {user.roleType}</span>
                                            <label className="flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    onChange={toggleRole} 
                                                    checked={user.roleType === "publisher"} 
                                                />
                                                <div className="relative">
                                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                                                        user.roleType === "publisher" ? "transform translate-x-full bg-blue-600" : ""
                                                    }`}></div>
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
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div className={`text-center transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <p className={`text-xs mt-1 ${activeContent === item.name ? 'text-white' : 'text-[#282828]'}`}>{item.tooltip}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </nav>

                    <div className={`flex-1 ${isSidebarExpanded ? 'pl-64' : 'pl-16'} mt-16 transition-all duration-300 overflow-y-auto z-0`}>
                        <main className="flex flex-col items-center justify-start space-y-4 p-4 w-full h-full">
                            {activeContent === "Dashboard" && (
                                <div className="w-full h-full mt-1 rounded-lg shadow-md">
                                    {user.roleType === "publisher" ? <DashboardStats /> : <BuyerDashboard />}
                                </div>
                            )}
                            {activeContent === "Profile" && (
                                <Profile user={user} toggleRole={toggleRole} />
                            )}
                            {activeContent === "My Platform" && (
                               <div className="flex flex-col w-full h-screen bg-white mt-4 rounded-md shadow-md">
                               <div className="">
                                 <AddWebsiteForm />
                               </div>
                               <div className="w-full bg-white p-2 mt-4 rounded-md shadow-md">
                                 <SitesTable  />
                               </div>
                             </div>
                            )}
                        </main>
                    </div>

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

        // Placeholder for BuyerDashboard component
        function BuyerDashboard() {
            return (
                <div className="p-4">
                    <h2 className="text-2xl font-bold">Buyer Dashboard</h2>
                    <p>Welcome to the Buyer Dashboard. Here you can manage your projects and tasks.</p>
                </div>
            );
        }