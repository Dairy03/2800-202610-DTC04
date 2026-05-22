import { createStore } from "zustand/vanilla";
import { authStore } from "./authStore";
import axios from "axios";

const PORT = 3000;
// const URL = `http://localhost`;
const URL = import.meta.env.VITE_API_URL


const BASE_URL = `${URL}:${PORT}/items`;

export const itemStore = createStore((set) => ({
  items: [],
  loading: false,
  error: null,

  search: "",
  filters: "",
  order: "expiry",
  business: "",

  fetchItems: async ({ search, filters, order, business } = {}) => {
    set({ loading: true, error: null });

    try {
      const { userCoords } = authStore.getState();

      const params = {};
      if (search) params.search = search;
      if (filters) params.filters = filters;
      if (order) params.order = order;
      if (business) params.business = business;
      if (userCoords) {
        params.lat = userCoords.lat;
        params.lng = userCoords.lng;
      }

      const { data } = await axios.get(`${BASE_URL}`, { params });

      set({
        items: data.items,
        loading: false,
        search: search || "",
        filters: filters || "",
        order: order || "expiry",
        business: business || "",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        items: [],
      });
    }
  },

  fetchItemById: async (id) => {
    set({ loading: true, error: null });

    try {
      const item = await axios.get(`${BASE_URL}/${id}`);
      // stub
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  clearItems: () =>
    set({
      items: [],
      search: "",
      filters: "",
      order: "expiry",
      business: "",
      error: null,
    }),
}));
