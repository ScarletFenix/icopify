import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEdit, FaTrash, FaPlay, FaPause } from "react-icons/fa";
import { fetchUserSites } from "../utils/fetchUserSites"; // Adjust the import path accordingly

const SitesTable = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [playing, setPlaying] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSites(sortedData);
      setFilteredSites(sortedData);
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

  const togglePlay = (id) => {
    setPlaying((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);

  return (
    <div className="bg-[#EDF2F9] p-4">
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
                    <span className="bg-green-200 text-green-600 py-1 px-2 rounded-full text-xs">
                      {site.status.websiteStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <span className="bg-orange-200 text-orange-600 py-1 px-2 rounded-full text-xs">
                      {site.status.performerStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <span className="bg-green-200 text-green-600 py-1 px-2 rounded-full text-xs">
                      {site.status.activityStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">${site.contentPlacementPrice}</td>
                  <td className="py-2 px-2 border-r border-gray-300">${site.contentCreationPlacementPrice}</td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    {site.maxLinksAllowed > 0 ? "Eligible" : "Not Eligible"}
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <button className="bg-blue-500 text-white py-1 px-2 rounded">
                      <FaEye />
                    </button>
                  </td>
                  <td className="py-2 px-2 border-r border-gray-300">
                    <button className="bg-blue-500 text-white py-1 px-2 rounded mr-1">
                      <FaEdit />
                    </button>
                    <button className="bg-red-500 text-white py-1 px-2 rounded">
                      <FaTrash />
                    </button>
                  </td>
                  <td className="py-2 px-2">
                    <button onClick={() => togglePlay(site.id)} className="bg-gray-500 text-white py-1 px-2 rounded">
                      {playing[site.id] ? <FaPause /> : <FaPlay />}
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
      <div className="flex justify-end mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className="px-3 py-1 border rounded bg-white hover:bg-gray-200">
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SitesTable;