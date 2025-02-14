"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            router.push("/login");
        } else {
            axios
                .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    if (res.data) {
                        setIsAuthenticated(true);
                        setLoading(false); // Stop loading once authenticated
                    }
                })
                .catch((err) => {
                    console.error("Authentication failed:", err);
                    localStorage.removeItem("jwt");
                    router.push("/login");
                });
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        router.push("/login");
    };

    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </main>
    );
}
