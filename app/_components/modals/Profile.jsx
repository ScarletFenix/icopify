import React from 'react';

const Profile = ({ user, toggleRole }) => {
  return (
    <div className="w-full bg-gray-100 p-6 mt-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-1 md:col-span-2 lg:col-span-1">
          <div className="bg-blue-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/path/to/profile-picture.jpg"
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-600">Username</label>
                  <p className="mt-1 text-lg text-gray-800 font-semibold">{user.username}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-lg text-gray-800 font-semibold">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">PayPal Email</label>
                <p className="mt-1 text-lg text-gray-800 font-semibold">{user.paypalEmail}</p>
              </div>
              <div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600 mr-2">{user.role === "buyer" ? "Buyer" : "Publisher"}</span>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="hidden" onChange={toggleRole} checked={user.role === "publisher"} />
                    <div className="relative">
                      <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${user.role === "publisher" ? "transform translate-x-full bg-blue-600" : ""}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Credentials Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-1 md:col-span-2 lg:col-span-1">
          <div className="bg-purple-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Username</label>
                <input type="text" defaultValue={user.username} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input type="email" defaultValue={user.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
              <button className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md shadow-md hover:bg-purple-600 transition duration-300">Update Profile</button>
            </div>
          </div>
        </div>

        {/* Password Update Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-1">
          <div className="bg-green-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Current Password</label>
                <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">New Password</label>
                <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
                <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
              </div>
              <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md shadow-md hover:bg-green-600 transition duration-300">Update Password</button>
            </div>
          </div>
        </div>

        {/* PayPal Account Info Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden col-span-1">
          <div className="bg-yellow-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">PayPal Account Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">PayPal Email</label>
                <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
              </div>
              <button className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-300">Update PayPal Info</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;