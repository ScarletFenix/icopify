"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const navLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
];

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.replace("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.roleType !== "Admin") {
      router.replace("/");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="h-screen">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        {/* Navigation Links */}
        <div className="space-x-2 flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2 rounded-md ${
                pathname === link.href ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Avatar & Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-10 h-10 flex items-center justify-center bg-gray-300 text-white font-bold cursor-pointer">
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-default">Welcome, {user.username}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-default">{user.email}</DropdownMenuItem>
            <DropdownMenuItem>
              <Button onClick={handleLogout} className="w-full bg-red-200 text-red-700 hover:bg-red-300">
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Page Content */}
      <main className="pt-20 p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
