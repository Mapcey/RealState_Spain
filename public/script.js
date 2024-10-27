// public/script.js

// Initialize the Leaflet map
const map = L.map("map").setView([51.505, -0.09], 13); // Set initial coordinates and zoom level

// Add a tile layer to the map (using OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
