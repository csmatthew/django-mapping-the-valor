// markers.js

// Make markerMap globally accessible
window.markerMap = {};

// Function to create markers and add them to the global marker cluster group
function createMarkers(map, data) {

    // Reset global markerMap
    window.markerMap = {};

    data.forEach(record => {
        if (record.latitude && record.longitude) {

            // Construct the name and popup content
            let name;
            if (record.record_type === 'Monastery' && record.house_type) {
                name = `${record.name} ${record.house_type}`;
            } else if (record.record_type) {
                name = `${record.name} ${record.record_type}`;
            } else {
                name = record.name;
            }

            let popupContent = `<b>${name}</b><br>
                    Record Type: ${record.record_type}<br>
                    Deanery: ${record.deanery}<br>
                    Valuation: ${record.valuation}<br>`;

            if (record.religious_order) {
                popupContent += `Religious Order: ${record.religious_order}<br>`;
            }

            // Create the marker
            let marker = L.marker([record.latitude, record.longitude])
                .bindPopup(popupContent);

            // Store the marker globally by slug
            window.markerMap[record.slug] = marker;

            // Add click event to show modal when marker is selected
            marker.on('click', function () {
                openCrudModal(record.slug); // Call the function in crud_modal.js
            });

            // Optional: Add events for interactivity
            marker.on('mouseover', function () {
                marker.openPopup();
            });

            marker.on('mouseout', function () {
                marker.closePopup();
            });
        } else {
            // Skipping marker creation due to missing coordinates
        }
    });
}

function addNewMarker(record) {
    if (!record.latitude || !record.longitude) {
        return;
    }

    let name = record.name;
    if (record.house_type) {
        name += ` ${record.house_type}`;
    } else if (record.record_type && record.record_type !== 'Monastery') {
        name += ` ${record.record_type}`;
    }

    let popupContent = `<b>${name}</b><br>
        Record Type: ${record.record_type}<br>
        Deanery: ${record.deanery}<br>`;

    if (record.religious_order) {
        popupContent += `Religious Order: ${record.religious_order}<br>`;
    }

    let marker = L.marker([record.latitude, record.longitude]).bindPopup(popupContent);

    window.markerMap[record.slug] = marker;
    allMarkers.addLayer(marker);  // 🔥 Add marker immediately
    map.addLayer(allMarkers);     // 🔥 Refresh map

    // Add modal open on click
    marker.on('click', function () {
        openCrudModal(record.slug);
    });

    marker.on('mouseover', function () {
        marker.openPopup();
    });

    marker.on('mouseout', function () {
        marker.closePopup();
    });
}

function updateMarkerPopup(record) {
    // Find the old marker (if exists) and remove it
    let oldMarker = window.markerMap[record.old_slug]; // Use previous slug if provided
    if (oldMarker) {
        allMarkers.removeLayer(oldMarker);
        delete window.markerMap[record.old_slug];
    }

    // Create a new marker with updated data
    let name = record.name;
    if (record.house_type) {
        name += ` ${record.house_type}`;
    } else if (record.record_type && record.record_type !== 'Monastery') {
        name += ` ${record.record_type}`;
    }

    let popupContent = `<b>${name}</b><br>Record Type: ${record.record_type}<br>Deanery: ${record.deanery}<br>`;

    if (record.religious_order) {
        popupContent += `Religious Order: ${record.religious_order}<br>`;
    }

    let marker = L.marker([record.latitude, record.longitude]).bindPopup(popupContent);
    
    window.markerMap[record.slug] = marker;
    allMarkers.addLayer(marker); // Add new marker to cluster
    map.addLayer(allMarkers); // Refresh map
}

window.updateMarkerPopup = updateMarkerPopup;