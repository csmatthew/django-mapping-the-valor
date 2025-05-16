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

            // Limit latitude and longitude to 6 decimal places
            const latitude = lat.toFixed(6);
            const longitude = lng.toFixed(6);

            // Fetch record types and deaneries dynamically
            fetch('/mapper/get-dropdown-options/')
                .then(response => response.json())
                .then(data => {
                    const recordTypeOptions = data.record_types
                        .map(type => `<option value="${type}">${type}</option>`)
                        .join('');
                    const deaneryOptions = data.deaneries
                        .map(deanery => `<option value="${deanery}">${deanery}</option>`)
                        .join('');

                    // Create a popup with a form
                    const popupContent = `
                        <form id="add-record-form">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" required><br>
                            
                            <label for="record_type">Record Type:</label>
                            <select id="record_type" name="record_type" required>
                                ${recordTypeOptions}
                            </select><br>
                            
                            <label for="deanery">Deanery:</label>
                            <select id="deanery" name="deanery" required>
                                ${deaneryOptions}
                            </select><br>
                            
                            <input type="hidden" id="latitude" name="latitude" value="${latitude}">
                            <input type="hidden" id="longitude" name="longitude" value="${longitude}">
                            
                            <button type="submit">Add Record</button>
                        </form>
                    `;

                    const popup = L.popup()
                        .setLatLng([latitude, longitude])
                        .setContent(popupContent)
                        .openOn(map);

                    // Initialize Select2 for the dropdowns
                    setTimeout(() => {
                        $('#record_type').select2({ width: '100%' });
                        $('#deanery').select2({ width: '100%' });
                    }, 0);

                    // Handle form submission
                    const form = document.getElementById('add-record-form');
                    form.addEventListener('submit', function (event) {
                        event.preventDefault(); // Prevent default form submission

                        const formData = new FormData(form);

                        // Send data to the backend
                        fetch('/mapper/add-record/', {
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': getCsrfToken(), // Include CSRF token
                            },
                            body: formData,
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    console.log('🟢 Record added successfully:', data);

                                    // Add a marker for the new record
                                    const newMarker = L.marker([latitude, longitude]).addTo(map);
                                    newMarker.bindPopup(`<b>${data.record.name}</b><br>${data.record.record_type}`).openPopup();

                                    // Exit "add record" mode
                                    map.getContainer().style.cursor = '';
                                    isAddingRecord = false;
                                    addRecordBtn.disabled = false;
                                } else {
                                    console.error('🔴 Error adding record:', data.errors);
                                    alert('Failed to add record. Please try again.');
                                }
                            })
                            .catch(error => {
                                console.error('🔴 Error:', error);
                                alert('An error occurred. Please try again.');
                            });
                    });
                })
                .catch(error => {
                    console.error('🔴 Error fetching dropdown options:', error);
                    alert('Failed to fetch dropdown options. Please try again.');
                });
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

// Function to get CSRF token from cookies
function getCsrfToken() {
    const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : '';
}