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
            let name = record.name;

            // Always append house_type if it exists
            if (record.house_type) {
                name += ` ${record.house_type}`;
            }

            // If no house_type and record_type exists, append the record_type (but not if it's 'Monastery')
            else if (record.record_type && record.record_type !== 'Monastery') {
                name += ` ${record.record_type}`;
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
                console.log(`Opening modal for slug: ${record.slug}`);
            });

            // Optional: Add events for interactivity
            marker.on('mouseover', function () {
                marker.openPopup();
            });

            marker.on('mouseout', function () {
                marker.closePopup();
            });
        } else {
            console.warn(`Skipping ${record.name}: Missing coordinates`);
        }
    });
}

function addNewMarker(record) {
    if (!record.latitude || !record.longitude) {
        console.error("Missing coordinates for new record:", record);
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
        console.log(`Opening modal for slug: ${record.slug}`);
    });

    marker.on('mouseover', function () {
        marker.openPopup();
    });

    marker.on('mouseout', function () {
        marker.closePopup();
    });
}


function updateMarkerPopup(record) {
    console.log("🟢 Updating marker popup for:", record.slug);

    // Find the old marker (if exists) and remove it
    let oldMarker = window.markerMap[record.old_slug]; // Use previous slug if provided
    if (oldMarker) {
        console.log(`🟡 Removing old marker for slug: ${record.old_slug}`);
        allMarkers.removeLayer(oldMarker);
        delete window.markerMap[record.old_slug];
    } else {
        console.warn(`⚠️ Old marker not found for slug: ${record.old_slug}`);
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

    console.log(`🟢 Creating new marker at [${record.latitude}, ${record.longitude}]`);

    let marker = L.marker([record.latitude, record.longitude]).bindPopup(popupContent);
    
    window.markerMap[record.slug] = marker;
    allMarkers.addLayer(marker); // 🔥 Add new marker to cluster
    map.addLayer(allMarkers); // 🔥 Refresh map

    console.log(`✅ Marker updated successfully for: ${record.slug}`);
}

window.updateMarkerPopup = updateMarkerPopup;