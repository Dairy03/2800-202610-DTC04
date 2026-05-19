import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const appState = {
  businesses: [],
  userLngLat: null,
};

const dummyBusinesses = [
  {
    id: 1,
    name: "The local farmers market",
    coordinates: [-123.0076, 49.2663], // Near BCIT
  },
  {
    id: 2,
    name: "superstore",
    coordinates: [-123.1215, 49.2796], // Downtown Vancouver
  },
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
    // 1. Create the marker standard instance (no .setPopup here)
    const marker = new maplibregl.Marker({
      color: "#FF4500",
      draggable: false,
    })
      .setLngLat(business.coordinates)
      .addTo(map);

    // 2. Get the DOM element of the marker to attach a click event
    const markerEl = marker.getElement();
    markerEl.style.cursor = "pointer";

    markerEl.addEventListener("click", (e) => {
      // Prevent the map canvas itself from receiving the click event
      e.stopPropagation();
      openBusinessModal(business);
    });
  }
}

function openBusinessModal(business) {
  const existingModal = document.getElementById("business-modal-overlay");
  if (existingModal) existingModal.remove();

  const overlay = document.createElement("div");
  overlay.id = "business-modal-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.style.backgroundColor = "#ffffff";
  modal.style.padding = "24px";
  modal.style.borderRadius = "8px";
  modal.style.width = "90%";
  modal.style.maxWidth = "400px";
  modal.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
  modal.style.fontFamily = "sans-serif";
  modal.style.position = "relative";

  // Modal UI Layout
  modal.innerHTML = `
    <button id="close-modal-btn" style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 24px; cursor: pointer; color: #888;">&times;</button>
    <h2 style="margin: 0 0 12px 0; color: #222; font-size: 22px;">${business.name}</h2>
    <p style="margin: 0 0 20px 0; color: #555; font-size: 14px; line-height: 1.5;">Welcome to ${business.name}! This details container can easily pull dynamic information directly from your database objects.</p>
    <button id="view-stock-btn" style="width: 100%; background-color: #FF4500; color: white; border: none; padding: 12px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 14px;">View Stock</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close Events
  const closeModal = () => overlay.remove();

  modal.querySelector("#close-modal-btn").addEventListener("click", closeModal);

  // Close if user clicks background overlay instead of white modal box
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

showMap();
