console.log('map.js loaded');

let map; // Define map variable globally

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    var mapContainer = document.getElementById('map');

    if (mapContainer && !mapContainer._leaflet_map) {
        map = L.map('map', {
            center: [53.5, -2.25], // Centered on Manchester
            zoom: 10, // Set initial zoom level to 10 for a more zoomed-in view
            minZoom: 6, // Prevent zooming out further than zoom level 6
            maxBounds: [
                [49.5, -10.5], // Southwest corner
                [59, 2]       // Northeast corner
            ],
            maxBoundsViscosity: 1.0, // Ensures the map is completely restricted to the bounds
            zoomControl: false // Disable the default zoom control
        });
        mapContainer._leaflet_map = map;
        console.log('Map initialized:', map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add zoom control to the bottom right
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Fetch Valor Records and add them to the map
        fetch('/map/valor-records/')
            .then(response => response.json())
            .then(data => {
                console.log('Valor Records:', data); // Log the data to verify the response
                createMarkers(map, data); // Use the createMarkers function from markers.js
                filterMarkers(); // Apply initial filter
            })
            .catch(error => console.error('Error fetching valor records:', error));
    }
});