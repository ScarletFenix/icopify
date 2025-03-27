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
  });

  const [originalData, setOriginalData] = useState({});
  const [customValues, setCustomValues] = useState({
    customMaxLinks: "",
    customWordsLimit: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch site details when the modal is opened
  useEffect(() => {
    const fetchSiteDetails = async () => {
      if (!siteId) {
        console.error("Site ID is undefined.");
        setMessage({ type: "error", text: "Invalid site ID. Please try again." });
        onClose();
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

        if (!response.data) {
          throw new Error("Invalid site data received from the server.");
        }

        const siteData = response.data;
        setOriginalData(siteData);
        setFormData({
          siteName: siteData.siteName || "",
          url: siteData.url || "",
          maxLinksAllowed: siteData.maxLinksAllowed || "",
          wordsLimitArticle: siteData.wordsLimitArticle || "",
          deliveryTime: siteData.deliveryTime || "",
          guestUrl: siteData.guestUrl || "",
          specialRequirements: siteData.specialRequirements || "",
        });
      } catch (error) {
        console.error("❌ Error fetching site details:", error);
        setMessage({ type: "error", text: error.message || "Failed to fetch site details. Please try again." });
        onClose();
      }
    };

    fetchSiteDetails();
  }, [siteId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxLinksAllowed") {
      setFormData((prev) => ({
        ...prev,
        maxLinksAllowed: value === "3+" ? customValues.customMaxLinks : value,
      }));
      return;
    }

    if (name === "wordsLimitArticle") {
      setFormData((prev) => ({
        ...prev,
        wordsLimitArticle: value === "1000+" ? customValues.customWordsLimit : value,
      }));
      return;
    }

    if (name === "customMaxLinks") {
      setCustomValues((prev) => ({
        ...prev,
        customMaxLinks: value,
      }));
      setFormData((prev) => ({
        ...prev,
        maxLinksAllowed: value,
      }));
      return;
    }

    if (name === "customWordsLimit") {
      setCustomValues((prev) => ({
        ...prev,
        customWordsLimit: value,
      }));
      setFormData((prev) => ({
        ...prev,
        wordsLimitArticle: value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkForDuplicateUrl = async (url) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT token found. Please log in.");
  
      const response = await axios.get(
        `http://localhost:1337/api/sites?filters[url][$eq]=${url}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data?.data?.length > 0) {
        const existingSite = response.data.data[0];
        // Only return true if the duplicate URL belongs to a different site
        return existingSite.id !== siteId;
      }
      return false;
    } catch (error) {
      console.error("Error checking for duplicate URL:", error);
      setMessage({ type: "error", text: "Failed to check for duplicate URL. Please try again later." });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
  
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT token found. Please log in.");
  
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) throw new Error("User data is missing. Please log in again.");
  
      // Check if URL has changed and if the new URL already exists
      if (formData.url !== originalData.url) {
        const isDuplicate = await checkForDuplicateUrl(formData.url);
        if (isDuplicate) {
          setMessage({ type: "error", text: "This URL already exists for another site. Please use a different URL." });
          setIsSubmitting(false);
          return; // Stop further execution
        }
      }
  
      const siteResponse = await axios.get(
        `http://localhost:1337/api/sites/${siteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!siteResponse.data) {
        throw new Error("Invalid site data received from the server.");
      }
  
      const siteData = siteResponse.data;
      const siteOwnerId = siteData.owner?.id;
  
      if (siteOwnerId !== user.id && user.role.type.toLowerCase() !== "admin") {
        throw new Error("You do not have permission to update this site.");
      }
  
      // Prepare the payload with only the fields we want to update
      const payload = {
        data: {
          siteName: formData.siteName,
          url: formData.url,
          maxLinksAllowed: formData.maxLinksAllowed,
          wordsLimitArticle: formData.wordsLimitArticle,
          deliveryTime: formData.deliveryTime,
          guestUrl: formData.guestUrl,
          specialRequirements: formData.specialRequirements,
        },
      };
  
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
  
      if (updateResponse.status === 200) {
        setMessage({ type: "success", text: "Site updated successfully!" });
        onUpdate(updateResponse.data.data);
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      console.error("❌ Error updating site:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error?.message || error.message || "Failed to update site.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Site</h2>

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
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Site Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter site name"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                URL <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="https://example.com"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Max Links Allowed <span className="text-red-500">*</span>
              </label>
              <select
                name="maxLinksAllowed"
                value={formData.maxLinksAllowed === customValues.customMaxLinks ? "3+" : formData.maxLinksAllowed}
                onChange={handleChange}
                required
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Select limit</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3+">3+</option>
              </select>

              {formData.maxLinksAllowed === customValues.customMaxLinks && (
                <Input
                  type="number"
                  placeholder="Enter custom limit"
                  name="customMaxLinks"
                  value={customValues.customMaxLinks}
                  onChange={handleChange}
                  className="w-full mt-2"
                  min="3"
                  max="10"
                />
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Words Limit <span className="text-red-500">*</span>
              </label>
              <select
                name="wordsLimitArticle"
                value={formData.wordsLimitArticle === customValues.customWordsLimit ? "1000+" : formData.wordsLimitArticle}
                onChange={handleChange}
                required
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Select limit</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000+">1000+</option>
              </select>

              {formData.wordsLimitArticle === customValues.customWordsLimit && (
                <Input
                  type="number"
                  placeholder="Enter custom limit"
                  name="customWordsLimit"
                  value={customValues.customWordsLimit}
                  onChange={handleChange}
                  className="w-full mt-2"
                  min="1000"
                  max="5000"
                />
              )}
            </div>  

            <div>
              <label className="block text-sm font-medium">
                Delivery Time <span className="text-red-500">*</span>
              </label>
              <select
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                required
                className="w-full border rounded p-2 text-sm"
              >
                <option value="">Select time</option>
                <option value="1 to 2 days">1 to 2 days</option>
                <option value="2 to 3 days">2 to 3 days</option>
                <option value="3 to 5 days">3 to 5 days</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Guest URL <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="https://example.com"
                name="guestUrl"
                value={formData.guestUrl}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium">
              Special Requirements <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter special requirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

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