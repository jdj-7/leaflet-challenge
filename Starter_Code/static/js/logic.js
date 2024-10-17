
var map = L.map('map').setView([37.0902, -95.7129], 4); 


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function getColor(depth) {
    if (depth > 90) {
        return '#800026';
    } else if (depth > 70) {
        return '#BD0026';
    } else if (depth > 50) {
        return '#E31A1C';
    } else if (depth > 30) {
        return '#FC4E2A';
    } else if (depth > 10) {
        return '#FD8D3C';
    } else {
        return '#FEB24C';
    }
}


fetch(usgsUrl)
    .then(response => response.json())
    .then(data => {
        
        data.features.forEach(feature => {
            var coords = feature.geometry.coordinates;
            var magnitude = feature.properties.mag;
            var depth = coords[2];
            var place = feature.properties.place;
            var time = new Date(feature.properties.time);

            
            var marker = L.circleMarker([coords[1], coords[0]], {
                radius: magnitude * 2, 
                fillColor: getColor(depth),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

           
            marker.bindPopup(`
                <strong>Location:</strong> ${place}<br>
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth.toFixed(2)} km<br>
                <strong>Time:</strong> ${time.toLocaleString()}
            `);
        });

        
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function () {
            var div = L.DomUtil.create('div', 'info legend');
            var depths = [0, 10, 30, 50, 70, 90];
            var labels = [];

            
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
            }

            return div;
        };

        legend.addTo(map);
    });