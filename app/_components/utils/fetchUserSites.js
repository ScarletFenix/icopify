export const fetchUserSites = async (token, userId) => {
    try {
      console.log("Making API call with token:", token);
  
      const response = await fetch(
        `http://localhost:1337/api/sites?populate=status_site&filters[owner][id][$eq]=${userId}&filters[isDeleted][$eq]=false&fields[0]=url&fields[1]=contentPlacementPrice&fields[2]=contentCreationPlacementPrice&fields[3]=maxLinksAllowed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("Raw API response:", responseData); // Debugging
  
      const { data } = responseData;
  
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No valid site data received.");
        return [];
      }
  
      return data.map((site, index) => {
        if (!site || typeof site !== "object") {
          console.warn(`Skipping invalid site object at index ${index}:`, site);
          return null;
        }
  
        return {
          id: site.id,
          url: site.url, // ✅ Your API has `url` directly inside `data`, not `attributes`
          contentPlacementPrice: site.contentPlacementPrice,
          contentCreationPlacementPrice: site.contentCreationPlacementPrice,
          maxLinksAllowed: site.maxLinksAllowed,
          status: {
            websiteStatus: site.status_site?.website_status || "Unknown",
            performerStatus: site.status_site?.performer_status || "Unknown",
            activityStatus: site.status_site?.activity_status || "Unknown",
            websiteRole: site.status_site?.website_role || "Unknown",
          },
        };
      }).filter(site => site !== null);
    } catch (error) {
      console.error("Error fetching sites:", error);
      return [];
    }
  };
  