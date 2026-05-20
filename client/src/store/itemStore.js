import axios from "axios";

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

axios.defaults.withCredentials = true;

// export const itemStore = createStore((set) => ({
//   item: null,
//   error: null,
//   isLoading: false,

//     checkItem: async (itemId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await axios.post(`${URL}/auth/login`, {
//         itemId
//       });
//       set({
//         item: response.data.user,
//         isLoading: false,
//       });
//     } catch (err) {
//       set({
//         error: err.response?.data?.message || "An error occured getting item",
//         isLoading: false,
//       });
//       throw err;
//     }
//   },
// }))