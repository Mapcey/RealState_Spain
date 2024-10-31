// ******************** Get all avilable types > dropdown ***********************
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

loadXML().then((xml) => {
  const properties = Array.from(xml.getElementsByTagName("property"));

  // Get and log unique property types
  getUniquePropertyTypes(properties);
});

function populatePropertyTypeDropdown(types) {
  const dropdown = document.getElementById("propertyType");

  // Clear existing options
  dropdown.innerHTML = '<option value="">Any</option>';

  // Add each unique type as an option
  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    dropdown.appendChild(option);
  });
}

loadXML().then((xml) => {
  const properties = Array.from(xml.getElementsByTagName("property"));

  // Get unique property types and populate the dropdown
  const uniqueTypes = getUniquePropertyTypes(properties);
  populatePropertyTypeDropdown(uniqueTypes);
});
