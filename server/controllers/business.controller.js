import Business from "../models/business.js";
import Stock from "../models/stock.js";

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
    console.log(business);
    for (const item of itemBatch) {
      console.log(`This item is: ${item.name}`);
    }
    res.status(200).json({
      success: true,
      message: `Stock updated successfully for ${business.address}`,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding item(s) to stock." });
  }
}

export { registerBusiness, addStock };
