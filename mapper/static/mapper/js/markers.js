// Function to create markers and add them directly to the map
function createMarkers(map, data) {
    console.log(`Total Records: ${data.length}`);
    
    data.forEach(record => {
        if (record.latitude && record.longitude) {
            console.log(`Adding marker: ${record.name} at ${record.latitude}, ${record.longitude}`);
            
            let marker = L.marker([record.latitude, record.longitude])
                .bindPopup(`<b>${record.name}</b><br>Record Type: ${record.record_type}`)
                .addTo(map); // Directly add marker

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
