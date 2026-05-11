const item_name = document.getElementById('item-name')
const item_distance = document.getElementById('item-distance')
const item_price_after = document.getElementById('item-price-after')
const item_price_before = document.getElementById('item-price-before')
const item_money_saved = document.getElementById('item-money-saved')
const item_expiration = document.getElementById('item-expiration')
const redeem_by = document.getElementById('redeem-by')
const item_discount = document.getElementById('item-discount')
const item_location= document.getElementById('item-location')

const items = [
  {
    name: "SOurdough",

    distance: "1.1km",
    before: 12,
    after: 7,
    expires: "2026-05-08",
    location: "Arby's"
  },
];


function calc_expiration(data) {
  const now = new Date();
  const expiry = new Date(data[0].expires);
  return Math.round((expiry - now) / (1000 * 60 * 60 * 24)); //convert milliseconds into days and rounds to the nearest whole number
}

function calc_discount(data) {
    const new_price = data[0].after
    const old_price = data[0].before
    return Math.round((1-(new_price/old_price))*100)
}

const money_saved = parseFloat(items[0].before) - parseFloat(items[0].after)

item_name.innerHTML = `${items[0].name}`
item_distance.innerHTML = `${items[0].distance}`
item_price_after.innerHTML = `${items[0].after.toFixed(2)}`
item_price_before.innerHTML = `${items[0].before.toFixed(2)}`
item_money_saved.innerHTML = `${money_saved.toFixed(2)}`
item_expiration.innerHTML = `${calc_expiration(items)}`
redeem_by.innerHTML = `${items[0].expires}`
item_discount.innerHTML = `${calc_discount(items)}`
item_location.innerHTML = `${items[0].location}`
