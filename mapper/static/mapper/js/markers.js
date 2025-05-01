// Function to create markers and add them to a marker cluster group
function createMarkers(map, data) {
    console.log(`Total Records: ${data.length}`);

    // Initialize the marker cluster group
    const markers = L.markerClusterGroup();

    data.forEach(record => {
        if (record.latitude && record.longitude) {
            console.log(`Adding marker: ${record.name} at ${record.latitude}, ${record.longitude}`);
            
            let marker = L.marker([record.latitude, record.longitude])
                .bindPopup(`<b>${record.name}</b><br>Record Type: ${record.record_type}`);

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
