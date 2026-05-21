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
      await User.findByIdAndUpdate(userId, {
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

async function removeDeal(req, res) {
  const itemId = req.params.itemId;
  const userId = req.session.userId;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: { itemId: itemId } },
    });
    res
      .status(200)
      .json({ success: true, message: `Removed ${itemId} from cart.` });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Could not delete deal ID: ${itemId} from cart.`);
  }
}

async function getCart(req, res) {
  const userId = req.session.userId;

  try {
    const user = await User.findById(userId).populate("cart.itemId");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Format cart to match itemSchema shape expected by recipe-api.js
    const cart = user.cart.map((entry) => ({
      _id: entry.itemId._id,
      name: entry.itemId.name,
      ref_price: entry.itemId.ref_price,
      quantity: entry.quantity,
      expiry: entry.itemId.expiry,
      weight_kg: entry.itemId.weight_kg,
    }));

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart", success: false });
  }
}
export { acceptDeal, updateCart, removeDeal, getCart };
