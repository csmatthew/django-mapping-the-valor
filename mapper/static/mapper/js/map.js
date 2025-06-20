let map; // Define map variable globally
let allMarkers = L.markerClusterGroup(); // Marker cluster group

function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(function (pair) {
        if (pair) {
            var parts = pair.split("=");
            params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || "");
        }
    });
    return params;
}

document.addEventListener('DOMContentLoaded', function () {
    var mapContainer = document.getElementById('map');

    if (mapContainer && !mapContainer._leaflet_map) {
        map = L.map('map', {
            center: [53.5, -2.25], // Default center
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

        // Center map if lat/lng/zoom are in query params
        const params = getQueryParams();
        if (params.lat && params.lng) {
            const zoom = params.zoom ? parseInt(params.zoom) : 15;
            map.setView([parseFloat(params.lat), parseFloat(params.lng)], zoom);
        }

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
