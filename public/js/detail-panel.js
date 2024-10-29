function detailPanel() {
  const properties = filteredData; // Assuming `filteredData` is populated elsewhere
  let detailPanelList = "";

  if (properties.length > 0) {
    properties.forEach((property) => {
      detailPanelList += `
          <div class="popup-rows" onclick="clicked()">
            <div class="property-type">${property.type}</div>
            <div class="property-price">${property.price} ${property.currency}</div>
          </div>
        `;
    });
  } else {
    detailPanelList = "<div>No properties found.</div>";
  }

  // Insert generated HTML into the detail-panel-body
  document.querySelector(".detail-panel-body").innerHTML = detailPanelList;
}

// Call detailPanel() function whenever filteredData is updated
detailPanel(); // Or call this after filtering to update the panel
