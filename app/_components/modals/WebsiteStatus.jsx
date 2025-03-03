import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { fetchUserSites } from "../utils/fetchUserSites";

const WebsiteStatus = () => {
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    const getApprovedSites = async () => {
      const jwt = localStorage.getItem("jwt");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!jwt || !user) {
        console.error("🔑 JWT or user missing.");
        return;
      }

      const userId = user.id;
      const data = await fetchUserSites(jwt, userId);

      if (!Array.isArray(data)) {
        console.warn("🚨 Invalid data format.");
        return;
      }

      // Count websites with "Approved" status
      const approvedSites = data.filter(
        (site) => site.status?.websiteStatus === "Approved"
      ).length;

      setApprovedCount(approvedSites);
    };

    getApprovedSites();
  }, []);

  return (
    <div className="bg-[#2F5AA7] text-white p-4 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Your Stats</h2>
        <FaHeart className="text-white" />
      </div>

      {/* Divider */}
      <hr className="border-white border-opacity-20 mb-4" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
        <div>
          <p className="text-sm">Websites Approved</p>
          <p className="text-lg font-bold">{approvedCount}</p>
        </div>
        <div>
          <p className="text-sm">Completion Rate</p>
          <span className="inline-block bg-green-200 text-green-800 px-2 py-1 text-xs rounded">
            New
          </span>
        </div>
        <div>
          <p className="text-sm">Tasks Completed</p>
          <p className="text-lg font-bold">00</p>
        </div>
        <div>
          <p className="text-sm">Tasks Rejected</p>
          <p className="text-lg font-bold">00</p>
        </div>
        <div>
          <p className="text-sm">Tasks In Progress</p>
          <p className="text-lg font-bold">00</p>
        </div>
        <div>
          <p className="text-sm">Tasks Awaiting</p>
          <p className="text-lg font-bold">00</p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteStatus;