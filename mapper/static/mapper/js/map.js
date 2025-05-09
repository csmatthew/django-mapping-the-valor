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

    // Enable/disable type checkboxes + grey out text
    function toggleTypeCheckboxes(disable) {
        typeCheckboxes.forEach(cb => {
            const label = cb.parentElement;
            cb.disabled = disable;
            if (disable) {
                cb.checked = false;
                label.classList.add('disabled');
            } else {
                label.classList.remove('disabled');
            }
        });
    }

    // Event listeners
    viewAllCheckbox.addEventListener('change', () => {
        toggleTypeCheckboxes(viewAllCheckbox.checked);
        filterMarkers(data);
    });

    typeCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => filterMarkers(data));
    });

    // On load — enforce default states
    toggleTypeCheckboxes(viewAllCheckbox.checked);
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
