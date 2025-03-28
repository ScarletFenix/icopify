import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FaPlus, FaTimesCircle, FaTimes } from 'react-icons/fa';
import TermsAndConditions from '../modals/TermsAndConditions';
import WebsiteStatus from '../modals/WebsiteStatus';
import PublisherInstructions from '../modals/PublisherInstructions';
import { TiInfoLarge } from 'react-icons/ti';
import axios from 'axios';

// Define languageCountryMap
const languageCountryMap = {
  English: ["USA", "Australia", "Bahrain", "Canada", "Ireland", "Jordan", "Morocco", "New Zealand", "Singapore", "United Kingdom", "UAE", "Thailand", "Malaysia"],
  Chinese: ["China", "Hong Kong", "Taiwan"],
  Korean: ["Republic of Korea"],
  Japanese: ["Japan"],
  Arabic: ["UAE", "Egypt", "Qatar", "Lebanon", "Kuwait", "Oman", "Yemen", "Morocco", "Kingdom of Saudi Arabia"],
  Spanish: ["Spain", "Mexico", "Argentina", "Colombia", "Peru", "Chile", "Costa Rica", "Ecuador", "Venezuela", "Uruguay", "Cuba", "Bolivia", "Dominican Republic", "Guatemala", "Paraguay", "Honduras", "Panama"],
  Portuguese: ["Angola", "Brazil", "Portugal"],
  French: ["France", "Belgium", "Luxembourg", "Switzerland", "Algeria", "Mali", "Monaco", "Tunisia", "Togo"],
  Russian: ["Russia", "Belarus", "Turkmenistan", "Kazakhstan"],
  Ukrainian: ["Ukraine"],
  Italian: ["Italy"],
  Romanian: ["Romania"],
  German: ["Austria", "Switzerland", "Luxembourg", "Germany", "Liechtenstein"],
  Dutch: ["Netherlands", "Belgium"],
  Turkish: ["Turkey"],
  Serbian: ["Serbia", "Montenegro"],
  Norwegian: ["Norway"],
  Bulgarian: ["Bulgaria"],
  Polish: ["Poland"],
  Hungarian: ["Hungary"]
};

// Reusable Message Component
const Message = ({ type, message, onClose }) => {
  let backgroundColor, textColor, borderColor;

  switch (type) {
    case 'success':
      backgroundColor = 'bg-green-100';
      textColor = 'text-green-700';
      borderColor = 'border-green-500';
      break;
    case 'error':
      backgroundColor = 'bg-red-100';
      textColor = 'text-red-700';
      borderColor = 'border-red-500';
      break;
    case 'warning':
      backgroundColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      borderColor = 'border-yellow-500';
      break;
    default:
      backgroundColor = 'bg-gray-100';
      textColor = 'text-gray-700';
      borderColor = 'border-gray-500';
  }

  return (
    <div className={`${backgroundColor} border-l-4 ${borderColor} ${textColor} p-4 rounded mb-4 relative`}>
      <p className="text-sm">{message}</p>
      <button
        onClick={onClose}
        className="absolute top-1 right-2 hover:text-gray-900"
      >
        <FaTimesCircle />
      </button>
    </div>
  );
};

