"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUserSites } from "../../../_components/utils/fetchUserSites";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

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

        // Filter out sites where both site.publishedAt and site.status.publishedAt are null
        const filteredSites = fetchedSites.filter((site) => {
          const isSitePublished = site.publishedAt !== null;
          const isStatusPublished = site.status?.publishedAt !== null;
          return isSitePublished || isStatusPublished;
        });

        console.log("Filtered sites:", filteredSites); // Debugging
        setSites(filteredSites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [userId]);

  const updateStatusSite = async (siteId, newStatus) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No auth token found");

      console.log("Fetching site details for:", siteId);
      const siteRes = await fetch(
        `http://localhost:1337/api/sites/${siteId}?populate=status_site`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!siteRes.ok) throw new Error("Failed to fetch site data");

      const siteData = await siteRes.json();
      console.log("Fetched site data:", siteData);

      const statusSiteId = siteData?.status_site?.id;

      if (!statusSiteId) {
        console.warn(`No status_site found for site ID: ${siteId}`);
        alert("This site does not have an associated status record.");
        return;
      }

      // Determine performer_status based on website_status
      let newPerformerStatus;
      if (newStatus === "Pending") {
        newPerformerStatus = "In Moderation";
      } else if (newStatus === "Approved") {
        newPerformerStatus = "Approved";
      } else {
        newPerformerStatus = siteData.status_site.performer_status; // Keep existing value
      }

      console.log(`Updating status_site ID: ${statusSiteId} with new status: ${newStatus} and performer_status: ${newPerformerStatus}`);

      const updateRes = await fetch(
        `http://localhost:1337/api/status-sites/${statusSiteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              website_status: newStatus,
              performer_status: newPerformerStatus,
            },
          }),
        }
      );

      if (!updateRes.ok) throw new Error("Failed to update status");

      const updatedData = await updateRes.json();
      console.log("✅ Status updated successfully:", updatedData);

      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId
            ? {
                ...site,
                status: {
                  ...site.status,
                  websiteStatus: newStatus,
                  performerStatus: newPerformerStatus,
                },
              }
            : site
        )
      );
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  const updateWebsiteRole = async (siteId, newRole) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No auth token found");

      console.log("Fetching site details for:", siteId);
      const siteRes = await fetch(
        `http://localhost:1337/api/sites/${siteId}?populate=status_site`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!siteRes.ok) {
        const errorData = await siteRes.json();
        console.error("Error fetching site data:", errorData);
        throw new Error(`Failed to fetch site data: ${errorData.error?.message || "Unknown error"}`);
      }

      const siteData = await siteRes.json();
      console.log("Fetched site data:", siteData);

      const statusSiteId = siteData?.status_site?.id;

      if (!statusSiteId) {
        console.warn(`No status_site found for site ID: ${siteId}`);
        alert("This site does not have an associated status record.");
        return;
      }

      console.log(`Updating status_site ID: ${statusSiteId} with new role: ${newRole}`);

      const updateRes = await fetch(
        `http://localhost:1337/api/status-sites/${statusSiteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              website_role: newRole,
            },
          }),
        }
      );

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        console.error("Error response from API:", errorData);
        throw new Error(`Failed to update role: ${errorData.error?.message || "Unknown error"}`);
      }

      const updatedData = await updateRes.json();
      console.log("✅ Role updated successfully:", updatedData);

      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId
            ? {
                ...site,
                status: { ...site.status, websiteRole: newRole },
              }
            : site
        )
      );
    } catch (error) {
      console.error("❌ Error updating role:", error);
      alert(`Failed to update role: ${error.message}`);
    }
  };

  const handleUpdateStatus = (siteId, newStatus) => {
    updateStatusSite(siteId, newStatus);
  };

  const handleUpdateRole = (siteId, newRole) => {
    updateWebsiteRole(siteId, newRole);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User's Websites</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white text-left text-sm font-semibold">
              <th className="p-3">URL</th>
              <th className="p-3">Website Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="border-t hover:bg-gray-100">
                <td className="p-3">{site.url}</td>
                <td className="p-3">
                  <select
                    value={site.status.websiteRole}
                    onChange={(e) => handleUpdateRole(site.id, e.target.value)}
                    className="px-2 py-1 rounded-md bg-blue-100 text-blue-700"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Contributor">Contributor</option>
                    <option value="Partership">Partership</option>
                  </select>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-md ${site.status.websiteStatus === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {site.status.websiteStatus}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {site.status.websiteStatus.toLowerCase() !== "approved" && (
                    <FaUserCheck
                      className="text-green-500 cursor-pointer hover:text-green-700 text-2xl"
                      title="Approve"
                      onClick={() => handleUpdateStatus(site.id, "Approved")}
                    />
                  )}
                  {site.status.websiteStatus.toLowerCase() !== "rejected" && (
                    <FaUserTimes
                      className="text-red-500 cursor-pointer hover:text-red-700 text-2xl"
                      title="Reject"
                      onClick={() => handleUpdateStatus(site.id, "Rejected")}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetailsPage;