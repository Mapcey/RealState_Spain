// Initialize the Leaflet map
const map = L.map("map").setView([36.5, -4.5], 10); // Set initial view to a general location

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Function to add markers once `propertyData` is ready
function addMarkersToMap() {
  if (!propertyData || propertyData.length === 0) {
    console.warn("No property data available to plot.");
    return;
  }

  propertyData.forEach((property) => {
    const lat = parseFloat(property.location.latitude);
    const lon = parseFloat(property.location.longitude);

    // Check if latitude and longitude are valid numbers
    if (!isNaN(lat) && !isNaN(lon)) {
      // Create a marker for each property
      const marker = L.marker([lat, lon]).addTo(map);

      // Bind a popup with relevant property info
      marker.bindPopup(`
                <div class="popup-container">
                    <div class="popup-title">${property.title}</div>
                    <div class="popup-body">
                        <div class="popup-data-fields">
                            <label> Price:</label>
                            ${property.price} ${property.currency}
                        </div>
                        <div class="popup-data-fields">
                            <label> Type:</label>
                            ${property.type}
                        </div>
                        <div class="popup-data-fields">
                            <label> Beds:</label>
                            ${property.beds}

                            <label> Baths:</label>
                            ${property.baths}
                         </div>
                    <div class="popup-data-description">${property.desc}</div>
                </div>
            </div>

<!--
                <b class="title">${property.title}</b><br>
                Price: ${property.price} ${property.currency}<br>
                Type: ${property.type}<br>
                Beds: ${property.beds}, Baths: ${property.baths}<br>
                ${property.desc}
-->
            `);
    }
  });
}

// Delay marker plotting until `propertyData` is populated
setTimeout(addMarkersToMap, 1000); // Adjust delay as needed
