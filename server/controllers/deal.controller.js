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

async function updateCart(req, res) {
  const { itemId, quantity } = req.params;
  const changeAmount = Number(quantity);
  const userId = req.session.userId;
  //Find the users current cart entry for the item, and get current quantity.
  try {
    const user = await User.findOne({ _id: userId, "cart.itemId": itemId });
    const cartEntry = user.cart.find(
      (item) => item.itemId.toString() === itemId,
    );
    const newQuantity = cartEntry.quantity + changeAmount;

    //Remove Item from cart if 0 quantity
    if (newQuantity < 1) {
      await User.findOneAndUpdate(userId, {
        $pull: { cart: { itemId: itemId } },
      });
      return res.status(200).json({
        success: true,
        message: "Removed item with 0 quantity from cart",
      });
    }

    //Update Cart Entry
    await User.findOneAndUpdate(
      { _id: userId, "cart.itemId": itemId },
      {
        $set: { "cart.$.quantity": newQuantity },
      },
    );
    res.status(200).json({
      success: true,
      message: `Modified item in cart by ${quantity}.`,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "There was an issue updating cart.", success: false });
  }
}

// async function removeDeal(req, res) {
//   const { itemId, quantity } = req.params.itemId;
//   const userId = req.session.userId;

//   try {
//     res.send("A-OK!");
//   } catch (error) {
//     console.log(error);
//     res.status(404).send(`Could not delete deal ID: ${dealId}.`);
//   }
// }
export { acceptDeal, updateCart };
