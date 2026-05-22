import { carbonSaved } from "./utils";

const item_name = document.getElementById("item-name");
const item_distance = document.getElementById("item-distance");
const item_price_after = document.getElementById("item-price-after");
const item_price_before = document.getElementById("item-price-before");
const item_money_saved = document.getElementById("item-money-saved");
const item_expiration = document.getElementById("item-expiration");
const redeem_by = document.getElementById("redeem-by");
const item_discount = document.getElementById("item-discount");
const item_location = document.getElementById("item-location");
const item_carbon_saved = document.getElementById("carbon-saved");
const item_quantity_left = document.getElementById("quantity-left");

// const items = [
//   {
//     id: "123",
//     name: "SOurdough",
//     distance: "1.1km",
//     before: 12,
//     after: 7,
//     expires: "2026-05-08",
//     location: "Arby's",
//     address: "123 street",
//     ref_price: 5.99,
//     quantity: 12,
//     expiry: ""
//   },
// ];

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
console.log(itemId);

import axios from "axios";
const PORT = 3000;
// const URL = `http://localhost:${PORT}`;
const URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true;
async function getItems() {
  try {
    const result = await axios.get(`${URL}/items/${itemId}`);
    console.log(result.data.item);
    return result.data.item;
  } catch (error) {
    console.log(error);
  }
}
// document.getElementById('claim-deal-btn').addEventListener(claimDeal(itemID, itemQuantity))
const items = await getItems();

// async function claimDeal(itemID, itemQuantity) {
//   try{
//     const result = await axios.post(`http://localhost:3000/deal/accept/${itemID}/${itemQuantity}`)
//     console.log(result)
//   } catch(error) {
//     console.log(error)
//   }
// }

// const itemQuantity = 1
// document.getElementById('claim-deal-btn').addEventListener("click", async () => {
//     try {
//       await claimDeal(itemId, itemQuantity)
//       window.location.href = "/item-confirm-page.html";
//     } catch(err) {
//       console.log(err)
//     }
// })

function calc_expiration(data) {
  const now = new Date();
  const expiry = new Date(data.expiry);
  return Math.round((expiry - now) / (1000 * 60 * 60 * 24)); //convert milliseconds into days and rounds to the nearest whole number
}

// function calc_discount(data) {
//     const new_price = data[0].after
//     const old_price = data[0].before
//     return Math.round((1-(new_price/old_price))*100)
// }

function calc_discount(data) {
  const days = Math.max(
    0,
    Math.round((new Date(data.expiry) - new Date()) / (1000 * 60 * 60 * 24)),
  );
  return days <= 1 ? 0.5 : days <= 2 ? 0.35 : days <= 4 ? 0.2 : 0.1;
}

const new_price = items.ref_price * calc_discount(items);
const money_saved = parseFloat(items.ref_price) - parseFloat(new_price);

item_name.innerHTML = `${items.name}`;
item_distance.innerHTML = `${items.distance}`;
item_price_after.innerHTML = `${new_price.toFixed(2)}`;
item_price_before.innerHTML = `${items.ref_price.toFixed(2)}`;
item_money_saved.innerHTML = `${money_saved.toFixed(2)}`;
item_expiration.innerHTML = `${calc_expiration(items)}`;
redeem_by.innerHTML = `${items.expiry.substring(0, 10)}`;
item_discount.innerHTML = `${calc_discount(items) * 100}`;
item_location.innerHTML = `${items.location}`;
item_carbon_saved.innerHTML = `${carbonSaved(items)}kg CO₂`;
item_quantity_left.innerHTML = `${items.quantity}`;
