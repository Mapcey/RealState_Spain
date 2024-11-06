self.onmessage = async function (event) {
  const { xmlText, filters } = event.data;

  // Parse XML
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");

  // Extract properties
  const properties = Array.from(xml.getElementsByTagName("property"));

  // Filter properties based on criteria received from the main thread
  const filteredProperties = properties.filter((p) => {
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
      (filters.type === "" || propertyType.includes(filters.type)) &&
      propertyPrice >= filters.minPrice &&
      propertyPrice <= filters.maxPrice &&
      propertySize >= filters.minSize &&
      propertySize <= filters.maxSize &&
      (filters.bedrooms === 0 || propertyBedrooms === filters.bedrooms) &&
      (filters.bathrooms === 0 || propertyBathrooms === filters.bathrooms)
    );
  });

  // Send filtered properties back to main thread
  self.postMessage({ filteredProperties });
};
