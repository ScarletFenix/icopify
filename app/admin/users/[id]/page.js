"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUserSites } from "../../../_components/utils/fetchUserSites"; 

const UserDetailsPage = () => {
  const { id: userId } = useParams();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("No auth token found");

        console.log("Fetching sites for user ID:", userId);
        const fetchedSites = await fetchUserSites(token, userId);

        // Filter published sites and sort by createdAt (recent first)
        const publishedSites = fetchedSites
          .filter((site) => site.publishedAt !== null)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setSites(publishedSites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Loading site details...</p>;
  if (sites.length === 0) return <p className="text-center mt-10">No published sites found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User's Websites</h1>

      {/* Sites Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white text-left text-sm font-semibold">
              <th className="p-3">URL</th>
              <th className="p-3">Website Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="border-t hover:bg-gray-100">
                <td className="p-3">{site.url}</td>
                <td className="p-3">{site.status.websiteRole}</td>
                <td className="p-3">{site.status.websiteStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetailsPage;
