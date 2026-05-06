import Item from "../models/item.js";

function acceptDeal(req, res) {
  res.send(`The deal ${req.params.dealId} has been accepted! :^)`);
}

export { acceptDeal };
