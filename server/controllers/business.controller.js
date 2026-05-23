import Business from "../models/business.js";
import Stock from "../models/stock.js";
import Item from "../models/item.js";

async function registerBusiness(req, res) {
  try {
    const { username, password, address, email, coords } = req.body;

    if (!username || !password || !address || !email) {
      return res
        .status(400)
        .send("Username, password and address are required");
    }
    if (password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters");
    }

    const exists = await Business.findOne({ username });
    if (exists) {
      return res.status(409).send("Username already registered");
    }

    const user = await Business.create({
      username,
      password,
      address,
      email,
      coords,
    });
    req.session.userId = user._id;
    req.session.userType = user.role;

    res.status(201).send(`Registered and logged in as ${user.username}`);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error during registration");
  }
}

async function addStock(req, res) {
  const businessId = req.session.userId;
  const itemBatch = req.body;

  try {
    const business = await Business.findById(businessId);

    let stock = await Stock.findOne({ business: businessId });

    //If no stock document is found for the business one is created
    if (!stock) {
      stock = await Stock.create({ business: businessId, items: {} });
    }

    //Create new entries in Item model tied to this business for every item
    for (const item of itemBatch) {
      const newItem = await Item.create({
        ...item,
        business: businessId,
        address: business.address,
      });

      //Add the items to the business stock document "items" map
      await Stock.findByIdAndUpdate(stock._id, {
        $set: { [`items.${newItem.name}`]: newItem._id },
      });
    }

    res.status(200).json({
      success: true,
      message: `Stock updated successfully for ${business.username} ${business.address}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding item(s) to stock." });
  }
}

//This function is performed for one itemId at a time and expects req.body to be only 1 object
async function removeStock(req, res) {
  const { itemId, itemName, quantity } = req.body;
  const businessId = req.session.userId;

  //Find stock document and item document tied to the current business for the item being removed
  try {
    const stock = await Stock.findOne({ business: businessId });
    const item = await Item.findOne({ business: businessId });

    //If no stock/item document found return error message.
    if (!stock || !item)
      return res.status(404).json({
        success: false,
        message: `Cannot find stock or item document matching ${businessId}.`,
      });

    const newQuantity = item.quantity - quantity;

    //Remove item document and update business stock synchronously
    if (newQuantity < 1) {
      // Remove the item from the parent business's Item document
      const itemDocumentPromise = await Item.findByIdAndDelete({ _id: itemId });
      // Remove the item from the parent business's Stock document
      const stockDocumentPromise = await Stock.findByIdAndUpdate(
        { _id: stock._id },
        {
          $unset: { [`items.${itemName}`]: "" },
        },
      );

      //Use synchronous promise calling for efficiency
      const updateMongo = await Promise.all([
        itemDocumentPromise,
        stockDocumentPromise,
      ]);

      res.status(200).json({
        success: true,
        message: `${itemName} has been removed due to 0 stock.`,
      });
    } else {
      //Update the item's specific Item model document for quantity change
      const updatedItemState = await Item.findByIdAndUpdate(
        itemId,
        {
          $set: { quantity: newQuantity },
        },
        { new: true },
      );

      res.status(204).json({
        success: true,
        message: `Updated ${itemName} quantity to ${newQuantity}`,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Internal server error: ${error}` });
  }
}

async function getStoreItems(req, res) {
  const { storeId } = req.params;

  try {
    const items = await Item.find({ business: storeId });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this store", success: false });
    }

    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching store items", success: false });
  }
}

async function getAllBusinesses(req, res) {
  try {
    const businesses = await Business.find({});
    res.status(200).json({ success: true, businesses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching businesses", success: false });
  }
}

async function getBusinessById(req, res) {
  try {
    const business = await Business.findById(req.params.businessId);
    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found", success: false });
    }
    res.status(200).json({ success: true, business });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching business", success: false });
  }
}

export {
  registerBusiness,
  removeStock,
  addStock,
  getStoreItems,
  getAllBusinesses,
  getBusinessById,
};
