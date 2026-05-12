import Item from "../models/item.js";

function acceptDeal(req, res) {
  const itemId = req.params.itemId;
  console.log(itemId);
}

// async function removeDeal(req, res) {
//   dealId = req.params.dealId;
//   try {
//     await
//   } catch (error) {
//     console.log(error);
//     res.status(404).send(`Could not delete deal ID: ${dealId}.`);
//   }
// }

export { acceptDeal, removeDeal };
