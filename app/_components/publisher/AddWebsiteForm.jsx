import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus, FaTimesCircle } from 'react-icons/fa';
import TermsAndConditions from '../modals/TermsAndConditions';
import WebsiteStatus from '../modals/WebsiteStatus';
import PublisherInstructions from '../modals/PublisherInstructions';

const AddWebsiteForm = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    url: '',
    domainAuthority: '',
    traffic: '',
    pricePerPost: '',
    linkType: 'DoFollow',
    maxLinksAllowed: '',
    wordsLimitArticle: '',
    contentPlacementPrice: '',
    contentCreationPlacementPrice: '',
    deliveryTime: '',
    guestUrl: '',
    specialRequirements: ''
  });

  const [showTncModal, setShowTncModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showInitialForm, setShowInitialForm] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);

  // When the alert is shown, automatically hide it after 5 seconds.
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (formData.siteName && formData.url) {
      setShowFullForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Website added successfully');
        setFormData({
          siteName: '',
          url: '',
          domainAuthority: '',
          traffic: '',
          pricePerPost: '',
          linkType: 'DoFollow',
          maxLinksAllowed: '',
          wordsLimitArticle: '',
          contentPlacementPrice: '',
          contentCreationPlacementPrice: '',
          deliveryTime: '',
          guestUrl: '',
          specialRequirements: ''
        });
        setShowInitialForm(false);
        setShowFullForm(false);
      } else {
        alert('Failed to add website');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full bg-white">
         {/* Website Status Bar */}
      <div className="px-4 py-2">
        <WebsiteStatus />
      </div>
       {/* Publisher Instructions (Drop-down) */}
       <PublisherInstructions  />
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
        <div className="flex justify-end">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="w-full max-w-5xl rounded-lg shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid gap-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Domain Authority <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter domain authority"
                      type="number"
                      name="domainAuthority"
                      value={formData.domainAuthority}
                      onChange={handleChange}
                      required
                      className="text-sm h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Traffic <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter traffic"
                      type="number"
                      name="traffic"
                      value={formData.traffic}
                      onChange={handleChange}
                      required
                      className="text-sm h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Price per Post <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        name="pricePerPost"
                        value={formData.pricePerPost}
                        onChange={handleChange}
                        required
                        className="text-sm h-10 pl-8"
                      />
                    </div>
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Max Links Allowed <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter number"
                      type="number"
                      name="maxLinksAllowed"
                      value={formData.maxLinksAllowed}
                      onChange={handleChange}
                      required
                      className="text-sm h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Words Limit for an Article <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter word limit"
                      type="number"
                      name="wordsLimitArticle"
                      value={formData.wordsLimitArticle}
                      onChange={handleChange}
                      required
                      className="text-sm h-10"
                    />
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
                        step="0.01"
                        name="contentPlacementPrice"
                        value={formData.contentPlacementPrice}
                        onChange={handleChange}
                        required
                        className="text-sm h-10 pl-8"
                      />
                    </div>
                  </div>
                </div>
                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Content Creation &amp; Placement Price
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        name="contentCreationPlacementPrice"
                        value={formData.contentCreationPlacementPrice}
                        onChange={handleChange}
                        className="text-sm h-10 pl-8"
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
                      <option value="12 to 24 hrs">12 to 24 hrs</option>
                      <option value="24 to 48 hrs">24 to 48 hrs</option>
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
                {/* Row 4: Link Type */}
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
                  <Button type="submit">Submit Website</Button>
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
