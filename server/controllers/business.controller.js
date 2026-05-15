import Business from "../models/business.js";
import Stock from "../models/stock.js";
import Item from "../models/item.js";

async function registerBusiness(req, res) {
  try {
    const { username, password, address } = req.body;

    if (!username || !password || !address) {
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

    const user = await Business.create({ username, password, address });
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
  addStock,
  getStoreItems,
  getAllBusinesses,
  getBusinessById,
};
