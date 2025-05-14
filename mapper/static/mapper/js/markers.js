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