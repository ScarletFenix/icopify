import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus, FaTimesCircle, FaTimes } from 'react-icons/fa';
import TermsAndConditions from '../modals/TermsAndConditions';
import WebsiteStatus from '../modals/WebsiteStatus';
import PublisherInstructions from '../modals/PublisherInstructions';
import { TiInfoLarge } from "react-icons/ti";

const AddWebsiteForm = () => {
  // Predefined list of categories
  const predefinedCategories = [
    'automotive',
    'beauty',
    'business, company, e-business',
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
    pricePerPost: '',
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
  });

  const [showTncModal, setShowTncModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showInitialForm, setShowInitialForm] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(predefinedCategories); // Initialize with all categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Store selected categories
  const [isCategoryInputFocused, setIsCategoryInputFocused] = useState(false); // Track focus state



  // Retrieve user ID from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserId(storedUser.id);
      console.log('User ID from localStorage:', storedUser.id); // Debugging
    } else {
      console.error('No user found in localStorage'); // Debugging
    }
  }, []);

  // Automatically hide the alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === "number") {
      // Allow the field to be empty
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }
  
      // Convert to a floating-point number
      const numericValue = parseFloat(value);
  
      // Prevent negative numbers
      if (isNaN(numericValue) || numericValue < 0) {
        return;
      }
  
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue, // Store as number
      }));
      return;
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  

  const handleAddWebsiteClick = () => {
    setShowTncModal(true);
    setShowAlert(false);
  };

  const handleAcceptTnc = () => {
    setShowTncModal(false);
    setShowInitialForm(true);
  };

  const handleDeclineTnc = () => {
    setShowTncModal(false);
    setShowAlert(true);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
  
    // Validate URL
    const url = formData.url.trim();
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('Please enter a complete URL starting with http:// or https://');
      return;
    }
  
    if (!urlPattern.test(url)) {
      alert('Please enter a valid URL with a proper domain name.');
      return;
    }
  
    // Check if siteName and URL are filled
    if (formData.siteName && formData.url) {
      setShowFullForm(true);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // Filter categories based on user input
  const handleCategoryInputChange = (e) => {
    const inputValue = e.target.value;
    setCategoryInput(inputValue);

    if (inputValue) {
      const filtered = predefinedCategories.filter((category) =>
        category.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(predefinedCategories); // Reset to all categories if input is empty
    }
  };

  // Add a category when selected or pressed Enter
  const handleAddCategory = (e, categoryFromDropdown = null) => {
    // If the event is from a click, prevent default behavior
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  
    // Use the category from the dropdown if provided, otherwise use the input value
    const newCategory = categoryFromDropdown || categoryInput.trim();
  
    // Check if the category is already selected
    if (selectedCategories.includes(newCategory)) {
      alert('This category is already selected.');
      return;
    }
  
    // Check if the category exists in the predefined list
    if (!predefinedCategories.includes(newCategory)) {
      alert('This category is not valid.');
      return;
    }
  
    // Add category to selected categories
    setSelectedCategories((prev) => [...prev, newCategory]);
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  
    // Clear input and reset filtered categories
    setCategoryInput('');
    setFilteredCategories(predefinedCategories);
  };

  // Remove a category
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
      'pricePerPost',
      'maxLinksAllowed',
      'wordsLimitArticle',
      'contentPlacementPrice',
      'deliveryTime',
      'guestUrl',
      'specialRequirements',
      'categories',
      'mobileLanguage',
    ];

    for (const field of requiredFields) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        alert(`Please fill in the ${field} field.`);
        return false;
      }
    }

    // Ensure at least 3 categories are selected
    if (formData.categories.length < 3) {
      alert('Please select at least 3 categories.');
      return false;
    }

    // Additional validation for specific fields
    if (isNaN(formData.pricePerPost)) {
      alert('Price per Post must be a number.');
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
    console.log('JWT from localStorage:', token); // Debugging

    if (!token) {
      alert('You are not authorized. Please log in first.');
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      alert('User ID is missing. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      data: {
        ...formData,
        categories: formData.categories.join(','), // Convert array to string
        owner: userId,
      },
    };

    console.log('Payload being sent:', payload); // Debugging

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', res.status); // Debugging

      if (res.ok) {
        alert('Website added successfully');
        setFormData({
          siteName: '',
          url: '',
          pricePerPost: '',
          linkType: 'DoFollow',
          maxLinksAllowed: '',
          wordsLimitArticle: '',
          contentPlacementPrice: '',
          contentCreationPlacementPrice: '',
          deliveryTime: '',
          guestUrl: '',
          specialRequirements: '',
          categories: [], // Reset to empty array
          mobileLanguage: '',
          sponsoredContent: false,
        });
        setSelectedCategories([]); // Clear selected categories
        setShowInitialForm(false);
        setShowFullForm(false);
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData); // Debugging
        alert(`Failed to add website: ${errorData?.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error); // Debugging
      alert('An error occurred while adding the website.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white ">
      {/* Website Status Bar */}
      <div className="px-4 py-2">
        <WebsiteStatus />
        {/* Publisher Instructions (Drop-down) */}
      <PublisherInstructions />
      </div>

      

      <div className="mt-3 w-full px-4">
        {showAlert && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4  relative">
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

  {/* Tooltip Wrapper (Only for Icon) */}
  <div className="relative group">
  <TiInfoLarge className="text-red-600 bg-[#FED7AA] p-1 rounded-full cursor-pointer" size={20} />

    {/* Tooltip (Shows only when icon is hovered) */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
      bg-[#282828] text-white text-xs rounded py-1 px-2 opacity-0 
      group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
      </div>

      {/* Terms & Conditions Modal */}
      {showTncModal && (
        <TermsAndConditions
          onAccept={handleAcceptTnc}
          onDecline={handleDeclineTnc}
        />
      )}

      {/* Initial Form Popout */}
{showInitialForm && !showFullForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <Card className="w-full max-w-md rounded-lg shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleInitialSubmit} className="grid gap-4">
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
              className="text-sm h-10"
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
              className="text-sm h-10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please enter a complete URL starting with http:// or https://
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowInitialForm(false);
                setShowFullForm(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
)}

      {/* Full Form Popout */}
      {showFullForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 mt-10">
          <Card className="w-full max-w-5xl rounded-lg shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid gap-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Price per Post <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      {/* Price per Post */}
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="1"
                          name="pricePerPost"
                          value={formData.pricePerPost}
                          onChange={handleChange}
                          required
                          className="text-sm h-10 pl-8"
                          min="0"
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Max Links Allowed <span className="text-red-500">*</span>
                    </label>
                    {/* Max Links Allowed */}
                      <Input
                        placeholder="Enter number"
                        type="number"
                        name="maxLinksAllowed"
                        value={formData.maxLinksAllowed}
                        onChange={handleChange}
                        required
                        className="text-sm h-10"
                        min="0"
                        step="1"
                      />
                  </div>
                  <div>
  <label className="block text-sm font-medium">
    Words Limit for an Article <span className="text-red-500">*</span>
  </label>
  <select
    name="wordsLimitArticle"
    value={formData.wordsLimitArticle}
    onChange={handleChange}
    required
    className="text-sm h-10 border border-gray-300 rounded w-full"
  >
    <option value="">Select word limit</option>
    <option value="250">250</option>
    <option value="500">500</option>
    <option value="1000+">1000+</option>
  </select>
  {formData.wordsLimitArticle === '1000+' && (
    <Input
      type="number"
      placeholder="Enter custom word limit"
      name="wordsLimitArticle"
      value={formData.wordsLimitArticle === '1000+' ? '' : formData.wordsLimitArticle}
      onChange={handleChange}
      className="text-sm h-10 mt-2"
      min="1000"
    />
  )}
</div>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Content Placement Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      {/* Content Placement Price */}
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="1"
                          name="contentPlacementPrice"
                          value={formData.contentPlacementPrice}
                          onChange={handleChange}
                          required
                          className="text-sm h-10 pl-8"
                          min="0"
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Content Creation &amp; Placement Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      {/* Content Creation & Placement Price */}
                        <Input
                          placeholder="Leave this empty if you don't write content."
                          type="number"
                          step="1"
                          name="contentCreationPlacementPrice"
                          value={formData.contentCreationPlacementPrice}
                          onChange={handleChange}
                          className="text-sm h-10 pl-8"
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
                </div>
                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium">
                      Link Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="linkType"
                      value={formData.linkType}
                      onChange={handleChange}
                      required
                      className="text-sm h-10 border border-gray-300 rounded w-full"
                    >
                      <option value="DoFollow">DoFollow</option>
                      <option value="NoFollow">NoFollow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Mobile Language <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mobileLanguage"
                      value={formData.mobileLanguage}
                      onChange={handleChange}
                      required
                      className="text-sm h-10 border border-gray-300 rounded w-full"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
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
                      onBlur={() => setTimeout(() => setIsCategoryInputFocused(false), 200)} // Delay to allow click on dropdown
                      className="text-sm h-10"
                    />
                    {isCategoryInputFocused && filteredCategories.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <div
                            key={category}
                            onClick={(e) => {
                              handleAddCategory(e, category); // Pass the selected category
                            }}
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
                {/* Row 6: Sponsored Content */}
                <div>
                  <label className="block text-sm font-medium">
                    Mark content as sponsored?
                  </label>
                  <input
                    type="checkbox"
                    name="sponsoredContent"
                    checked={formData.sponsoredContent}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Yes</label>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFullForm(false);
                      setShowInitialForm(false);
                    }}
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
        </div>
      )}
    </div>
  );
};

export default AddWebsiteForm;