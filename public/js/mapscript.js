// Initialize the Leaflet map
const map = L.map("map").setView([36.8, -4.5], 9); // Set initial view to a general location

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 16,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Define styles for normal and selected polygons
const defaultStyle = { color: "#3388ff", weight: 1 };
const selectedStyle = { color: "#ff7800", weight: 3 };

// Variable to store the currently selected layer
let selectedLayer = null;

function xmlLoader() {
  loadXML().then((xml) => {
    const properties = Array.from(xml.getElementsByTagName("property"));
    storeProperties(properties); // Store all properties initially
  });
}

// Add polygon to the map
fetch("malaga_towns.geojson")
  .then((response) => response.json())
  .then((data) => {
    // Add the GeoJSON layer to the map
    console.log("Polygons", data);

    L.geoJSON(data, {
      style: defaultStyle,
      onEachFeature: function (feature, layer) {
        // Add a click event to handle "selection" of polygons
        layer.on("click", function () {
          if (selectedLayer) {
            // Reset style for previously selected layer
            selectedLayer.setStyle(defaultStyle);
          }

          // Apply selected style to the clicked layer
          layer.setStyle(selectedStyle);
          selectedLayer = layer; // Store reference to the currently selected layer

          const munName = feature.properties.mun_name;
          console.log("Selected Municipality:", munName);

          // Filter properties by 'town' matching selected 'mun_name'
          const matchingProperties = propertyData.filter(
            (property) => property.town === munName
          );

          console.log(
            "Properties matching the selected town:",
            matchingProperties
          );

          // Generate popup content based on matching properties
          let popupContent = `<label class="popup-title">Properties in ${munName}</label class="popup-title"><br>`;

          if (matchingProperties.length > 0) {
            matchingProperties.forEach((property) => {
              popupContent += `

              <div class="popup-container" onclick="clicked()">
                <div class="property-type">${property.type}</div>
                <div class="property-price">${property.price}  ${property.currency}</div>
              </div>
              `;
            });
          } else {
            popupContent += "<br>No matching properties found.";
          }

          // Bind the generated content to the popup and open it
          layer.bindPopup(popupContent).openPopup();
        });
      },
    }).addTo(map);
  })
  .catch((error) => console.error("Error loading the GeoJSON file:", error));

// Delay marker plotting until `propertyData` is populated
setTimeout(xmlLoader, 1000); // Adjust delay as needed

function clicked() {
  console.log("hello");
}
