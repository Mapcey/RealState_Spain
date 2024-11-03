// ******************** Get all available types > dropdown ***********************
async function loadXML() {
  const response = await fetch("XML_Feeds_for_areas.xml");
  const xmlText = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(xmlText, "application/xml");
}

function getUniquePropertyTypes(properties) {
  const types = new Set(); // Use a Set to store unique types

  properties.forEach((property) => {
    const type = property.getElementsByTagName("type")[0]?.textContent || "N/A";
    if (type !== "N/A") types.add(type); // Add only valid types
  });

  return Array.from(types); // Convert Set to Array for use in dropdown
}
function categorizePropertyTypes(types) {
  const categories = {
    residentialProperties: [
      "Villa",
      "Bungalow",
      "Semi-Detached House",
      "Townhouse",
      "Finca - Cortijo",
      "Apartment",
      "Middle Floor Apartment",
      "Top Floor Apartment",
      "Ground Floor Apartment",
      "Duplex",
      "Penthouse",
      "Penthouse Duplex",
      "Apartment Complex",
      "Top Floor Studio",
      "Middle Floor Studio",
      "Ground Floor Studio",
      "Residential Plot"
    ],
    hospitalityAndLodging: [
      "Hotel",
      "Aparthotel",
      "B&B",
      "Hostel",
      "Restaurant",
      "Campsite"
    ],
    commercialProperties: [
      "Business",
      "Commercial Premises",
      "Garage"
    ]
  };
  
  // Initialize categorizedTypes with the defined categories and an "other" category
  const categorizedTypes = {
    residentialProperties: [],
    hospitalityAndLodging: [],
    commercialProperties: [],
    other: []
  };

  // Categorize each type
  types.forEach((type) => {
    if (categories.residentialProperties.includes(type)) {
      categorizedTypes.residentialProperties.push(type);
    } else if (categories.hospitalityAndLodging.includes(type)) {
      categorizedTypes.hospitalityAndLodging.push(type);
    } else if (categories.commercialProperties.includes(type)) {
      categorizedTypes.commercialProperties.push(type);
    } else {
      categorizedTypes.other.push(type);
    }
  });

  return categorizedTypes;
}

function populatePropertyTypeDropdown(categorizedTypes) {
  const dropdown = document.getElementById("propertyType");

  // Clear existing options
  dropdown.innerHTML = '<option value="">Any</option>';

  // Helper function to add options under an optgroup
  function addOptionsToGroup(groupName, types) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = groupName;

    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      optgroup.appendChild(option);
    });

    dropdown.appendChild(optgroup);
  }

  // Populate dropdown with categorized types
  addOptionsToGroup("Residential Properties", categorizedTypes.residentialProperties);
  addOptionsToGroup("Hospitality and Lodging", categorizedTypes.hospitalityAndLodging);
  addOptionsToGroup("Commercial Properties", categorizedTypes.commercialProperties);
  addOptionsToGroup("Other Types", categorizedTypes.other);
}

// Load XML and populate dropdown
loadXML().then((xml) => {
  const properties = Array.from(xml.getElementsByTagName("property"));
  const uniqueTypes = getUniquePropertyTypes(properties);
  const categorizedTypes = categorizePropertyTypes(uniqueTypes);
  populatePropertyTypeDropdown(categorizedTypes);
});
