import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { fetchUserSites } from "../utils/fetchUserSites"; // Adjust the import path accordingly

const SitesTable = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getSites = async () => {
      const jwt = localStorage.getItem("jwt");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!jwt || !user) {
        console.error("🔑 JWT or user is missing. Please log in.");
        return;
      }

      const userId = user.id;
      const data = await fetchUserSites(jwt, userId);
      console.log("📦 Fetched sites data:", data); // Debugging

      if (data.length === 0) {
        console.warn("🚨 No sites found or data is invalid.");
      }

      setSites(data);
      setFilteredSites(data);
    };

    getSites();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredSites(
      sites.filter((site) => site.url.toLowerCase().includes(value))
    );
  };

  return (
    <div className="bg-[#EDF2F9] p-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-[white] border border-gray-200">
          <thead>
            <tr className="bg-[#D8E2EF] text-[#282828] text-xs leading-normal whitespace-nowrap">
              <th className="py-2 px-2 text-left">No</th>
              <th className="py-2 px-4 text-left">
                <div className="flex items-center space-x-2">
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
              <th className="py-2 px-2 text-left">Website Role</th>
              <th className="py-2 px-2 text-left">Website Status</th>
              <th className="py-2 px-2 text-left">Performer Status</th>
              <th className="py-2 px-2 text-left">Activity Status</th>
              <th className="py-2 px-2 text-left">Placement</th>
              <th className="py-2 px-2 text-left">Creation & Placement</th>
              <th className="py-2 px-2 text-left">Link Insertion</th>
              <th className="py-2 px-2 text-left">Buyer Page</th>
              <th className="py-2 px-2 text-left">Edit</th>
              <th className="py-2 px-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-[#282828] text-sm font-light">
            {filteredSites.length > 0 ? (
              filteredSites.map((site, index) => (
                <tr key={site.id} className="border-b border-gray-200 hover:bg-[#F0F0F0]">
                  <td className="py-2 px-2 text-left">{index + 1}</td>
                  <td className="py-2 px-4 text-left">
                    <Link href={site.url}>
                      <span className="text-blue-500">{site.url}</span>
                    </Link>
                  </td>
                  <td className="py-2 px-2 text-left">
                    <span className="text-[#282828]">{site.status.websiteRole}</span>
                  </td>
                  <td className="py-2 px-2 text-left">
                    <span className="bg-green-200 text-green-600 py-1 px-2 rounded-full text-xs">
                      {site.status.websiteStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-left">
                    <span className="bg-orange-200 text-orange-600 py-1 px-2 rounded-full text-xs">
                      {site.status.performerStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-left">
                    <span className="bg-green-200 text-green-600 py-1 px-2 rounded-full text-xs">
                      {site.status.activityStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-left">${site.contentPlacementPrice}</td>
                  <td className="py-2 px-2 text-left">${site.contentCreationPlacementPrice}</td>
                  <td className="py-2 px-2 text-left">
                    {site.maxLinksAllowed > 0 ? "Eligible" : "Not Eligible"}
                  </td>
                  <td className="py-2 px-2 text-left">
                    <button className="bg-blue-500 text-white py-1 px-2 rounded">
                      <FaEye />
                    </button>
                  </td>
                  <td className="py-2 px-2 text-left">
                    <button className="bg-blue-500 text-white py-1 px-2 rounded">
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-2 px-2 text-left">
                    <button className="bg-red-500 text-white py-1 px-2 rounded">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 px-4 text-center">
                  No sites found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SitesTable;