const AddWebsiteForm = () => {
  // Predefined list of categories
  const predefinedCategories = [
    'automotive',
    'beauty',
    'business, E-business',
    'computer games',
    'construction',
    'cooking',
    'culture, art',
    'diet, weight loss',
    'entertainment',
    'fashion, clothes',
    'family, kids, pregnancy',
    'finance, banking & insurance',
    'health, medical',
    'home & garden, interior',
    'technology',
    'music',
    'real estate',
    'travel, tour, hotels',
    'sports, fitness',
    'agriculture and forestry',
    'wedding',
    'education, science',
    'dating, relationships',
    'food, drink',
    'e-commerce and shopping',
    'news and media',
    'pets',
    'films and TV',
    'jobs and career',
    'nature and hobbies',
  ];

  const [formData, setFormData] = useState({
    siteName: '',
    url: '',
    linkType: 'DoFollow',
    maxLinksAllowed: '',
    wordsLimitArticle: '',
    contentPlacementPrice: '',
    contentCreationPlacementPrice: '',
    deliveryTime: '',
    guestUrl: '',
    specialRequirements: '',
    categories: [], // Store as array
    mobileLanguage: '',
    sponsoredContent: false,
    country: '', // Add country field
  });

  const [showTncModal, setShowTncModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(predefinedCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCategoryInputFocused, setIsCategoryInputFocused] = useState(false);
  const [message, setMessage] = useState(null); // State for custom messages
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [showFullForm, setShowFullForm] = useState(false); // Toggle between initial and full form
  const [isExistingSite, setIsExistingSite] = useState(false); // Track if the site already exists globally


  const [customValues, setCustomValues] = useState({
    customMaxLinks: "",
    customWordsLimit: "",
  });

  // Retrieve user ID from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id);
      console.log('User ID from localStorage:', storedUser.id);
    } else {
      console.error('No user found in localStorage');
    }
  }, []);

  // Automatically hide the alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Automatically hide the custom message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Function to display a custom message
  const showMessage = (type, message) => {
    setMessage({ type, message });
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData({
      siteName: '',
      url: '',
      linkType: 'DoFollow',
      maxLinksAllowed: '',
      wordsLimitArticle: '',
      contentPlacementPrice: '',
      contentCreationPlacementPrice: '',
      deliveryTime: '',
      guestUrl: '',
      specialRequirements: '',
      categories: [],
      mobileLanguage: '',
      sponsoredContent: false,
      country: '',
    });

    setSelectedCategories([]);
    setShowFullForm(false);
    setShowForm(false); // Hide the form
    setIsExistingSite(false); // Reset existing site flag
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "maxLinksAllowed") {
      setFormData((prev) => ({
        ...prev,
        maxLinksAllowed: value,
      }));
      return;
    }

    if (name === "wordsLimitArticle") {
      setFormData((prev) => ({
        ...prev,
        wordsLimitArticle: value,
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

  const handleAddWebsiteClick = () => {
    setShowTncModal(true);
    setShowAlert(false);
  };

  const handleAcceptTnc = () => {
    setShowTncModal(false);
    setShowForm(true); // Show the form after accepting T&C
  };

  const handleDeclineTnc = () => {
    setShowTncModal(false);
    setShowAlert(true);
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    console.log('handleInitialSubmit called');

    const url = formData.url.trim().replace(/\/+$/, '').toLowerCase();
    console.log('Normalized URL:', url);

    const urlPattern = /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-z]{2,}([\/?#].*)?$/i;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        showMessage('error', 'Please enter a complete URL starting with http:// or https://');
        return;
    }

    if (!urlPattern.test(url)) {
        showMessage('error', 'Please enter a valid URL with a proper domain name.');
        return;
    }

    if (!formData.siteName || !formData.url) {
        showMessage('error', 'Please fill in all required fields.');
        return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
        showMessage('error', 'You are not authorized. Please log in first.');
        return;
    }

    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites?filters[url][$eq]=${url}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const existingSite = res.data?.data?.[0];

        if (existingSite) {
            const siteDetails = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites/${existingSite.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const siteData = siteDetails.data;

            // 🚫 Block submission if `isDeleted` is true for the current user
            if (siteData.isDeleted && siteData.owner.id === userId) {
                showMessage('error', 'This site has been deleted and cannot be added again.');
                return;
            }

            // 🚫 Prevent duplicate entry for the same user
            if (siteData.owner.id === userId) {
                showMessage('error', 'This site already exists in your account. You cannot add a duplicate site.');
                return;
            }

            // 🌍 For all users: Pre-fill language & country and disable fields
            setFormData((prev) => ({
                ...prev,
                mobileLanguage: siteData.mobileLanguage,
                country: siteData.country,
            }));

            setIsExistingSite(true);
            setShowFullForm(true);
            showMessage('info', 'Language and country have been pre-filled and disabled for this site.');
            return;
        }

        // 🌟 If no site exists, proceed with full form
        setShowFullForm(true);
    } catch (error) {
        console.error('Error checking URL:', error.response?.data || error.message);
        showMessage('error', 'An error occurred while checking the URL. Please try again.');
    }
};


  
  
  
  const handleCategoryInputChange = (e) => {
    const inputValue = e.target.value;
    setCategoryInput(inputValue);

    if (inputValue) {
      const filtered = predefinedCategories.filter((category) =>
        category.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(predefinedCategories);
    }
  };

  const handleAddCategory = (e, categoryFromDropdown = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const newCategory = categoryFromDropdown || categoryInput.trim();

    if (selectedCategories.includes(newCategory)) {
      showMessage('error', 'This category is already selected.');
      return;
    }

    if (!predefinedCategories.includes(newCategory)) {
      showMessage('error', 'This category is not valid.');
      return;
    }

    setSelectedCategories((prev) => [...prev, newCategory]);
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));

    setCategoryInput('');
    setFilteredCategories(predefinedCategories);
  };

  const handleRemoveCategory = (category) => {
    const updatedCategories = selectedCategories.filter((c) => c !== category);
    setSelectedCategories(updatedCategories);
    setFormData((prev) => ({
      ...prev,
      categories: updatedCategories,
    }));
  };

  const validateFormData = () => {
    const requiredFields = [
      'siteName',
      'url',
      'maxLinksAllowed',
      'wordsLimitArticle',
      'contentPlacementPrice',
      'deliveryTime',
      'guestUrl',
      'specialRequirements',
      'categories',
      'mobileLanguage',
      'country',
    ];

    for (const field of requiredFields) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        showMessage('error', `Please fill in the ${field} field.`);
        return false;
      }
    }

    if (formData.categories.length < 3) {
      showMessage('error', 'Please select at least 3 categories.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('jwt');
    if (!token) {
      showMessage('error', 'You are not authorized. Please log in first.');
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      showMessage('error', 'User ID is missing. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      data: {
        ...formData,
        categories: formData.categories.join(','),
        owner: userId,
        contentCreationPlacementPrice: formData.contentCreationPlacementPrice || null,
        country: formData.country, // Include country in payload
      },
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        showMessage('success', 'Website added successfully');
        resetForm(); // Reset form after successful submission
      } else {
        console.error('Error response:', res.data);
        showMessage('error', `Failed to add website: ${res.data?.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      showMessage('error', 'An error occurred while adding the website.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Message Display */}
      {message && (
        <div className="px-4 py-2">
          <Message
            type={message.type}
            message={message.message}
            onClose={() => setMessage(null)}
          />
        </div>
      )}

      {/* Add Website Form */}
      <div className="mt-3 w-full px-4">
        {showAlert && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4 relative">
            <p className="text-sm">
              To add a website, you must accept our Terms &amp; Conditions.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-1 right-2 text-yellow-700 hover:text-yellow-900"
            >
              <FaTimesCircle />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <p className="text-[#2F5AA7] font-bold text-lg">
              You can add up to <span className="text-red-600">500</span> websites to your account.
            </p>
            <div className="relative group">
              <TiInfoLarge className="text-red-600 bg-[#FED7AA] p-1 rounded-full cursor-pointer" size={20} />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-[#282828] text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                If you think you need more websites, <br /> please contact support.
              </div>
            </div>
          </div>
          <Button
            onClick={handleAddWebsiteClick}
            className="bg-orange-500 hover:bg-gradient-to-r from-orange-500 to-red-500 text-[#282828] flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add New Website</span>
          </Button>
        </div>

        {/* Terms & Conditions Modal */}
        {showTncModal && (
          <TermsAndConditions onAccept={handleAcceptTnc} onDecline={handleDeclineTnc} />
        )}

        {/* Initial Form (Inline) */}
        {showForm && !showFullForm && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">
                Site Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter site name"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className="text-sm h-10"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">
                URL <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="https://example.com"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="text-sm h-10"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleInitialSubmit}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Full Form (3 Fields per Row) */}
        {showFullForm && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid gap-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                  <label className="block text-sm font-medium">
              Max Links Allowed <span className="text-red-500">*</span>
            </label>
            <select
              name="maxLinksAllowed"
              value={formData.maxLinksAllowed}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 text-sm"
            >
              <option value="">Select limit</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3+">3+</option>
            </select>

            {formData.maxLinksAllowed === "3+" && (
              <Input
                type="number"
                placeholder="Enter custom limit"
                name="customMaxLinks"
                value={customValues.customMaxLinks}
                onChange={handleChange}
                className="w-full mt-2"
                min="3"
              />
            )}
                  </div>
                  <div>
                  <label className="block text-sm font-medium">
              Words Limit <span className="text-red-500">*</span>
            </label>
            <select
              name="wordsLimitArticle"
              value={formData.wordsLimitArticle}
              onChange={handleChange}
              required
              className="w-full border rounded p-2 text-sm"
            >
              <option value="">Select limit</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="1000+">1000+</option>
            </select>

            {formData.wordsLimitArticle === "1000+" && (
              <Input
                type="number"
                placeholder="Enter custom limit"
                name="customWordsLimit"
                value={customValues.customWordsLimit}
                onChange={handleChange}
                className="w-full mt-2"
                min="1000"
              />
            )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Content Placement Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="1"
                        name="contentPlacementPrice"
                        value={formData.contentPlacementPrice}
                        onChange={handleChange}
                        required
                        className="text-sm h-10 pl-8"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Content Creation &amp; Placement Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        placeholder="Leave this empty if you don't write content."
                        type="number"
                        step="1"
                        name="contentCreationPlacementPrice"
                        value={formData.contentCreationPlacementPrice}
                        onChange={handleChange}
                        className="text-sm h-10 pl-8 placeholder:text-xs"
                        min="0"
                      />
                    </div>
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
                      className="text-sm h-10 border border-gray-300 rounded w-full"
                    >
                      <option value="">Select delivery time</option>
                      <option value="1 to 2 days">1 to 2 days</option>
                      <option value="2 to 3 days">2 to 3 days</option>
                      <option value="3 to 5 days">3 to 5 days</option>
                      <option value="1 week">1 week</option>
                      <option value="2 weeks">2 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Guest Post Example URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="https://example.com"
                      name="guestUrl"
                      value={formData.guestUrl}
                      onChange={handleChange}
                      required
                      className="text-sm h-10"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mobileLanguage"
                      value={formData.mobileLanguage}
                      onChange={handleChange}
                      required
                      className="text-sm h-10 border border-gray-300 rounded w-full"
                      disabled={isExistingSite} // Disable if site exists
                    >
                      <option value="">Select language</option>
                      {Object.keys(languageCountryMap).map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="text-sm h-10 border border-gray-300 rounded w-full"
                      disabled={isExistingSite} // Disable if site exists
                    >
                      <option value="">Select country</option>
                      {formData.mobileLanguage && languageCountryMap[formData.mobileLanguage]?.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Categories */}
                <div>
                  <label className="block text-sm font-medium">
                    Select Categories (up to 3) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{category}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-2 text-gray-600 hover:text-gray-900"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search or add a category"
                      value={categoryInput}
                      onChange={handleCategoryInputChange}
                      onKeyDown={handleAddCategory}
                      onFocus={() => setIsCategoryInputFocused(true)}
                      onBlur={() => setTimeout(() => setIsCategoryInputFocused(false), 200)}
                      className="text-sm h-10"
                    />
                    {isCategoryInputFocused && filteredCategories.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <div
                            key={category}
                            onClick={(e) => handleAddCategory(e, category)}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 5: Special Requirements */}
                <div>
                  <label className="block text-sm font-medium">
                    Special Requirements <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Enter any special requirements..."
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    required
                    className="text-sm h-24"
                  />
                </div>

                {/* Row 5: Sponsored Content */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="sponsoredContent"
                    checked={formData.sponsoredContent}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">
                    Mark content as sponsored?
                  </label>
                  <div className="relative group">
                    <TiInfoLarge className="text-gray-500 cursor-pointer" size={16} />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                      bg-[#282828] text-white text-xs rounded py-1 px-2 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Check mark if the content is marked as sponsored
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Website'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddWebsiteForm;