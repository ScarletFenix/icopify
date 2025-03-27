import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash, FaPlay, FaPause, FaInfoCircle } from "react-icons/fa";
import { fetchUserSites } from "../utils/fetchUserSites";
import AddWebsiteForm from "./AddWebsiteForm";
import EditSiteModal from "./EditSiteModal"; // Import the EditSiteModal
import { toast } from "react-toastify"; // Ensure toast is imported

const SitesTable = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [siteToEdit, setSiteToEdit] = useState(null); // Track the site being edited
  const itemsPerPage = 20; // Number of items to display per page

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  // Function to fetch sites
  const fetchSites = async () => {
    const jwt = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!jwt || !user) {
      console.error("🔑 JWT or user is missing. Please log in.");
      return;
    }

    const userId = user.id;
    const data = await fetchUserSites(jwt, userId);
    console.log("📦 Fetched sites data:", data);

    if (data.length === 0) {
      console.warn("🚨 No sites found or data is invalid.");
    }

    // Sort sites by createdAt in descending order (newest first)
    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSites(sortedData);
    setFilteredSites(sortedData);
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredSites(
      sites.filter((site) => site.url.toLowerCase().includes(value))
    );
  };

  // Handle edit icon click
  const handleEditClick = (site) => {
    
    if (!site || !site.id) {
      console.error("Invalid site data:", site);
      toast.error("Invalid site data. Please try again.");
      return;
    }
    console.log("Editing site with ID:", site.id); // Debugging
    setSiteToEdit(site); // Set the site to edit
    setShowEditModal(true); // Show the edit modal
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (siteId) => {
    setSiteToDelete(siteId);
    setShowDeleteModal(true);
  };

  // Delete site
  const deleteSite = async () => {
    if (!siteToDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No auth token found");

      const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sites/${siteToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { isDeleted: true }, // Soft delete
        }),
      });

      const result = await updateRes.json();

      if (!updateRes.ok) {
        console.error("❌ Update failed:", result);
        throw new Error(result?.error?.message || "Failed to mark site as deleted");
      }

      console.log("✅ Site marked as deleted successfully");

      // Filter out deleted site from state
      setSites((prevSites) => prevSites.filter((site) => site.id !== siteToDelete));
      setFilteredSites((prevSites) => prevSites.filter((site) => site.id !== siteToDelete));

      setShowDeleteModal(false);
      setSiteToDelete(null);
    } catch (error) {
      console.error("❌ Error deleting site:", error.message);
      alert(`Error deleting site: ${error.message}`);
    }
  };

  // Toggle activity status
  const toggleActivityStatus = async (siteId, currentStatus) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No auth token found");

      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

      const siteRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sites/${siteId}?populate=status_site`,
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

      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/status-sites/${statusSiteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              activity_status: newStatus, // Only update activity_status
            },
          }),
        }
      );

      if (!updateRes.ok) throw new Error("Failed to update activity status");

      const updatedData = await updateRes.json();
      console.log("✅ Activity status updated successfully:", updatedData);

      // Update state to reflect the new activity status
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId
            ? {
                ...site,
                status: {
                  ...site.status,
                  activityStatus: newStatus, // Only update activityStatus
                },
              }
            : site
        )
      );

      setFilteredSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId
            ? {
                ...site,
                status: {
                  ...site.status,
                  activityStatus: newStatus, // Only update activityStatus
                },
              }
            : site
        )
      );
    } catch (error) {
      console.error("❌ Error updating activity status:", error);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "InModeration":
        return "bg-yellow-200 text-yellow-600";
      case "Active":
        return "bg-green-200 text-green-600";
      case "Inactive":
        return "bg-red-200 text-red-600";
      case "Approved":
        return "bg-green-200 text-green-600";
      case "Pending":
        return "bg-yellow-200 text-yellow-600";
      case "Rejected":
        return "bg-red-200 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);

  return (
    <div className="bg-[#EDF2F9] p-4">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this site?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteSite}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Site Modal */}
      {showEditModal && siteToEdit && (
        <EditSiteModal
          siteId={siteToEdit.id} // Pass the site ID to the modal
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            fetchSites(); // Refresh the list of sites after update
            setShowEditModal(false); // Close the modal
          }}
        />
      )}

      <div className="flex flex-col w-full bg-white mt-4 rounded-md shadow-md">
        <div className="mb-4 p-4">
          <AddWebsiteForm onWebsiteAdded={fetchSites} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-[white] border border-gray-200 text-center">
          <thead>
            <tr className="bg-[#D8E2EF] text-[#282828] text-xs leading-normal whitespace-nowrap border-b border-gray-300">
              <th className="py-2 px-2 border-r border-gray-300">No</th>
              <th className="py-2 px-4 border-r border-gray-300">
                <div className="flex items-center space-x-2 justify-center">
                  <span>URL</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border rounded-lg px-2 py-1 text-xs"
                  />
                </div>
              </th>
              <th className="py-2 px-2 border-r border-gray-300">Website Role</th>
              <th className="py-2 px-2 border-r border-gray-300">Website Status</th>
              <th className="py-2 px-2 border-r border-gray-300">Performer Status</th>
              <th className="py-2 px-2 border-r border-gray-300">Activity Status</th>
              <th className="py-2 px-2 border-r border-gray-300">Placement</th>
              <th className="py-2 px-2 border-r border-gray-300">Creation & Placement</th>
              <th className="py-2 px-2 border-r border-gray-300">Link Insertion</th>
              <th className="py-2 px-2 border-r border-gray-300">Buyer Page</th>
              <th className="py-2 px-2 border-r border-gray-300">Edit</th>
              <th className="py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-[#282828] text-sm font-light">
            {currentItems.length > 0 ? (
              currentItems.map((site, index) => (
                <tr key={site.id} className="border-b border-gray-200 hover:bg-[#F0F0F0]">
                  <td className="py-2 px-2 border-r border-gray-300">{indexOfFirstItem + index + 1}</td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    <Link href={site.url}>
                      <span className="text-blue-500">{site.url}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">{site.status.websiteRole}</td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <span className={`${getStatusColor(site.status.websiteStatus)} py-1 px-2 rounded-full text-xs`}>
                      {site.status.websiteStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <span className={`${getStatusColor(site.status.performerStatus)} py-1 px-2 rounded-full text-xs`}>
                      {site.status.performerStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <span className={`${getStatusColor(site.status.activityStatus)} py-1 px-2 rounded-full text-xs`}>
                      {site.status.activityStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    {site.contentPlacementPrice ? `$${site.contentPlacementPrice}` : "N/A"}
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    {site.contentCreationPlacementPrice ? `$${site.contentCreationPlacementPrice}` : "N/A"}
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    {site.status.websiteRole === "Owner" ? "Eligible" : "Not Eligible"}
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                      title="View Buyer Page"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded mr-1"
                      title="Edit Site"
                      onClick={() => handleEditClick(site)} // Add onClick handler
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(site.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      title="Delete Site"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() => toggleActivityStatus(site.id, site.status.activityStatus)}
                      disabled={
                        site.status.websiteStatus === "Pending" || 
                        site.status.websiteStatus === "Rejected"
                      }
                      className={`${
                        site.status.activityStatus === "Active" ? "bg-green-500" : "bg-red-500"
                      } text-white py-1 px-2 rounded ${
                        site.status.websiteStatus === "Pending" || 
                        site.status.websiteStatus === "Rejected"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={
                        site.status.websiteStatus === "Pending" || 
                        site.status.websiteStatus === "Rejected"
                          ? "Action unavailable for pending or rejected sites"
                          : site.status.activityStatus === "Active"
                          ? "Pause Activity"
                          : "Resume Activity"
                      }
                    >
                      {site.status.activityStatus === "Active" ? <FaPause /> : <FaPlay />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 px-4 text-center">No sites found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SitesTable;