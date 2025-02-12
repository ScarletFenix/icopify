"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = false; // Change this with your Strapi auth check

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
    </main>
  );
}
