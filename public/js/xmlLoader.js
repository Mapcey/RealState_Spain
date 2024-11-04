// xmlWorker.js
self.onmessage = async (event) => {
  const xmlText = event.data; // Receive XML text from the main thread
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  const properties = Array.from(xmlDoc.getElementsByTagName("property"));
  const totalProperties = properties.length;
  const processedData = [];

  properties.forEach((property, index) => {
    processedData.push({
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
      beds:
        parseInt(property.getElementsByTagName("beds")[0]?.textContent) || 0,
      baths:
        parseInt(property.getElementsByTagName("baths")[0]?.textContent) || 0,
      surface_area: {
        built:
          parseFloat(property.getElementsByTagName("built")[0]?.textContent) ||
          0,
        plot:
          parseFloat(property.getElementsByTagName("plot")[0]?.textContent) ||
          0,
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
    });

    // Send progress back to the main thread
    if (index % 100 === 0 || index === totalProperties - 1) {
      self.postMessage({
        type: "progress",
        progress: ((index + 1) / totalProperties) * 100,
      });
    }
  });

  // Send the fully processed data back to the main thread
  self.postMessage({ type: "complete", data: processedData });
};
