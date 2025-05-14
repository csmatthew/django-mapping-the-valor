document.addEventListener('DOMContentLoaded', function () {
    const addRecordBtn = document.getElementById('add-record-btn');
    let isAddingRecord = false; // Track whether the user is in "add record" mode

    if (!isUserAuthenticated) {
        addRecordBtn.style.display = 'none'; // Hide the button for unauthenticated users
    }

    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            if (!isAddingRecord) {
                isAddingRecord = true;
                map.getContainer().style.cursor = 'crosshair'; // Change cursor to crosshair
                console.log('🟢 Add Record mode activated. Click on the map to select a location.');
                addRecordBtn.disabled = true;
            }
        });
    }

    // Handle map click event
    map.on('click', function (e) {
        if (isAddingRecord) {
            const { lat, lng } = e.latlng; // Get clicked coordinates
            console.log(`🟢 Location selected: Latitude ${lat}, Longitude ${lng}`);

            // Optionally, add a marker at the clicked location
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup('New Record Location').openPopup();

            // Restore default cursor and exit "add record" mode
            map.getContainer().style.cursor = '';
            isAddingRecord = false;

            // Enable the add record button
            addRecordBtn.disabled = false;

            // Open a modal to add record details (optional)
            openAddRecordModal(lat, lng);
        }
    });

    // Handle Escape key press to cancel "add record" mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isAddingRecord) {
            map.getContainer().style.cursor = ''; // Restore default cursor
            isAddingRecord = false; // Exit "add record" mode
            addRecordBtn.disabled = false; // Re-enable the add record button
            console.log('🟡 Add Record mode canceled.');
        }
    });
});

// Function to open a modal for adding a new record
function openAddRecordModal(lat, lng) {
    console.log(`🟢 Opening modal for new record at Latitude ${lat}, Longitude ${lng}`);
    // Implement modal logic here (e.g., fetch modal content or display a form)
}