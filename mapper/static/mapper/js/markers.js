// Define SVG icons
const svgIcons = {
    'Monastery': `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5" cy="20.5" r="10" fill="blue" stroke="black" stroke-width="2"/>
                  </svg>`,
    'Rectory': `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5" cy="20.5" r="10" fill="red" stroke="black" stroke-width="2"/>
               </svg>`,
    'Collegiate': `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5" cy="20.5" r="10" fill="green" stroke="black" stroke-width="2"/>
               </svg>`,
    'Default': `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="12.5" cy="20.5" r="10" fill="gray" stroke="black" stroke-width="2"/>
                </svg>`
};

// Define custom icons using L.divIcon
const icons = {
    'Monastery': L.divIcon({
        className: 'custom-monastery-icon',
        html: svgIcons['Monastery'],
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41]
    }),
    'Rectory': L.divIcon({
        className: 'custom-rectory-icon',
        html: svgIcons['Rectory'],
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41]
    }),
    'Collegiate': L.divIcon({
        className: 'custom-collegiate-icon',
        html: svgIcons['Collegiate'],
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41]
    }),
    'Default': L.divIcon({
        className: 'custom-default-icon',
        html: svgIcons['Default'],
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41]
    })
};

// Store markers in a dictionary
const markers = {};

// Function to create markers
function createMarkers(map, data) {
    data.forEach(record => {
        if (record.latitude && record.longitude) {
            let name = record.name;
            if (record.house_type) {
                name += ` ${record.house_type}`;
            } else if (record.record_type !== 'Monastery') {
                name += ` ${record.record_type}`;
            }
            let popupContent = `<b>${name}</b><br>
                                Record Type: ${record.record_type}<br>
                                Deanery: ${record.deanery}<br>`;
            if (record.religious_order) {
                popupContent += `Religious Order: ${record.religious_order}<br>`;
            }

            // Use the custom icon based on the record type
            let markerIcon = icons[record.record_type] || icons['Default'];

            let marker = L.marker([record.latitude, record.longitude], {
                    icon: markerIcon
                })
                .bindPopup(popupContent);

            // Store marker in the dictionary
            if (!markers[record.record_type]) {
                markers[record.record_type] = [];
            }
            markers[record.record_type].push(marker);

            // Add click event to show modal when marker is selected
            marker.on('click', function () {
                // Fetch the record details using the record slug
                fetch(`/valor-records/${record.slug}/modal/`)
                    .then(response => response.text())
                    .then(html => {
                        // Populate the modal content
                        var modalContent = document.getElementById('modal-content');
                        modalContent.innerHTML = html;
                        // Show the modal
                        var viewCardModal = new bootstrap.Modal(document.getElementById('viewCardModal'));
                        viewCardModal.show();
                    })
                    .catch(error => console.error('Error fetching record details:', error));
            });

            // Handle marker hover events
            marker.on('mouseover', function () {
                marker.openPopup();
            });

            marker.on('mouseout', function () {
                marker.closePopup();
            });
        }
    });
}

// Function to filter markers
function filterMarkers() {
    const checkboxes = document.querySelectorAll('.record-type-filter');
    checkboxes.forEach(checkbox => {
        const recordType = checkbox.value;
        if (checkbox.checked) {
            markers[recordType].forEach(marker => marker.addTo(map));
        } else {
            markers[recordType].forEach(marker => marker.remove());
        }
    });
}

// Add event listeners to checkboxes
document.querySelectorAll('.record-type-filter').forEach(checkbox => {
    checkbox.addEventListener('change', filterMarkers);
});