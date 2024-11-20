let propertyData = [];

// ***************** FETCH XML *********************
async function loadXML() {
  try {
    // const response = await fetch("XML_dev.xml");
    const response = await fetch("XML_Feeds_for_areas.xml");
    const xmlText = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "application/xml");
  } catch (error) {
    console.error("Failed to load XML:", error);
  }
}

function parsePropertyData(properties) {
  return properties.map((property) => ({
    id: property.getElementsByTagName("id")[0]?.textContent || "N/A",
    price:
      parseFloat(property.getElementsByTagName("price")[0]?.textContent) || 0,
    currency:
      property.getElementsByTagName("currency")[0]?.textContent || "N/A",
    price_freq:
      property.getElementsByTagName("price_freq")[0]?.textContent || "N/A",
    new_build:
      property.getElementsByTagName("new_build")[0]?.textContent || "N/A",
    type: property.getElementsByTagName("type")[0]?.textContent || "N/A",
    town: property.getElementsByTagName("town")[0]?.textContent || "N/A",
    province:
      property.getElementsByTagName("province")[0]?.textContent || "N/A",
    beds: parseInt(property.getElementsByTagName("beds")[0]?.textContent) || 0,
    baths:
      parseInt(property.getElementsByTagName("baths")[0]?.textContent) || 0,
    surface_area: {
      built:
        parseFloat(property.getElementsByTagName("built")[0]?.textContent) || 0,
      plot:
        parseFloat(property.getElementsByTagName("plot")[0]?.textContent) || 0,
    },
  }));
}

function storeProperties(properties) {
  propertyData = parsePropertyData(properties);
  return propertyData;
}

async function initializeProperties() {
  const xml = await loadXML();
  if (!xml) return;
  const properties = Array.from(xml.getElementsByTagName("property"));
  storeProperties(properties);
  console.log("Initial properties stored:", propertyData.length);
}
// Initialize properties when the script loads
initializeProperties();

// ********* GET SELECTED PROPERTY ARRAY *********
function getSelectedPropertyTypes() {
  // Get all checkboxes inside the dropdown
  const checkboxes = document
    .getElementById("propertyType")
    .querySelectorAll('input[type="checkbox"]');

  // Filter checked checkboxes and get their values
  const selectedTypes = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value.toLowerCase());

  // console.log(selectedTypes); // For debugging
  return selectedTypes;
}

// ********** DATA FILTER **********
function filterProperties() {
  const selectedTypes = getSelectedPropertyTypes();
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("maxPrice").value) || 10000000000;
  const minSize = parseFloat(document.getElementById("minSize").value) || 0;
  const maxSize =
    parseFloat(document.getElementById("maxSize").value) || Infinity;
  const bedrooms = parseInt(document.getElementById("bedrooms").value) || 0;
  const bathrooms = parseInt(document.getElementById("bathrooms").value) || 0;

  console.log(matchingProperties);

  // ----------- IF POLYGON HAS SELECTED ----------------
  if (matchingProperties && matchingProperties.length > 0) {
    const filtered = matchingProperties.filter((property) => {
      const propertyType = property.type.toLowerCase();
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(propertyType);
      const withinPrice =
        property.price >= minPrice && property.price <= maxPrice;
      const withinSize =
        property.surface_area.built >= minSize &&
        property.surface_area.built <= maxSize;
      const matchesBeds = bedrooms === 0 || property.beds >= bedrooms;
      const matchesBaths = bathrooms === 0 || property.baths >= bathrooms;

      return (
        matchesType && withinPrice && withinSize && matchesBeds && matchesBaths
      );
    });

    console.log("Filtered from selected polygons:", filtered);

    updatePropertyCount(filtered.length);
    generatePropertySearchLink(
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minSize
    );
  } else {
    // ----------- IF POLYGON HAS NOT SELECTED ----------------
    loadXML().then((xml) => {
      const properties = Array.from(xml.getElementsByTagName("property"));
      const filtered = properties.filter((property) => {
        const propertyTypes = Array.from(
          property.getElementsByTagName("type")
        ).map((typeNode) => typeNode.textContent.toLowerCase());
        const propertyPrice =
          parseFloat(property.getElementsByTagName("price")[0]?.textContent) ||
          0;
        const propertySize =
          parseFloat(property.getElementsByTagName("built")[0]?.textContent) ||
          0;
        const propertyBedrooms =
          parseInt(property.getElementsByTagName("beds")[0]?.textContent) || 0;
        const propertyBathrooms =
          parseInt(property.getElementsByTagName("baths")[0]?.textContent) || 0;

        return (
          (selectedTypes.length === 0 ||
            propertyTypes.some((propertyType) =>
              selectedTypes.includes(propertyType)
            )) &&
          propertyPrice >= minPrice &&
          propertyPrice <= maxPrice &&
          propertySize >= minSize &&
          propertySize <= maxSize &&
          (bedrooms === 0 || propertyBedrooms >= bedrooms) &&
          (bathrooms === 0 || propertyBathrooms >= bathrooms)
        );
      });

      const storedProperties = storeProperties(filtered);

      console.log("Filtered without polygon:", storedProperties);

      updatePropertyCount(storedProperties.length);

      generatePropertySearchLink(
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        minSize
      );

      // reset
      storeProperties(properties);
    });
  }
}
function updatePropertyCount(count, isClear) {
  const propertyCountSection = document.getElementById("propertyCountSection");
  const propertyCountElement = document.getElementById("propertyCount");
  const noPropertiesMessage = document.getElementById("noPropertiesMessage");

  if (count > 0) {
    document.querySelector(".property-count-container").style.display = "flex";
    propertyCountSection.style.visibility = "visible";
    propertyCountElement.textContent = count;
    noPropertiesMessage.style.visibility = "hidden"; // Hide the "No properties found" message
  } else if (count == 0 && isClear) {
    propertyCountSection.style.visibility = "hidden";
    propertyCountElement.textContent = count;
    noPropertiesMessage.style.visibility = "hidden"; // Hide the "No properties found" message
  } else {
    document.querySelector(".property-count-container").style.display = "flex";
    propertyCountSection.style.visibility = "visible";
    propertyCountElement.textContent = count;
    document.querySelector("#noPropertiesMessage").style.display = "flex";
    noPropertiesMessage.style.visibility = "visible"; // Show the "No properties found" message
  }
}

