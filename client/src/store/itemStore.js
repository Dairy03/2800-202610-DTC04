import { createStore } from "zustand/vanilla";
import axios from "axios";

const PORT = 3000;
const URL = `http://localhost`;

const BASE_URL = `${URL}:${PORT}/items`;

const itemStore = createStore((set) => ({
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
      const params = {};
      if (search) params.search = search;
      if (filters) params.filters = filters;
      if (order) params.order = order;
      if (business) params.business = business;

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

export default itemStore;
