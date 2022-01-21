async function main() {
  let _debug_use_mock_data = false;
  let user_location = [40.9, -73.99];

  // retrieve search button and establishment dropdown
  let establishmentDropdown = document.querySelector(
    "#establishment-type-dropdown"
  );
  let searchButton = document.querySelector("#search-button");

  // used to retrieve data from leaflet api
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: LEAFLET_AUTH_KEY,
    },
  };

  // stores location data for the 5 nearest locations per establishment type
  let map_data = {
    resturaunt: [],
    grocery: [],
    sports: [],
    deli: [],
    fastfood: [],
  };

  // setup map at users location
  let map = L.map("map").setView(user_location, 15);

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let markerLayer = L.layerGroup().addTo(map);

  // show user's location on map
  let user_marker = L.marker(user_location, { icon: personIcon }).addTo(map);
  user_marker.bindPopup("Your Location");

  // TO-DO get users location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(storeUserPosition);
  }

  function storeUserPosition(position) {
    user_location[0] = position.coords.latitude.toFixed(2);
    user_location[1] = position.coords.longitude.toFixed(2);
  }

  // retrieve location data for all establishment types and store it
  for (establishmentType in map_data) {
    // determine whether or not to source mockdata
    if (_debug_use_mock_data) {
      map_data[establishmentType] = mockData[establishmentType].results;
    } else {
      // rettrieve data from foursquare places api
      var api_request_link = `https://api.foursquare.com/v3/places/search?query=${establishmentType}&ll=${user_location[0]}%2C${user_location[1]}&radius=50000&limit=5`;
      var results = await fetch(api_request_link, options);
      let json = await results.json();
      map_data[establishmentType] = json.results
    }
  }

  // setup search button click event
  searchButton.addEventListener("click", (_e) => {
    updateMapPins();
  });

  // clears map and marks map with new markers based on selected establishment type
  function updateMapPins() {
    // retrieve map marker data and selected establishment type
    let selected_establishment_type = establishmentDropdown.value;
    let map_marker_data = map_data[selected_establishment_type];

    //clear map of markers
    markerLayer.clearLayers();

    // loop through marker data
    for (marker_key in map_marker_data) {
      let current_marker_data = map_marker_data[marker_key];
      let latitude = current_marker_data.geocodes.main.latitude.toFixed(2);
      let longitude = current_marker_data.geocodes.main.longitude.toFixed(2);
      let marker = L.marker([latitude, longitude]).addTo(markerLayer);
      marker.bindPopup(`${current_marker_data.name}`);
    }
  }
}

main();
