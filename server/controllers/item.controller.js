import Item from "../models/item.js";

export async function getItemById(req, res) {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found", success: false });
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching item", success: false });
  }
}
