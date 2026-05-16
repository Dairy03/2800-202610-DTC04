// Mock data conforming to the schemas you provided.
// Replace with real API calls when wiring up the backend.

// itemSchema:
//   name, ref_price, quantity, address, business, expiry
//
// stockSchema:
//   business (ObjectId), items (Map of ObjectId -> Item)

// ---------- Items ----------
// Note: schema says name is lowercase, which we follow.
// `_id` is added so we can reference items from stock and the cart.
export const MOCK_ITEMS = [
  {
    _id: "itm_001",
    name: "tomato",
    ref_price: 2.49,
    quantity: 4,
    address: "1450 Robson St, Vancouver",
    business: "biz_safeway",
    expiry: addDays(2),
  },
  {
    _id: "itm_002",
    name: "fresh basil",
    ref_price: 3.99,
    quantity: 1,
    address: "1450 Robson St, Vancouver",
    business: "biz_safeway",
    expiry: addDays(1),
  },
  {
    _id: "itm_003",
    name: "mozzarella",
    ref_price: 6.49,
    quantity: 2,
    address: "1450 Robson St, Vancouver",
    business: "biz_safeway",
    expiry: addDays(3),
  },
  {
    _id: "itm_004",
    name: "ciabatta loaf",
    ref_price: 4.5,
    quantity: 3,
    address: "1450 Robson St, Vancouver",
    business: "biz_safeway",
    expiry: addDays(2),
  },
  {
    _id: "itm_005",
    name: "spaghetti",
    ref_price: 2.99,
    quantity: 8,
    address: "885 Helmcken St, Vancouver",
    business: "biz_save_on",
    expiry: addDays(30),
  },
  {
    _id: "itm_006",
    name: "ground beef",
    ref_price: 8.99,
    quantity: 3,
    address: "885 Helmcken St, Vancouver",
    business: "biz_save_on",
    expiry: addDays(2),
  },
  {
    _id: "itm_007",
    name: "yellow onion",
    ref_price: 1.29,
    quantity: 12,
    address: "885 Helmcken St, Vancouver",
    business: "biz_save_on",
    expiry: addDays(7),
  },
  {
    _id: "itm_008",
    name: "garlic",
    ref_price: 0.99,
    quantity: 20,
    address: "885 Helmcken St, Vancouver",
    business: "biz_save_on",
    expiry: addDays(14),
  },
  {
    _id: "itm_009",
    name: "bell pepper",
    ref_price: 1.79,
    quantity: 6,
    address: "1255 Davie St, Vancouver",
    business: "biz_iga",
    expiry: addDays(3),
  },
  {
    _id: "itm_010",
    name: "chicken breast",
    ref_price: 11.99,
    quantity: 4,
    address: "1255 Davie St, Vancouver",
    business: "biz_iga",
    expiry: addDays(2),
  },
  {
    _id: "itm_011",
    name: "lemon",
    ref_price: 0.79,
    quantity: 15,
    address: "1255 Davie St, Vancouver",
    business: "biz_iga",
    expiry: addDays(5),
  },
  {
    _id: "itm_012",
    name: "olive oil",
    ref_price: 9.99,
    quantity: 5,
    address: "1255 Davie St, Vancouver",
    business: "biz_iga",
    expiry: addDays(60),
  },
];

// ---------- Stores (businesses) ----------
// In production these come from the Business collection plus a distance calc.
export const MOCK_STORES = [
  {
    _id: "biz_safeway",
    name: "Safeway Robson",
    address: "1450 Robson St, Vancouver",
    distance: 0.4, // km, from user
  },
  {
    _id: "biz_save_on",
    name: "Save-On-Foods Downtown",
    address: "885 Helmcken St, Vancouver",
    distance: 1.1,
  },
  {
    _id: "biz_iga",
    name: "IGA Marketplace",
    address: "1255 Davie St, Vancouver",
    distance: 1.8,
  },
];

// ---------- Stock (per business) ----------
// stockSchema has items as a Map; we represent it as an object keyed by item _id.
export const MOCK_STOCK = MOCK_STORES.map((store) => ({
  business: store._id,
  items: Object.fromEntries(
    MOCK_ITEMS.filter((i) => i.business === store._id).map((i) => [i._id, i._id])
  ),
}));

// ---------- Helpers ----------
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export function getClosestStore() {
  return [...MOCK_STORES].sort((a, b) => a.distance - b.distance)[0];
}

export function getStoreById(id) {
  return MOCK_STORES.find((s) => s._id === id);
}

export function getItemById(id) {
  return MOCK_ITEMS.find((i) => i._id === id);
}

export function getItemsForStore(storeId) {
  const stock = MOCK_STOCK.find((s) => s.business === storeId);
  if (!stock) return [];
  return Object.values(stock.items).map(getItemById).filter(Boolean);
}

// ---------- Cart (mocked in localStorage) ----------
const CART_KEY = "still_fresh_cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      // Seed with a couple items for demo purposes.
      const seed = ["itm_006", "itm_005", "itm_007", "itm_008", "itm_001"];
      localStorage.setItem(CART_KEY, JSON.stringify(seed));
      return seed.map(getItemById).filter(Boolean);
    }
    return JSON.parse(raw).map(getItemById).filter(Boolean);
  } catch {
    return [];
  }
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
