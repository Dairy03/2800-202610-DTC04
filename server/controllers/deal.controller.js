import Item from "../models/item.js";

function acceptDeal(req, res) {
  console.log("Deal accepted");
  res.redirect("/");
}

export { acceptDeal };
