var map = L.map('map').setView([54.5, -3], 6); // Centered on Britain

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var monasteries = JSON.parse(document.getElementById('monasteries-data').textContent);
        console.log(monasteries); // Debugging statement
        monasteries.forEach(function(monastery) {
            var fields = monastery.fields;
            console.log(fields.coordinates); // Debugging statement
            var coordinates = fields.coordinates.match(/([0-9.]+)°([NS])\s*([0-9.]+)°([EW])/);
            if (coordinates) {
                var lat = parseFloat(coordinates[1]) * (coordinates[2] === 'S' ? -1 : 1);
                var lng = parseFloat(coordinates[3]) * (coordinates[4] === 'W' ? -1 : 1);
                console.log(lat, lng); // Debugging statement
                L.marker([lat, lng]).addTo(map)
                    .bindPopup('<b>' + fields.name + '</b><br>' + fields.nearest_town);
            } else {
                console.error('Invalid coordinates format:', fields.coordinates); // Debugging statement
            }
        });