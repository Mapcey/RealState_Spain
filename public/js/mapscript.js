// Initialize the Leaflet map
const map = L.map("map").setView([36.8, -4.5], 9);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 16,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Define styles for normal and selected polygons
const defaultStyle = { color: "#3388ff", weight: 1 };
const selectedStyle = { color: "#ff7800", weight: 3 };

// Variable to store selected layers and matching properties
let selectedLayers = new Map();
let matchingProperties = [];
let selectedPolygonIds = []; // Store selected polygon IDs

// Load XML and store property data
function xmlLoader() {
  loadXML().then((xml) => {
    const properties = Array.from(xml.getElementsByTagName("property"));
    storeProperties(properties); // Store all properties initially
  });
}

function updateLabels() {
  selectedLayers.forEach((layer, munName) => {
    const propertyCount = layer.propertiesCount;

    // Remove existing tooltip if present
    if (layer.label) {
      layer.unbindTooltip();
    }

    // Bind a tooltip as a label
    layer.bindTooltip(`${propertyCount}`, {
      className: "property-label-tooltip", // Define your CSS for tooltip
      permanent: true,
      direction: "center",
      opacity: 0.9,
    });

    layer.openTooltip(); // Keep it visible like a label
    layer.label = layer.getTooltip(); // Save reference to the tooltip
  });
}

function getAssociatedCities(munName) {
  return municipalityCityMapping[munName] || [];
}

// Add polygons to the map
fetch("malaga_towns.geojson")
  .then((response) => response.json())
  .then((data) => {
    L.geoJSON(data, {
      style: defaultStyle,
      onEachFeature: function (feature, layer) {
        const munName = feature.properties.mun_name;
        const polygonId = feature.properties.id;

        // Click event for selecting/deselecting polygons
        layer.on("click", function () {
          if (selectedLayers.has(munName)) {
            // Deselect if already selected
            layer.setStyle(defaultStyle);
            map.removeLayer(selectedLayers.get(munName).label);
            selectedLayers.delete(munName);

            // Remove properties related to this polygon from `matchingProperties`
            matchingProperties = matchingProperties.filter((property) => {
              const associatedCities = getAssociatedCities(munName);
              return (
                !associatedCities.includes(property.town) &&
                property.town !== munName
              );
            });

            selectedPolygonIds = selectedPolygonIds.filter(
              (id) => id !== polygonId
            );
          } else {
            // Select the polygon and style it
            layer.setStyle(selectedStyle);

            // Get properties for both the municipality and its associated cities
            const associatedCities = getAssociatedCities(munName);
            const propertiesForMun = propertyData.filter((property) => {
              return (
                property.town === munName ||
                associatedCities.includes(property.town)
              );
            });

            layer.propertiesCount = propertiesForMun.length;
            selectedLayers.set(munName, layer);
            matchingProperties = [...matchingProperties, ...propertiesForMun];
            selectedPolygonIds.push(polygonId);
          }

          console.log("Selected Polygon IDs:", selectedPolygonIds);
          updateLabels(); // Update labels for all selected polygons
        });
      },
    }).addTo(map);
  })
  .catch((error) => console.error("Error loading the GeoJSON file:", error));

function clearMapwhenClearButtonClicked() {
  selectedLayers.forEach((layer, munName) => {
    // Reset the layer style to default
    layer.setStyle(defaultStyle);

    // Remove the label if it exists
    if (layer.label) {
      map.removeLayer(layer.label);
      layer.unbindTooltip();
    }

    // Remove this layer from the selectedLayers map
    selectedLayers.delete(munName);

    // Filter out properties related to this polygon from matchingProperties
    matchingProperties = matchingProperties.filter(
      (property) => property.town !== munName
    );
  });

  // Reset selected polygon IDs when clearing
  selectedPolygonIds = [];
  console.log("Selected Polygon IDs after clearing:", selectedPolygonIds);
}

// Load property data after a delay
setTimeout(xmlLoader, 1000); // Adjust delay as needed
