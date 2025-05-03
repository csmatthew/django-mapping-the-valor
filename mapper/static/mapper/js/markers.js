// Function to create markers and add them to a marker cluster group
function createMarkers(map, data) {
    console.log(`Total Records: ${data.length}`);

    // Initialize the marker cluster group
    const markers = L.markerClusterGroup();

    data.forEach(record => {
        if (record.latitude && record.longitude) {            
            // Construct the name and popup content
            let name = record.name;
            if (record.house_type) {
                name += ` ${record.house_type}`;
            } else if (record.record_type !== 'Monastery') {
                name += ` ${record.record_type}`;
            }
            let popupContent = `<b>${name}</b><br>
                                Record Type: ${record.record_type}<br>
                                Deanery: ${record.deanery}<br>
                                Valuation: ${record.valuation}<br>`;
            if (record.religious_order) {
                popupContent += `Religious Order: ${record.religious_order}<br>`;
            }

            // Create the marker and bind the popup
            let marker = L.marker([record.latitude, record.longitude])
                .bindPopup(popupContent);

            // Add click event to show modal when marker is selected
            marker.on('click', function () {
                openCrudModal(record.slug);  // Call the function in `crud_modal.js`
                console.log(`Opening modal for slug: ${record.slug}`);

            });
            
            // Optional: Add events for interactivity
            marker.on('mouseover', function () {
                marker.openPopup();
            });

            marker.on('mouseout', function () {
                marker.closePopup();
            });

            // Add marker to the marker cluster group
            markers.addLayer(marker);
        } else {
            console.warn(`Skipping ${record.name}: Missing coordinates`);
        }
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
}
