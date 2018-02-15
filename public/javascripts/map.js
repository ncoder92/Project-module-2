'use strict';

function main () {
  axios
    .get(`/api${window.location.pathname}`)
    .then((response) => {
      const latitude = response.data.eventLocation.coordinates[1];
      const longitude = response.data.eventLocation.coordinates[0];
      const map = L.map('map').setView([latitude, longitude], 14);
      L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
          attribution:
            'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken:
            'pk.eyJ1IjoibmNvZGVyOTIiLCJhIjoiY2pkbmRmdno4MGQ2ODJ4bWtxcG02dnk1ciJ9.DehQETKEOyrOha4hqclYvg'
        }
      ).addTo(map);
      const marker = L.marker([latitude, longitude])
        .bindPopup(response.data.title)
        .addTo(map)
        .openPopup();
    })
    .catch((error) => console.log(error));
}

window.onload = main;
