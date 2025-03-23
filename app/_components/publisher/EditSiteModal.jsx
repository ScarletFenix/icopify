import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const EditSiteModal = ({ siteId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    siteName: "",
    url: "",
    maxLinksAllowed: "",
    wordsLimitArticle: "",
    deliveryTime: "",
    guestUrl: "",
    specialRequirements: "",
    categories: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); // State for custom messages

  // Fetch site details when the modal is opened
  useEffect(() => {
    const fetchSiteDetails = async () => {
      if (!siteId) {
        console.error("Site ID is undefined.");
        setMessage({ type: "error", text: "Invalid site ID. Please try again." });
        onClose(); // Close the modal if siteId is undefined
        return;
      }

      try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("No JWT token found. Please log in.");

        const response = await axios.get(
          `http://localhost:1337/api/sites/${siteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Debugging: Log the API response
        console.log("API Response:", response.data);

        // Check if the response data is valid
        if (!response.data) {
          throw new Error("Invalid site data received from the server.");
        }

        const siteData = response.data;

        // Populate the form with the fetched site data
        setFormData({
          siteName: siteData.siteName || "",
          url: siteData.url || "",
          maxLinksAllowed: siteData.maxLinksAllowed || "",
          wordsLimitArticle: siteData.wordsLimitArticle || "",
          deliveryTime: siteData.deliveryTime || "",
          guestUrl: siteData.guestUrl || "",
          specialRequirements: siteData.specialRequirements || "",
          categories: siteData.categories?.split(",") || [],
        });
      } catch (error) {
        console.error("❌ Error fetching site details:", error);
        setMessage({ type: "error", text: error.message || "Failed to fetch site details. Please try again." });
        onClose(); // Close the modal if there's an error
      }
    };

    fetchSiteDetails();
  }, [siteId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" }); // Clear any previous messages

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT token found. Please log in.");

      // Fetch the current user's ID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) throw new Error("User data is missing. Please log in again.");

      // Fetch the site details to verify ownership
      const siteResponse = await axios.get(
        `http://localhost:1337/api/sites/${siteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Check if the response data is valid
      if (!siteResponse.data) {
        throw new Error("Invalid site data received from the server.");
      }

      const siteData = siteResponse.data;
      const siteOwnerId = siteData.owner?.id;

      // Verify that the logged-in user is the owner of the site
      if (siteOwnerId !== user.id && user.role.type.toLowerCase() !== "admin") {
        throw new Error("You do not have permission to update this site.");
      }

      // Prepare the payload
      const payload = {
        data: {
          ...formData,
          categories: formData.categories.join(","), // Convert array to string
        },
      };

      // Debugging: Log the payload
      console.log("Payload:", payload);

      // Update the site
      const updateResponse = await axios.put(
        `http://localhost:1337/api/sites/${siteId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Debugging: Log the response
      console.log("Update Response:", updateResponse);

      if (updateResponse.status === 200) {
        setMessage({ type: "success", text: "Site updated successfully!" });
        onUpdate(updateResponse.data.data); // Notify parent component of the update
        setTimeout(() => onClose(), 1500); // Close the modal after 1.5 seconds
      }
    } catch (error) {
      console.error("❌ Error updating site:", error);

      // Handle 403 Forbidden error
      if (error.response?.status === 403) {
        setMessage({ type: "error", text: "You do not have permission to update this site." });
      } else {
        setMessage({
          type: "error",
          text: error.response?.data?.error?.message || error.message || "Failed to update site.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Site</h2>

        {/* Display Message */}
        {message.text && (
          <div
            className={`p-3 mb-4 rounded ${
              message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Three Input Fields in a Row */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Site Name"
              placeholder="Enter site name"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              required
            />
            <Input
              label="URL"
              placeholder="Enter site URL"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
            />
            <Input
              label="Max Links Allowed"
              placeholder="Enter max links allowed"
              name="maxLinksAllowed"
              value={formData.maxLinksAllowed}
              onChange={handleChange}
              type="number"
              required
            />
          </div>

          {/* Three Input Fields in a Row */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Words Limit for Article"
              placeholder="Enter words limit"
              name="wordsLimitArticle"
              value={formData.wordsLimitArticle}
              onChange={handleChange}
              type="number"
              required
            />
            <Input
              label="Delivery Time"
              placeholder="Enter delivery time"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              required
            />
            <Input
              label="Guest Post Example URL"
              placeholder="Enter guest post URL"
              name="guestUrl"
              value={formData.guestUrl}
              onChange={handleChange}
              required
            />
          </div>

          {/* Textarea for Special Requirements */}
          <Textarea
            label="Special Requirements"
            placeholder="Enter special requirements"
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            required
          />

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSiteModal;