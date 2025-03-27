'use client'

import React from "react";
import { FaRegHeart, FaRegFlag, FaSearch, FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Lottie from "lottie-react";
import { useQuery } from "@tanstack/react-query";
import loadingAnimation from "@/public/animations/loading.json";

// Constants
const categories = [
  "automotive",
  "beauty",
  "business, e-business",
  "computer games",
  "construction",
  "cooking",
  "culture, art",
  "diet, weight loss",
  "entertainment",
  "fashion, clothes",
  "family, kids, pregnancy",
  "finance, banking & insurance",
  "health, medical",
  "home & garden, interior",
  "technology",
  "music",
  "real estate",
  "travel, tour, hotels",
  "sports, fitness",
  "agriculture and forestry",
  "wedding",
  "education, science",
  "dating, relationships",
  "food, drink",
  "e-commerce and shopping",
  "news and media",
  "pets",
  "films and TV",
  "jobs and career",
  "nature and hobbies"
];

const languages = {
  "English": ["🇬🇧", "Australia", "Bahrain", "Canada", "Ireland", "Jordan", "Morocco", "New Zealand", "Singapore", "UK", "UAE", "Thailand", "Malaysia"],
  "Chinese": ["🇨🇳", "China", "Hong Kong", "Taiwan"],
  "Korean": ["🇰🇷", "Republic of Korea"],
  "Japanese": ["🇯🇵", "Japan"],
  "Arabic": ["🇦🇪", "UAE", "Egypt", "Qatar", "Lebanon", "Kuwait", "Oman", "Yemen", "Morocco", "Kingdom of Saudi Arabia"],
  "Spanish": ["🇪🇸", "Spain", "Mexico", "Argentina", "Colombia", "Peru", "Chile", "Costa Rica", "Ecuador", "Venezuela", "Uruguay", "Cuba", "Bolivia", "Dominican Republic", "Guatemala", "Paraguay", "Honduras", "Panama"],
  "Portuguese": ["🇵🇹", "Angola", "Brazil", "Portugal"],
  "French": ["🇫🇷", "France", "Belgium", "Luxembourg", "Switzerland", "Algeria", "Mali", "Monaco", "Tunisia", "Togo"],
  "Russian": ["🇷🇺", "Russia", "Belarus", "Turkmenistan", "Kazakhstan"],
  "Ukrainian": ["🇺🇦", "Ukraine"],
  "Italian": ["🇮🇹", "Italy"],
  "Romanian": ["🇷🇴", "Romania"],
  "German": ["🇩🇪", "Austria", "Switzerland", "Luxembourg", "Germany", "Liechtenstein"],
  "Dutch": ["🇳🇱", "Netherlands", "Belgium"],
  "Turkish": ["🇹🇷", "Turkey"],
  "Serbian": ["🇷🇸", "Serbia", "Montenegro"],
  "Norwegian": ["🇳🇴", "Norway"],
  "Bulgarian": ["🇧🇬", "Bulgaria"],
  "Polish": ["🇵🇱", "Poland"],
  "Hungarian": ["🇭🇺", "Hungary"]
};

const PublisherList = () => {
  // Helper functions
  const getLanguageFlag = (language) => {
    if (!language) return "🌐";
    for (const [lang, data] of Object.entries(languages)) {
      if (language.toLowerCase().includes(lang.toLowerCase())) {
        return data[0];
      }
    }
    return "🌐";
  };

  // State
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [trafficFilter, setTrafficFilter] = React.useState("");
  const [drFilter, setDrFilter] = React.useState("");
  const [daFilter, setDaFilter] = React.useState("");
  const [languageFilter, setLanguageFilter] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  // Data fetching
  const { data: apiData, isLoading, error, refetch } = useQuery({
    queryKey: ['publisherData'],
    queryFn: async () => {
      const token = localStorage.getItem('jwt');
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch('http://localhost:1337/api/sites/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('jwt');
          throw new Error('Session expired');
        }
        throw new Error(`Failed to load data: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Data transformation
  const transformedData = React.useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data
      .filter(site => !site.isDeleted)
      .map(site => ({
        id: site.id,
        url: site.url?.replace(/^https?:\/\//, '') || "example.com",
        maxLinks: `${site.maxLinksAllowed || 0} ${site.linkType || ""} links`,
        turnaroundTime: site.deliveryTime || "Not specified",
        categories: site.categories?.split(',').map(cat => cat.trim()).filter(cat => cat) || [],
        traffic: site.traffic || 0,
        ahrefsDR: site.domainRating || 0,
        mozDA: site.domainAuthority || 0,
        spamScore: site.spamScore ? `${site.spamScore}%` : "0%",
        language: site.mobileLanguage || "English",
        languageFlag: getLanguageFlag(site.mobileLanguage),
        price: site.contentPlacementPrice ? `$${site.contentPlacementPrice.toFixed(2)}` : "$0.00"
      }));
  }, [apiData]);

  // Data filtering
  const filteredData = React.useMemo(() => {
    return transformedData.filter((site) => {
      if (searchTerm && !site.url.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (categoryFilter && !site.categories.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()))) return false;
      
      if (trafficFilter) {
        const [min, max] = trafficFilter.split("-").map(n => parseInt(n.replace(/,/g, "")));
        if (max && (site.traffic < min || site.traffic > max)) return false;
        if (!max && site.traffic < min) return false;
      }
      
      if (drFilter) {
        const [min, max] = drFilter.split("-").map(Number);
        if (max && (site.ahrefsDR < min || site.ahrefsDR > max)) return false;
        if (!max && site.ahrefsDR < min) return false;
      }
      
      if (daFilter) {
        const [min, max] = daFilter.split("-").map(Number);
        if (max && (site.mozDA < min || site.mozDA > max)) return false;
        if (!max && site.mozDA < min) return false;
      }
      
      if (languageFilter && !site.language.toLowerCase().includes(languageFilter.toLowerCase())) return false;
      
      return true;
    });
  }, [transformedData, searchTerm, categoryFilter, trafficFilter, drFilter, daFilter, languageFilter]);

  // UI components
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-32 h-32">
        <Lottie animationData={loadingAnimation} loop autoplay />
      </div>
      <p className="mt-4 text-gray-600">Loading publisher data...</p>
    </div>
  );

  const clearFilters = () => {
    setCategoryFilter("");
    setTrafficFilter("");
    setDrFilter("");
    setDaFilter("");
    setLanguageFilter("");
    setSearchTerm("");
  };

  const activeFilterCount = [
    categoryFilter,
    trafficFilter,
    drFilter,
    daFilter,
    languageFilter,
    searchTerm,
  ].filter(Boolean).length;

  // Render
  if (isLoading) return <LoadingAnimation />;
  
  if (error) {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg w-full text-center text-red-500">
        <p className="font-bold">Error loading data</p>
        <p>{error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg font-bold">
          Found: <span className="text-blue-500">{filteredData.length} Websites</span>
        </h2>
        
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-500 hover:underline flex items-center gap-1"
            >
              <IoMdClose /> Clear all filters ({activeFilterCount})
            </button>
          )}
          
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg text-blue-500"
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      {showMobileFilters && (
        <div className="sm:hidden bg-blue-50 p-3 rounded-lg mb-4 space-y-3">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <input
              type="text"
              placeholder="Search URL"
              className="outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-blue-500" />
          </div>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            {Object.keys(languages).map((language) => (
              <option key={language} value={language}>
                {language} {languages[language][0]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[800px] sm:min-w-0">
          <table className="w-full border border-gray-200 rounded-lg text-sm text-left">
            <thead className="bg-blue-50 hidden sm:table-header-group">
              <tr className="text-gray-600">
                <th className="p-3">
                  <div className="flex items-center gap-2">
                    URL
                    <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 w-full bg-white">
                      <input
                        type="text"
                        placeholder="Search URL"
                        className="outline-none w-full text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <FaSearch className="text-blue-500" />
                    </div>
                  </div>
                </th>

                <th className="p-3 w-[180px]">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full bg-white"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.length > 20 ? `${category.substring(0, 20)}...` : category}
                      </option>
                    ))}
                  </select>
                </th>

                <th className="p-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full bg-white"
                    value={trafficFilter}
                    onChange={(e) => setTrafficFilter(e.target.value)}
                  >
                    <option value="">Monthly Traffic</option>
                    <option value="0-10000">0 - 10,000</option>
                    <option value="10000-50000">10,000 - 50,000</option>
                    <option value="50000-100000">50,000 - 100,000</option>
                    <option value="100000">100,000+</option>
                  </select>
                </th>

                <th className="p-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full bg-white"
                    value={drFilter}
                    onChange={(e) => setDrFilter(e.target.value)}
                  >
                    <option value="">Ahrefs DR</option>
                    <option value="0-20">0 - 20</option>
                    <option value="20-40">20 - 40</option>
                    <option value="40-60">40 - 60</option>
                    <option value="60-80">60 - 80</option>
                    <option value="80">80+</option>
                  </select>
                </th>

                <th className="p-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full bg-white"
                    value={daFilter}
                    onChange={(e) => setDaFilter(e.target.value)}
                  >
                    <option value="">Moz DA</option>
                    <option value="0-20">0 - 20</option>
                    <option value="20-40">20 - 40</option>
                    <option value="40-60">40 - 60</option>
                    <option value="60-80">60 - 80</option>
                    <option value="80">80+</option>
                  </select>
                </th>

                <th className="p-3">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-full bg-white"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                  >
                    <option value="">Languages</option>
                    {Object.keys(languages).map((language) => (
                      <option key={language} value={language}>
                        {language} {languages[language][0]}
                      </option>
                    ))}
                  </select>
                </th>

                <th className="p-3">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm w-full transition-colors">
                    Verified Websites
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((site) => (
                  <tr
                    key={site.id}
                    className="border-t flex flex-col sm:table-row hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <a
                        href={`https://${site.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-bold hover:underline"
                      >
                        {site.url}
                      </a>
                      <div className="text-xs text-gray-500 mt-1">
                        ⭐ Max: {site.maxLinks} <br />
                        ⏳ Turnaround: {site.turnaroundTime}
                      </div>
                    </td>

                    <td className="p-3 w-[180px]">
                      <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">
                        {site.categories.map((category, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded whitespace-nowrap"
                            title={category}
                          >
                            {category.length > 15 ? `${category.substring(0, 15)}...` : category}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3 text-orange-500 sm:text-center">
                      <span className="flex items-center gap-1 sm:justify-center">
                        📈 {site.traffic.toLocaleString()}
                      </span>
                    </td>

                    <td className="p-3 sm:text-center">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs inline-block">
                        DR {site.ahrefsDR}
                      </span>
                    </td>

                    <td className="p-3 sm:text-center">
                      <span className="bg-blue-300 text-white px-2 py-1 rounded text-xs inline-block">
                        DA {site.mozDA}
                      </span>
                      <div className="text-xs text-green-600 mt-1">
                        Spam Score {site.spamScore}
                      </div>
                    </td>

                    <td className="p-3 sm:text-center">
                      <span className="flex items-center gap-1 sm:justify-center">
                        {site.languageFlag} {site.language}
                      </span>
                    </td>

                    <td className="p-3 sm:text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex rounded-md overflow-hidden shadow-sm">
                          <button className="bg-[#3c5a99] hover:bg-[#132238] text-white px-3 py-1 text-sm transition-colors">
                            Buy Now
                          </button>
                          <span className="bg-blue-500 text-white px-3 py-1 text-sm">
                            {site.price}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="bg-orange-100 border border-orange-200 p-2 rounded-md hover:bg-orange-200 transition-colors"
                            aria-label="Add to favorites"
                          >
                            <FaRegHeart className="text-orange-500" />
                          </button>

                          <button
                            className="bg-red-100 border border-red-200 p-2 rounded-md hover:bg-red-200 transition-colors"
                            aria-label="Remove"
                          >
                            <IoMdClose className="text-red-500" />
                          </button>

                          <button
                            className="bg-yellow-100 border border-yellow-200 p-2 rounded-md hover:bg-yellow-200 transition-colors"
                            aria-label="Report"
                          >
                            <FaRegFlag className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No websites found matching your filters. Try adjusting your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublisherList;