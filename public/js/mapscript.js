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

// Initialize the drawn items layer and add it to the map
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize Leaflet Draw control
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
  },
  draw: {
    polygon: {
      allowIntersection: false, // Prevent the user from creating intersecting polygons
    },
    rectangle: false, // Disable rectangle drawing
    // circle: false, // Disable circle drawing
    marker: false, // Disable marker drawing
    polyline: false, // Disable polyline drawing
  },
});
map.addControl(drawControl);

// Handle the creation of a new polygon
map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;
  drawnItems.addLayer(layer);

  // Check for intersections with GeoJSON polygons
  const drawnPolygon = layer.toGeoJSON();
  const selectedProperties = [];

  //  >>>>>>>>>>>  selection logic <<<<<<<<<<<<

  // If there are selected properties, print their details
  if (selectedProperties.length > 0) {
    console.log("Selected Properties:");
    selectedProperties.forEach((layer) => {
      const properties = layer.feature.properties;
      console.log(
        `Municipality: ${properties.mun_name}, Type: ${properties.type}, Price: ${properties.price}`
      );
    });
  } else {
    console.log("No properties found within the drawn polygon.");
  }
});

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
          let popupContent = `<label class="popup-title">${munName} Town</label class="popup-title"><br>
          <div class="popup-description">${matchingProperties.length}  Properties </div>
          <div class="popup-container">
          `;

          if (matchingProperties.length > 0) {
            matchingProperties.forEach((property) => {
              popupContent += `

              <div class="popup-rows" onclick="clicked()">
                <div class="property-type">${property.type}</div>
                <div class="property-price">${property.price}  ${property.currency}</div>
              </div>
              `;
            });
          } else {
            popupContent += "<br>No matching properties found.";
          }

          popupContent += `</div>`;

          // Bind the generated content to the popup and open it
          layer.bindPopup(popupContent).openPopup();
        });
      },
    }).addTo(map);
  })
  .catch((error) => console.error("Error loading the GeoJSON file:", error));

// Delay marker plotting until `propertyData` is populated
setTimeout(xmlLoader, 1000); // Adjust delay as needed

// bind popup list item on click function
function clicked() {
  console.log("test");
}
