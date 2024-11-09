let propertyData = [];

async function loadXML() {
  try {
    const response = await fetch("XML_dev.xml");
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
    date: property.getElementsByTagName("date")[0]?.textContent || "N/A",
    ref: property.getElementsByTagName("ref")[0]?.textContent || "N/A",
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
    location: {
      latitude:
        property.getElementsByTagName("latitude")[0]?.textContent || "N/A",
      longitude:
        property.getElementsByTagName("longitude")[0]?.textContent || "N/A",
    },
    beds: parseInt(property.getElementsByTagName("beds")[0]?.textContent) || 0,
    baths:
      parseInt(property.getElementsByTagName("baths")[0]?.textContent) || 0,
    surface_area: {
      built:
        parseFloat(property.getElementsByTagName("built")[0]?.textContent) || 0,
      plot:
        parseFloat(property.getElementsByTagName("plot")[0]?.textContent) || 0,
    },
    features: Array.from(property.getElementsByTagName("feature")).map(
      (feature) => feature.getElementsByTagName("en")[0]?.textContent || "N/A"
    ),
    desc:
      property.getElementsByTagName("desc")[0]?.getElementsByTagName("en")[0]
        ?.textContent || "N/A",
    title:
      property.getElementsByTagName("title")[0]?.getElementsByTagName("en")[0]
        ?.textContent || "N/A",
    images: Array.from(property.getElementsByTagName("image")).map(
      (image) => image.getElementsByTagName("url")[0]?.textContent || "N/A"
    ),
  }));
}

function storeProperties(properties) {
  propertyData = parsePropertyData(properties);
  return propertyData;
}

function updatePropertyCount(count) {
  const propertyCountSection = document.getElementById("propertyCountSection");
  const propertyCountElement = document.getElementById("propertyCount");

  if (count > 0) {
    propertyCountSection.style.display = "block";
    propertyCountElement.textContent = count;
  } else {
    propertyCountSection.style.display = "none";
  }
}

function filterProperties() {
  const type = document.getElementById("propertyType").value.toLowerCase();
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("maxPrice").value) || 10000000000;
  const minSize = parseFloat(document.getElementById("minSize").value) || 0;
  const maxSize =
    parseFloat(document.getElementById("maxSize").value) || Infinity;
  const bedrooms = parseInt(document.getElementById("bedrooms").value) || 0;
  const bathrooms = parseInt(document.getElementById("bathrooms").value) || 0;

  if (matchingProperties && matchingProperties.length > 0) {
    // Filter selected properties when polygons are selected
    const filtered = matchingProperties.filter((property) => {
      const matchesType = type === "" || property.type.toLowerCase() === type;
      const withinPrice =
        property.price >= minPrice && property.price <= maxPrice;
      const withinSize =
        property.surface_area.built >= minSize &&
        property.surface_area.built <= maxSize;
      const matchesBeds = bedrooms === 0 || property.beds === bedrooms;
      const matchesBaths = bathrooms === 0 || property.baths === bathrooms;

      return (
        matchesType && withinPrice && withinSize && matchesBeds && matchesBaths
      );
    });

    console.log("Filtered properties within selected polygons:", filtered);

    updatePropertyCount(filtered.length);
    generatePropertySearchLink(
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minSize
    );
  } else {
    // Handle case when polygons are not selected
    loadXML().then((xml) => {
      const properties = Array.from(xml.getElementsByTagName("property"));
      const filtered = properties.filter((p) => {
        const propertyType =
          p.getElementsByTagName("type")[0]?.textContent.toLowerCase() || "";
        const propertyPrice =
          parseFloat(p.getElementsByTagName("price")[0]?.textContent) || 0;
        const propertySize =
          parseFloat(p.getElementsByTagName("size")[0]?.textContent) || 0;
        const propertyBedrooms =
          parseInt(p.getElementsByTagName("beds")[0]?.textContent) || 0;
        const propertyBathrooms =
          parseInt(p.getElementsByTagName("baths")[0]?.textContent) || 0;

        return (
          (type === "" || propertyType.includes(type)) &&
          propertyPrice >= minPrice &&
          propertyPrice <= maxPrice &&
          propertySize >= minSize &&
          propertySize <= maxSize &&
          (bedrooms === 0 || propertyBedrooms === bedrooms) &&
          (bathrooms === 0 || propertyBathrooms === bathrooms)
        );
      });

      const storedProperties = storeProperties(filtered);
      console.log("Filtered properties stored:", storedProperties);
      updatePropertyCount(storedProperties.length);
      generatePropertySearchLink(
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        minSize
      );
    });
  }
}

// ***** Clear Filters Function *****
function clearFilters() {
  document.getElementById("propertyType").value = "";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("minSize").value = "";
  document.getElementById("maxSize").value = "";
  document.getElementById("bedrooms").value = "";
  document.getElementById("bathrooms").value = "";

  // Reset the displayed property count to 0
  updatePropertyCount(0);

  // Optionally, clear any filtered data or reset to default view
  console.log("Filters cleared. Form inputs reset.");
  clearMapwhenClearButtonClicked();
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
  const link =
    "https://costadelsolspecialist.com/property-search/?location%5B%5D=&search_location_1=&list_price_min=" +
    minPrice +
    "&list_price_max=" +
    maxPrice +
    "&bedrooms_min=" +
    bedrooms +
    "&bedrooms_max=&ref_no=&bathrooms_min=" +
    bathrooms +
    "&bathrooms_max=&build_size_min=" +
    minSize +
    "&plot_size_min=&plot_size_min=&listing_type=resale";

  // Create or update the button to browse the link
  let browseButton = document.getElementById("browseLinkButton");
  console.log("Generated link:", link);

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
async function initializeProperties() {
  const xml = await loadXML();
  if (!xml) return;

  const properties = Array.from(xml.getElementsByTagName("property"));
  storeProperties(properties);
  console.log("Initial properties stored:", propertyData);
}

// Initialize properties when the script loads
initializeProperties();

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

// const link =
// "https://costadelsolspecialist.com/property-search/?location%5B%5D=&search_location_1=&list_price_min=" +
// minPrice +
// "&list_price_max=" +
// maxPrice +
// "&bedrooms_min=" +
// bedroomsValue +
// "&bedrooms_max=&ref_no=&bathrooms_min=" +
// bathroomsValue +
// "&bathrooms_max=&build_size_min=" +
// minSize +
// "&plot_size_min=&plot_size_min=&listing_type=resale";
// window.open(link, "_blank");
