document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([54.5, -3], 6); // Centered on Britain

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var monasteries = JSON.parse(document.getElementById('monasteries-data').textContent);
    monasteries.forEach(function (monastery) {
        var fields = monastery.fields;
        var coordinates = fields.coordinates;

        var lat, lng;

        // Match DMS format
        var dmsMatch = coordinates.match(/([0-9.]+)°\s*([0-9.]+)′\s*([0-9.]+)″\s*([NS])\s*([0-9.]+)°\s*([0-9.]+)′\s*([0-9.]+)″\s*([EW])/);
        if (dmsMatch) {
            lat = parseFloat(dmsMatch[1]) + parseFloat(dmsMatch[2]) / 60 + parseFloat(dmsMatch[3]) / 3600;
            lng = parseFloat(dmsMatch[5]) + parseFloat(dmsMatch[6]) / 60 + parseFloat(dmsMatch[7]) / 3600;
            if (dmsMatch[4] === 'S') lat = -lat;
            if (dmsMatch[8] === 'W') lng = -lng;
        } else {
            // Match Decimal format
            var decimalMatch = coordinates.match(/([0-9.-]+),\s*([0-9.-]+)/);
            if (decimalMatch) {
                lat = parseFloat(decimalMatch[1]);
                lng = parseFloat(decimalMatch[2]);
            } else {
                // Match original format
                var originalMatch = coordinates.match(/([0-9.]+)°([NS])\s*([0-9.]+)°([EW])/);
                if (originalMatch) {
                    lat = parseFloat(originalMatch[1]) * (originalMatch[2] === 'S' ? -1 : 1);
                    lng = parseFloat(originalMatch[3]) * (originalMatch[4] === 'W' ? -1 : 1);
                } else {
                    console.error('Invalid coordinates format:', coordinates);
                    return;
                }
            }
        }

        var name = fields.name;
        if (fields.house_type) {
            name += ' ' + fields.house_type;
        }

        var popupContent = '<b>' + name + '</b><br>' + fields.nearest_town + '<br>' +
            '<a href="/' + fields.slug + '">View Details</a><br>' +
            '<a href="/valor-holdings/' + fields.slug + '">View Valor Holdings</a>';

        var marker = L.marker([lat, lng]).addTo(map)
            .bindPopup(popupContent);

        marker.on('click', function() {
            map.flyTo([lat, lng], 15, {
                animate: true,
                duration: 2 // Duration in seconds
            }); // Zoom in to the marker location with a smooth transition
            showDropdownMenu(lat, lng); // Show the dropdown menu
        });
    });

    // Handle overlay click event
    var mapOverlay = document.getElementById('map-overlay');
    var mapOverlayText = document.getElementById('map-overlay-text');

    // Detect if the device is a touch device
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        mapOverlayText.textContent = 'Tap to activate map';
    } else {
        mapOverlayText.textContent = 'Click to activate map';
    }

    mapOverlay.addEventListener('click', function () {
        mapOverlay.style.display = 'none';
    });

    function showDropdownMenu(lat, lng) {
        var dropdown = document.getElementById('dropdown-menu');
        dropdown.style.display = 'block';
        dropdown.style.position = 'absolute';
        dropdown.style.left = map.latLngToContainerPoint([lat, lng]).x + 'px';
        dropdown.style.top = map.latLngToContainerPoint([lat, lng]).y + 'px';
    }
});