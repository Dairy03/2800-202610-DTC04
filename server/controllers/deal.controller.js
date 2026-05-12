import Item from "../models/item.js";
import User from "../models/user.js";

async function acceptDeal(req, res) {
  const { itemId, quantity } = req.params;
  const userId = req.session.userId;
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        cart: { itemId: itemId, quantity: quantity },
      },
    });
    console.log(`${userId} has claimed ${quantity} of an item.`);
    res
      .status(200)
      .json({ success: true, message: "Added item to cart successfully!" });
  } catch (error) {
    console.log("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart." });
  }
}

async function removeDeal(req, res) {
  itemId = req.params.itemId;
  try {
    console.log(`Removed item ID: ${itemId}`);
  } catch (error) {
    console.log(error);
    res.status(404).send(`Could not delete deal ID: ${dealId}.`);
  }
}

export { acceptDeal, removeDeal };
