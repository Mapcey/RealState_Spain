// Initialize the Leaflet map
const map = L.map("map").setView([36.8, -4.5], 7);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 16,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Define styles for normal and selected polygons
const defaultStyle = { color: "#3388ff", weight: 1 };
const selectedStyle = { color: "#ff7800", weight: 3 };
const zeroPropertyStyle = { color: "#6b6b6b", weight: 0 };

// Variable to store selected layers and matching properties
let selectedLayers = new Map();
let matchingProperties = [];
let selectedPolygonIds = []; // Store selected polygon IDs

document.getElementById("filter-button").addEventListener("click", () => {
  // Assuming 'filtered' is updated with new property data elsewhere in the app
  updateLabels(); // Recalculate and update labels with filtered data
});

function updateLabels() {
  selectedLayers.forEach((layer, munName) => {
    let propertyCount = 0; // Initialize count variable
    let labelClass = "default-label";

    if (filtered.length > 0 || isFiltered) {
      console.log("for filtered properties");
      // Count only properties related to this municipality in the filtered array
      const associatedCities = getAssociatedCities(munName);
      propertyCount = filtered.filter(
        (property) =>
          property.town === munName || associatedCities.includes(property.town)
      ).length;
      labelClass = "filtered-label";
    } else {
      console.log("for all properties");
      // If no filter is applied, count properties from all data
      const associatedCities = getAssociatedCities(munName);
      propertyCount = allPropertyData.filter(
        (property) =>
          property.town === munName || associatedCities.includes(property.town)
      ).length;
    }

    // Remove existing tooltip if present
    if (layer.label) {
      layer.unbindTooltip();
    }

    // Bind a tooltip as a label with updated count
    layer.bindTooltip(`<span class="${labelClass}">${propertyCount}</span>`, {
      className: "property-label-tooltip",
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

// timeout untill polygon data load from xml
setTimeout(() => {
  // Add polygons to the map
  fetch("malanga_towns.geojson")
    .then((response) => response.json())
    .then((data) => {
      const geojsonLayer = L.geoJSON(data, {
        style: function (feature) {
          const munName = feature.properties.mun_name;
          const associatedCities = getAssociatedCities(munName);
          if (!isLoading) {
          }
          // Calculate the number of properties for this municipality
          const propertiesForMun = allPropertyData.filter((property) => {
            return (
              property.town === munName ||
              associatedCities.includes(property.town)
            );
          });

          // Apply zero-property style if no properties found
          if (propertiesForMun.length === 0) {
            return zeroPropertyStyle;
          } else {
            return defaultStyle;
          }
        },

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

              // Get properties for both the municipality and its associated cities
              const associatedCities = getAssociatedCities(munName);
              const propertiesForMun = allPropertyData.filter((property) => {
                return (
                  property.town === munName ||
                  associatedCities.includes(property.town)
                );
              });

              layer.propertiesCount = propertiesForMun.length;
              console.log(propertiesForMun.length);

              if (propertiesForMun.length) {
                layer.setStyle(selectedStyle);
                selectedLayers.set(munName, layer);
                matchingProperties = [
                  ...matchingProperties,
                  ...propertiesForMun,
                ];
                selectedPolygonIds.push(polygonId);
              }
            }

            // console.log("Selected Polygon IDs:", selectedPolygonIds);
            updateLabels(); // Update labels for all selected polygons
          });
        },
      }).addTo(map);

      map.fitBounds(geojsonLayer.getBounds(), {
        animate: true,
        duration: 2, // Animation duration in seconds
      });
    })
    .catch((error) => console.error("Error loading the GeoJSON file:", error));
}, 1000); // Adjust timing for your actual data fetching

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
    matchingProperties.length = 0;
  });

  // Reset selected polygon IDs when clearing
  selectedPolygonIds = [];
  console.log("Selected Polygon IDs after clearing:", selectedPolygonIds);
}

// Load property data after a delay
// setTimeout(xmlLoader, 1000); // Adjust delay as needed
