// ******************** Get all available types > dropdown ***********************
async function loadXML() {
  const response = await fetch("XML_Feeds_for_areas_copy.xml");
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
    type1: [
      "Villa",
      "Penthouse",
      "Apartment",
      "Townhouse",
      "Bungalow",
      "Restaurant",
    ],
    type2: [
      "Hotel",
      "Semi-Detached House",
      "Residential Plot",
      "Middle Floor Apartment",
      "Finca - Cortijo",
    ],
    other: [],
  };

  // Sort types into the defined categories
  const categorizedTypes = {
    type1: [],
    type2: [],
    other: [],
  };

  types.forEach((type) => {
    if (categories.type1.includes(type)) {
      categorizedTypes.type1.push(type);
    } else if (categories.type2.includes(type)) {
      categorizedTypes.type2.push(type);
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
  addOptionsToGroup("Type 1", categorizedTypes.type1);
  addOptionsToGroup("Type 2", categorizedTypes.type2);
  addOptionsToGroup("Other Types", categorizedTypes.other);
}

// Load XML and populate dropdown
loadXML().then((xml) => {
  const properties = Array.from(xml.getElementsByTagName("property"));
  const uniqueTypes = getUniquePropertyTypes(properties);
  const categorizedTypes = categorizePropertyTypes(uniqueTypes);
  populatePropertyTypeDropdown(categorizedTypes);
});
