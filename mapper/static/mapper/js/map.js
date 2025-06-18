let map; // Define map variable globally
let allMarkers = L.markerClusterGroup(); // Marker cluster group

document.addEventListener('DOMContentLoaded', function () {
    var mapContainer = document.getElementById('map');

    if (mapContainer && !mapContainer._leaflet_map) {
        map = L.map('map', {
            center: [53.5, -2.25], // Centered on Manchester
            zoom: 10,
            minZoom: 6,
            maxBounds: [
                [49.5, -10.5],
                [59, 2]
            ],
            maxBoundsViscosity: 1.0,
            zoomControl: false
        });
        mapContainer._leaflet_map = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add zoom control to the bottom right
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Fetch Valor Records and add them to the map
        fetch('/mapper/valor-records/')
            .then(response => response.json())
            .then(data => {
                createMarkers(map, data);
                setupFilters(data); // Initialize filter functionality
            })
            .catch(error => console.error('Error fetching valor records:', error));
    }
});

function setupFilters(data) {
    const viewAllCheckbox = document.getElementById('view-all-filter');
    const typeCheckboxes = document.querySelectorAll('.record-type-filter');

    // When "View All" is changed
    viewAllCheckbox.addEventListener('change', () => {
        if (viewAllCheckbox.checked) {
            // Uncheck all type checkboxes
            typeCheckboxes.forEach(cb => cb.checked = false);
        }
        filterMarkers(data);
    });

    // When any type checkbox is changed
    typeCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) {
                viewAllCheckbox.checked = false;
            }
            // If none are checked, re-check "View All"
            const anyChecked = Array.from(typeCheckboxes).some(cb => cb.checked);
            if (!anyChecked) {
                viewAllCheckbox.checked = true;
            }
            filterMarkers(data);
        });
    });

    // On load — enforce default states
    if (viewAllCheckbox.checked) {
        typeCheckboxes.forEach(cb => cb.checked = false);
    }
    filterMarkers(data);
}

function filterMarkers(data) {
    const viewAllChecked = document.getElementById('view-all-filter').checked;
    const activeTypes = Array.from(document.querySelectorAll('.record-type-filter:checked')).map(cb => cb.value);

    // Clear existing markers from the map
    allMarkers.clearLayers();

    data.forEach(record => {
        if (record.latitude && record.longitude) {
            const shouldShow = viewAllChecked || activeTypes.includes(record.record_type);
            if (shouldShow && window.markerMap[record.slug]) {
                allMarkers.addLayer(window.markerMap[record.slug]);
            }
        }
    });

    map.addLayer(allMarkers);
}