// ***** Clear Filters Function *****
function clearFilters() {
  // Loop through each checkbox and uncheck it
  document.querySelectorAll("#propertyType .checkbox").forEach((checkbox) => {
    checkbox.checked = false;
  });

  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("minSize").value = "";
  document.getElementById("maxSize").value = "";
  document.getElementById("bedrooms").value = "";
  document.getElementById("bathrooms").value = "";
  // Reset the displayed property count to 0
  updatePropertyCount(0, true);

  clearMapwhenClearButtonClicked();

  // Optionally, clear any filtered data or reset to default view
  console.log("Filters cleared. Form inputs reset.");
  // location.reload();

  console.log("properties after clear filter:", propertyData.length);
}

// Attach the clearFilters function to the button click event
document
  .getElementById("clearFiltersButton")
  .addEventListener("click", clearFilters);

// Function to generate the property search link
function generatePropertySearchLink(
  minPrice,
  maxPrice,
  bedrooms,
  bathrooms,
  minSize
) {
  const selectedTypes = getSelectedPropertyTypes();

  const typeQuery = selectedTypes
    .map((type) => `type%5B%5D=${encodeURIComponent(type)}`)
    .join("&");

  const locationQuery = selectedPolygonIds
    .map((id) => `location%5B%5D=${encodeURIComponent(id)}`)
    .join("&");

  const link =
    "https://costadelsolspecialist.com/property-search/?" +
    locationQuery +
    "&search_location_1=&list_price_min=" +
    minPrice +
    "&list_price_max=" +
    maxPrice +
    "&" +
    typeQuery +
    "&bedrooms_min=" +
    bedrooms +
    "&bedrooms_max=&ref_no=&bathrooms_min=" +
    bathrooms +
    "&bathrooms_max=&build_size_min=" +
    minSize +
    "&plot_size_min=&plot_size_min=&listing_type=";

  // console.log(link);

  // Create or update the button to browse the link
  let browseButton = document.getElementById("browseLinkButton");

  if (!browseButton) {
    // Create a new button if it doesn't exist
    browseButton = document.createElement("button");
    browseButton.id = "browseLinkButton";
    browseButton.textContent = "Browse Properties";
    browseButton.onclick = () => window.open(link, "_blank");
    document.body.appendChild(browseButton); // Append to the body or a specific section
  }

  // Set the button's link (if you want to update its behavior)
  browseButton.onclick = () => window.open(link, "_blank");
  browseButton.style.display = "inline"; // Show the button
}

// https://costadelsolspecialist.com/
// property-search/
// ?location%5B%5D=
// &search_location_1=
// &list_price_min=100000&list_price_max=50000000
// &bedrooms_min=&bedrooms_max=
// &ref_no=
// &bathrooms_min=&bathrooms_max=
// &build_size_min=
// &plot_size_min=&plot_size_min=
// &listing_type=resale

// https://costadelsolspecialist.com/
// property-search/
// ?location%5B%5D=74
// &search_location_1=74
// &list_price_min=100000&list_price_max=50000000
// &bedrooms_min=2&bedrooms_max=5
// &ref_no=
// &bathrooms_min=1&bathrooms_max=4
// &build_size_min=100
// &plot_size_min=50&plot_size_min=150
// &features%5B%5D=28
// &listing_type=resale
