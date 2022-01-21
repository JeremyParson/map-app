var personIcon = L.icon({
    iconUrl: 'assets/pin.png',
    shadowUrl: 'assets/pin.png',

    iconSize:     [50, 54], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [25, 64], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 0],  // the same for the shadow
    popupAnchor:  [0, -64] // point from which the popup should open relative to the iconAnchor
});