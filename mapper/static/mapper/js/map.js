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

        // Show the loading overlay before fetching
        const loadingOverlay = document.getElementById('map-loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Fetch Valor Records and add them to the map
        fetch('/mapper/valor-records/')
            .then(response => response.json())
            .then(data => {
                createMarkers(map, data);
                setupFilters(data); // Initialize filter functionality
                if (loadingOverlay) loadingOverlay.classList.add('hidden'); // Hide after markers load
            })
            .catch(error => {
                console.error('Error fetching valor records:', error);
                if (loadingOverlay) loadingOverlay.classList.add('hidden');
            });
    }
});

function setupFilters(data) {
    const viewAllCheckbox = document.getElementById('view-all-filter');
    const typeCheckboxes = document.querySelectorAll('.record-type-filter');
    const showOwnRecords = document.getElementById('show-own-records');

    // When "View All" is changed
    viewAllCheckbox.addEventListener('change', () => {
        if (viewAllCheckbox.checked) {
            // Uncheck all type checkboxes and "Show only my records"
            typeCheckboxes.forEach(cb => cb.checked = false);
            if (showOwnRecords) showOwnRecords.checked = false;
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
            const anyChecked = Array.from(typeCheckboxes).some(cb => cb.checked) || (showOwnRecords && showOwnRecords.checked);
            if (!anyChecked) {
                viewAllCheckbox.checked = true;
            }
            filterMarkers(data);
        });
    });

    // When "Show only my records" is changed
    if (showOwnRecords) {
        showOwnRecords.addEventListener('change', () => {
            if (showOwnRecords.checked) {
                viewAllCheckbox.checked = false;
                // Disable type checkboxes and visually grey them out
                typeCheckboxes.forEach(cb => {
                    cb.disabled = true;
                    cb.parentElement.classList.add('text-muted'); // Optional: add a class for greyed-out label
                });
            } else {
                // Enable type checkboxes and remove greyed-out style
                typeCheckboxes.forEach(cb => {
                    cb.disabled = false;
                    cb.parentElement.classList.remove('text-muted');
                });
            }
            // If none are checked, re-check "View All"
            const anyChecked = Array.from(typeCheckboxes).some(cb => cb.checked) || showOwnRecords.checked;
            if (!anyChecked) {
                viewAllCheckbox.checked = true;
            }
            filterMarkers(data);
        });
    }

    // On load — enforce default states
    if (viewAllCheckbox.checked) {
        typeCheckboxes.forEach(cb => cb.checked = false);
        if (showOwnRecords) showOwnRecords.checked = false;
    }
    filterMarkers(data);
}

function filterMarkers(data) {
    const viewAllChecked = document.getElementById('view-all-filter').checked;
    const typeCheckboxes = document.querySelectorAll('.record-type-filter:checked');
    const activeTypes = Array.from(typeCheckboxes).map(cb => cb.value);
    const showOwnRecords = document.getElementById('show-own-records');
    const onlyOwn = showOwnRecords && showOwnRecords.checked;

    allMarkers.clearLayers();

    data.forEach(record => {
        if (record.latitude && record.longitude) {
            let typeMatch = viewAllChecked || activeTypes.includes(record.record_type);
            // If no type is checked and "view all" is not checked, show nothing unless "show only my records" is checked
            if (!viewAllChecked && activeTypes.length === 0 && !onlyOwn) {
                typeMatch = false;
            }
            let ownerMatch = !onlyOwn || record.is_owner;

            if ((typeMatch && ownerMatch) || (onlyOwn && activeTypes.length === 0 && record.is_owner)) {
                if (window.markerMap[record.slug]) {
                    allMarkers.addLayer(window.markerMap[record.slug]);
                }
            }
        }
    });

    map.addLayer(allMarkers);
}
