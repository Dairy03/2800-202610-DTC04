import Item from "../models/item.js";

async function getItemById(req, res) {
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

async function getItemsByParams(req, res) {
  try {
    const { search, filters, order, business } = req.query;

    // --- Build the aggregation pipeline ---
    const pipeline = [];

    // --- Restrict by business if provided
    if (business) {
      pipeline.push({
        $match: { business: new Types.ObjectId(business) },
      });
    }

    // --- Fuzzy search on name ---
    if (search) {
      // Escape regex special chars, then allow flexible matching
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      pipeline.push({
        $match: { name: { $regex: escaped, $options: "i" } },
      });
    }

    // --- Parse filters (e.g. "fp-ms-de") ---
    if (filters) {
      const filterSet = new Set(filters.split("-"));

      const filterConditions = [];

      // fp = fresh produce
      if (filterSet.has("fp"))
        filterConditions.push({ ref_price: { $lte: 20 } });

      // ms = meat and seafood
      if (filterSet.has("ms"))
        filterConditions.push({
          expiry: { $lte: new Date(Date.now() + 3 * 86400000) },
        });

      // de = dairy and eggs
      if (filterSet.has("de"))
        filterConditions.push({ ref_price: { $lte: 10 } });

      // bk = bakery
      if (filterSet.has("bk"))
        filterConditions.push({ quantity: { $gte: 50 } });

      // ss = sweets and snacks
      if (filterSet.has("ss")) filterConditions.push({ quantity: { $gt: 0 } });

      if (filterConditions.length > 0) {
        pipeline.push({ $match: { $and: filterConditions } });
      }
    }

    // --- Ordering ---
    const sortStage = {};
    switch (order) {
      case "price":
        sortStage.ref_price = 1;
        break;
      case "expiry":
        sortStage.expiry = 1;
        break;
      case "distance":
        // placeholder
        break;
      default:
        sortStage.expiry = 1;
    }
    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    // --- Return items ---
    const items = await Item.aggregate(pipeline);

    return res
      .status(200)
      .json({ sucess: false, items, message: "Items found succesfully" });
  } catch (err) {
    console.error("getItemsByParams error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function getAllItems(req, res) {
  try {
    const items = await Item.find();
    if (!items) {
      return res
        .status(404)
        .json({ message: "Items not found", success: false });
    }
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching item", success: false });
  }
}

export { getItemById, getItemsByParams };
