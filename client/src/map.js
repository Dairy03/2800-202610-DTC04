import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const appState = {
  businesses: [],
  userLngLat: null,
};

const dummyBusinesses = [
  {
    id: 1,
    name: "The Brentwood Hub Cafe",
    coordinates: [-123.0076, 49.2663], // Near BCIT
  },
  {
    id: 2,
    name: "Downtown Sports Bar",
    coordinates: [-123.1215, 49.2796], // Downtown Vancouver
  }
];

let map;

function showMap() {
  map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${
      import.meta.env.VITE_MAPTILER_KEY
    }`,
    center: [-123.00163752324765, 49.25324576104826],
    zoom: 10,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");

  map.once("load", () => {
    showBusinesses();
  });
}

function showBusinesses() {
  for (const business of dummyBusinesses) {
    
    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<h3>${business.name}</h3>`);

    new maplibregl.Marker({
      color: "#FF4500",
      draggable: false,
    })
    .setLngLat(business.coordinates)
    .setPopup(popup)
    .addTo(map);
  }
}

showMap();