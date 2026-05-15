import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


const appState = {
  watchParties: [],
  userLngLat: null,
};

function showMap() {
  // Initialize MapLibre
  // Centered at BCIT
  const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${
      import.meta.env.VITE_MAPTILER_KEY
    }`,
    center: [-123.00163752324765, 49.25324576104826],
    zoom: 10,
  });

  // Add controls (zoom, rotation, etc.) shown in top-right corner of map
  addControls(map);

  // Once the map loads, we can add the user location and markers, etc.
  map.once("load", async () => {
    // Choose either the built-in geolocate control or the manual pin method
    await addGeolocationControl(map);
    console.log("map loaded, placed user pin!");
  });

  function addControls(map) {
    // Zoom and rotation
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Custom legend
    const legendDiv = document.createElement("div");
    legendDiv.style.padding = "10px";
    legendDiv.innerHTML = `
        <div style="background-color: white; padding: 10px; border-radius: 4px; box-shadow: 0 0 0 2px rgba(0,0,0,0.1); font-size: 14px;">
          <div style="font-size: x-large; font-weight: bold; margin-bottom: 8px;">Participating retailers Near You</div>
          <div style="display: flex; align-items: center; margin-bottom: 6px;">
            <img src="" style="width: 20px; height: 20px; margin-right: 8px;" />
            <span></span>
          </div>
          <div style="display: flex; align-items: center;">
            <img src="" style="width: 20px; height: 20px; margin-right: 8px;" />
            <span></span>
          </div>
        </div>
      `;

    class LegendControl {
      onAdd() {
        return legendDiv;
      }
    }

    map.addControl(new LegendControl(), "top-left");
  }
}

async function addGeolocationControl(map) {
  const geolocate = new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  });
  map.addControl(geolocate, "top-right");

  // Load watch parties on map first before setting up the event
  await showWatchParties(map);
  await addUserPin(map);
  zoomToAll(map);
}

async function addUserPin(map) {
  if (!("geolocation" in navigator)) {
    console.warn("Geolocation is not available in this browser");
    return;
  }

  // Use the safe geolocation function that returns a Promise
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Store user location in global variable for later use (e.g., zooming to all points)
        appState.userLngLat = [pos.coords.longitude, pos.coords.latitude];

        // Add a GeoJSON source
        map.addSource("userLngLat", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: { type: "Point", coordinates: appState.userLngLat },
                properties: { description: "Your location" },
              },
            ],
          },
        });

        // Add a simple circle layer
        map.addLayer({
          id: "userLngLat",
          type: "circle",
          source: "userLngLat",
          paint: {
            "circle-color": "#1E90FF",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Optional: add a tooltip on hover or click
        map.on("click", "userLngLat", (e) => {
          const [lng, lat] = e.features[0].geometry.coordinates;
          new maplibregl.Popup()
            .setLngLat([lng, lat])
            .setHTML("You are here")
            .addTo(map);
        });
        resolve();
      },
      (err) => {
        console.error("Geolocation error", err);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

showMap();
