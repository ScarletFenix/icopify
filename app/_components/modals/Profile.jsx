import React, { useState, useEffect } from 'react';
import { FaPaypal, FaEye, FaEyeSlash } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    whatsapp: '',
    phoneNumber: '',
    paypalEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmPaypal, setConfirmPaypal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load user data from local storage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username || '',
        email: storedUser.email || '',
        facebook: storedUser.facebook || '',
        twitter: storedUser.twitter || '',
        linkedin: storedUser.linkedin || '',
        instagram: storedUser.instagram || '',
        whatsapp: storedUser.whatsapp || '',
        phoneNumber: storedUser.phoneNumber || '',
        paypalEmail: storedUser.paypalEmail || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, []);

  // Unified change handler for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update user profile information
  const updateUserProfile = async (updatedData) => {
    try {
      const jwt = localStorage.getItem('jwt');
      if (!user || !jwt) {
        throw new Error('User not logged in or JWT missing.');
      }
      const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`;
      const response = await axios.put(endpoint, updatedData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (response.data) {
        alert('Profile updated successfully!');
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(
        `Failed to update profile: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!confirmSave) {
      alert('Please confirm that the information provided is accurate.');
      return;
    }
    const updatedData = {
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    };
    await updateUserProfile(updatedData);
  };

  const handleUpdateSocialMedia = async (e) => {
    e.preventDefault();
    const updatedData = {
      facebook: formData.facebook,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      instagram: formData.instagram,
      whatsapp: formData.whatsapp,
    };
    await updateUserProfile(updatedData);
  };

  const handleUpdatePaypal = async (e) => {
    e.preventDefault();
    if (!confirmPaypal) {
      alert('Please confirm that the PayPal information provided is accurate.');
      return;
    }
    const updatedData = {
      paypalEmail: formData.paypalEmail,
    };
    await updateUserProfile(updatedData);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        throw new Error('JWT missing.');
      }
      const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/change-password`;
      const response = await axios.post(
        endpoint,
        {
          currentPassword: formData.currentPassword,
          password: formData.newPassword,
          passwordConfirmation: formData.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      if (response.data) {
        alert('Password updated successfully!');
        setFormData((prevData) => ({
          ...prevData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert(
        `Failed to update password: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="w-full bg-gray-100 p-6 mt-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
          <div className="bg-blue-500 h-2"></div>
          <div className="p-6">
            {/* Display User UID at the Top */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                User ID: <span className="font-semibold">#{user?.id}</span>
              </p>
            </div>
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <PhoneInput
                  country={'us'}
                  value={formData.phoneNumber}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, phoneNumber: value }))
                  }
                  inputClass="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={confirmSave}
                    onChange={(e) => setConfirmSave(e.target.checked)}
                    className="mr-2"
                  />
                  I confirm that the information provided is accurate
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                disabled={!confirmSave}
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Links Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
          <div className="bg-indigo-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Social Media Links</h2>
            <form onSubmit={handleUpdateSocialMedia} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  WhatsApp Number
                </label>
                <PhoneInput
                  country={'us'}
                  value={formData.whatsapp}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, whatsapp: value }))
                  }
                  inputClass="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebook"
                  placeholder="https://facebook.com"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Twitter URL
                </label>
                <input
                  type="url"
                  name="twitter"
                  placeholder="https://twitter.com"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagram"
                  placeholder="https://instagram.com"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md shadow-md hover:bg-indigo-600 transition duration-300"
              >
                Update Social Media Links
              </button>
            </form>
          </div>
        </div>

        {/* Password Update Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
          <div className="bg-green-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600">
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {/* Confirm New Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-md shadow-md hover:bg-green-600 transition duration-300"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* PayPal Account Info Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
          <div className="bg-yellow-500 h-2"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaPaypal className="w-6 h-6 text-blue-500 mr-2" />
              PayPal Account Info
            </h2>
            <form onSubmit={handleUpdatePaypal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  PayPal Email
                </label>
                <input
                  type="email"
                  name="paypalEmail"
                  placeholder="Your.Name@paypal.com"
                  value={formData.paypalEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={confirmPaypal}
                  onChange={(e) => setConfirmPaypal(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-600">
                  I confirm that the PayPal information provided is accurate
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
                disabled={!confirmPaypal}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
