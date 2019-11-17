// geojson url 
let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Request data from geojson link
d3.json(earthquakeURL, function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Create earthquake layer; add Popup
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.properties.mag),
                    fillOpacity: .5,
                    color: "#808080",
                    stroke: true,
                    weight: .4
                })
        }
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Lightmap as default layer; 
    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });


    // Pass in base map 
    var baseMaps = {
        "Light Map": lightmap
    };


    // Pass in earthquake layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create map
    var myMap = L.map("map", {
        center: [
            39.769940, -112.904767],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // Create legend 
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background: #43A571"></i><span>0 to 1</span><br>';
        div.innerHTML += '<i style="background: #BCCC36"></i><span>1 to 2</span><br>';
        div.innerHTML += '<i style="background: #E6911E"></i><span>2 to 3</span><br>';
        div.innerHTML += '<i style="background: #C41D12"></i><span>3 to 4</span><br>';
        div.innerHTML += '<i style="background: #6C0F09"></i><span>5+</span><br>';
        return div;
    };

    legend.addTo(myMap);
}

//Update circle colors
function getColor(d) {
    return d > 5 ? "#4D0501" :
        d > 4 ? "#6C0F09" :
            d > 3 ? "#C41D12" :
                d > 2 ? "#E6911E" :
                    d > 1 ? "#BCCC36" :
                        "#43A571";
}

//Update circle size 
function getRadius(value) {
    return value * 30000
}