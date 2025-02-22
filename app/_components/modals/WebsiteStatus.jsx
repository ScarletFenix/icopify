import React from 'react';
import { FaHeart } from 'react-icons/fa';

const WebsiteStatus = () => {
  return (
    <div className="bg-[#2F5AA7] text-white p-4 rounded-md">
      {/* Header row with title and icon */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Your Stats...</h2>
        <FaHeart className="text-white" />
      </div>

      {/* Horizontal divider */}
      <hr className="border-white border-opacity-20 mb-4" />

      {/* Stats row */}
      <div className="grid grid-cols-6 gap-4 text-center">
        <div>
          <p className="text-sm">Websites Approved</p>
          <p className="text-lg font-bold">00</p>
        </div>
        <div>
          <p className="text-sm">Completion Rate</p>
          {/* "New" pill */}
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
