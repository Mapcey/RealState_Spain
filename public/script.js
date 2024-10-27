// public/script.js

// Initialize the Leaflet map
const map = L.map("map").setView([51.505, -0.09], 13); // Set initial coordinates and zoom level

// Add a tile layer to the map (using OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

async function loadXML() {
  const response = await fetch('XML_Feeds_for_areas.xml'); // Ensure the path is correct
  const xmlText = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(xmlText, 'application/xml');
}

function storeProperties(properties) {
  const propertyData = [];
  properties.forEach(property => {
      propertyData.push({
          id: property.getElementsByTagName("id")[0]?.textContent || "N/A",
          date: property.getElementsByTagName("date")[0]?.textContent || "N/A",
          ref: property.getElementsByTagName("ref")[0]?.textContent || "N/A",
          price: parseFloat(property.getElementsByTagName("price")[0]?.textContent) || 0,
          currency: property.getElementsByTagName("currency")[0]?.textContent || "N/A",
          price_freq: property.getElementsByTagName("price_freq")[0]?.textContent || "N/A",
          new_build: property.getElementsByTagName("new_build")[0]?.textContent || "N/A",
          type: property.getElementsByTagName("type")[0]?.textContent || "N/A",
          town: property.getElementsByTagName("town")[0]?.textContent || "N/A",
          province: property.getElementsByTagName("province")[0]?.textContent || "N/A",
          location: {
              latitude: property.getElementsByTagName("latitude")[0]?.textContent || "N/A",
              longitude: property.getElementsByTagName("longitude")[0]?.textContent || "N/A"
          },
          beds: parseInt(property.getElementsByTagName("beds")[0]?.textContent) || 0,
          baths: parseInt(property.getElementsByTagName("baths")[0]?.textContent) || 0,
          surface_area: {
              built: parseFloat(property.getElementsByTagName("built")[0]?.textContent) || 0,
              plot: parseFloat(property.getElementsByTagName("plot")[0]?.textContent) || 0
          },
          features: Array.from(property.getElementsByTagName("feature")).map(feature => feature.getElementsByTagName("en")[0]?.textContent || "N/A"),
          desc: property.getElementsByTagName("desc")[0]?.getElementsByTagName("en")[0]?.textContent || "N/A",
          title: property.getElementsByTagName("title")[0]?.getElementsByTagName("en")[0]?.textContent || "N/A",
          images: Array.from(property.getElementsByTagName("image")).map(image => image.getElementsByTagName("url")[0]?.textContent || "N/A")
      });
  });
  console.log(propertyData); // Logging the stored properties
  return propertyData; // Returning the property data
}

function filterProperties() {
  const type = document.getElementById('propertyType').value.toLowerCase();
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
  const minSize = parseFloat(document.getElementById('minSize').value) || 0;
  const maxSize = parseFloat(document.getElementById('maxSize').value) || Infinity;
  const bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
  const bathrooms = parseInt(document.getElementById('bathrooms').value) || 0;

  loadXML().then(xml => {
      const properties = Array.from(xml.getElementsByTagName('property'));

      const filtered = properties.filter(p => {
          const propertyType = p.getElementsByTagName('type')[0]?.textContent.toLowerCase() || '';
          const propertyPrice = parseFloat(p.getElementsByTagName('price')[0]?.textContent) || 0;
          const propertySize = parseFloat(p.getElementsByTagName('size')[0]?.textContent) || 0;
          const propertyBedrooms = parseInt(p.getElementsByTagName('beds')[0]?.textContent) || 0;
          const propertyBathrooms = parseInt(p.getElementsByTagName('baths')[0]?.textContent) || 0;

          return (
              (type === '' || propertyType.includes(type)) &&
              (propertyPrice >= minPrice && propertyPrice <= maxPrice) &&
              (propertySize >= minSize && propertySize <= maxSize) &&
              (bedrooms === 0 || propertyBedrooms === bedrooms) &&
              (bathrooms === 0 || propertyBathrooms === bathrooms)
          );
      });

      // Store the filtered properties
      const storedProperties = storeProperties(filtered);
      console.log('Filtered properties stored:', storedProperties); // You can see the stored properties in the console
  });
}

// Load properties initially
loadXML().then(xml => {
  const properties = Array.from(xml.getElementsByTagName('property'));
  
  // Store all properties initially
  const initialStoredProperties = storeProperties(properties);
  console.log('Initial properties stored:', initialStoredProperties); // Log initial properties
});
