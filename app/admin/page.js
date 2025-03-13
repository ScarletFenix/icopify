"use client";

import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, BarChart } from "lucide-react";
import Link from "next/link";

const AdminPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("No auth token found");

        // Fetch all users (using the same endpoint as UserPage)
        const usersRes = await fetch("http://localhost:1337/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        setTotalUsers(usersData.length); // Calculate total users based on the array length

        // Fetch all sites with status-site populated
        const sitesRes = await fetch("http://localhost:1337/api/sites?populate=status_site", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sitesData = await sitesRes.json();

        // Extract the `data` field from the response
        const sites = sitesData.data || [];
        setTotalSites(sites.length); // Calculate total sites based on the array length

        // Filter sites to count pending users
        const pendingUsersCount = sites.filter(
          (site) => site.status_site?.website_status === "Pending"
        ).length;
        setPendingUsers(pendingUsersCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users Card */}
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardHeader className="flex items-center space-x-3">
              <Users className="text-blue-500 w-8 h-8" />
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totalUsers}</p>
              <p className="text-gray-500 text-sm">Active users on the platform</p>
              <Link href="/admin/users" className="text-blue-500 hover:underline">
                View Users
              </Link>
            </CardContent>
          </Card>

          {/* Total Sites Card */}
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardHeader className="flex items-center space-x-3">
              <Globe className="text-green-500 w-8 h-8" />
              <CardTitle>Total Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totalSites}</p>
              <p className="text-gray-500 text-sm">Verified sites listed</p>
              <Link href="/admin/users" className="text-blue-500 hover:underline">
                View Users
              </Link>
            </CardContent>
          </Card>

          {/* Pending Users Card */}
          <Card className="shadow-lg p-4 border border-gray-200">
            <CardHeader className="flex items-center space-x-3">
              <BarChart className="text-purple-500 w-8 h-8" />
              <CardTitle>Pending Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{pendingUsers}</p>
              <p className="text-gray-500 text-sm">Users with pending status</p>
              <Link href="/admin/users" className="text-blue-500 hover:underline">
                View Pending Users
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;