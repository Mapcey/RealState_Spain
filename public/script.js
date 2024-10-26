// public/script.js

// Initialize the Leaflet map
const map = L.map('map').setView([51.505, -0.09], 13); // Set initial coordinates and zoom level

// Add a tile layer to the map (using OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Example Turf.js - Create a point and add it to the map
const point = turf.point([-0.09, 51.505]);

// Display the point on the map as a Leaflet marker
L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]]).addTo(map)
    .bindPopup('A point created by Turf.js')
    .openPopup();

// Example Turf.js - Buffer the point and display on map
const buffered = turf.buffer(point, 0.5, { units: 'kilometers' });
const coordinates = buffered.geometry.coordinates[0].map(coord => [coord[1], coord[0]]); // Turf coordinates to Leaflet format

// Add the buffer as a polygon on the map
L.polygon(coordinates, { color: 'blue' }).addTo(map)
    .bindPopup('Buffered area around the point');
