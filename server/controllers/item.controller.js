import Item from "../models/item.js";
import Business from "../models/business.js";

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
    const { search, filters, order, business, lat, lng } = req.query;

    const pipeline = [];

    // --- If we have user coords, lookup business distances ---
    let distanceMap = {};
    if (lat && lng) {
      const nearbyBusinesses = await Business.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: 50000,
          },
        },
        { $project: { _id: 1, distance: 1 } },
      ]);

      nearbyBusinesses.forEach((b) => {
        distanceMap[b._id.toString()] = b.distance;
      });

      const businessIds = nearbyBusinesses.map((b) => b._id);
      pipeline.push({
        $match: { business: { $in: businessIds } },
      });
    }

    // --- Restrict by business if provided
    if (business) {
      pipeline.push({
        $match: { business: new Types.ObjectId(business) },
      });
    }

    // --- Fuzzy search on name ---
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      pipeline.push({
        $match: { name: { $regex: escaped, $options: "i" } },
      });
    }

    // --- Parse filters ---
    if (filters) {
      const filterSet = new Set(filters.split("-"));
      const filterConditions = [];

      if (filterSet.has("fp")) filterConditions.push({ group: "fp" });
      if (filterSet.has("ms")) filterConditions.push({ group: "ms" });
      if (filterSet.has("de")) filterConditions.push({ group: "de" });
      if (filterSet.has("bk")) filterConditions.push({ group: "bk" });
      if (filterSet.has("ss")) filterConditions.push({ group: "ss" });

      if (filterConditions.length > 0) {
        pipeline.push({ $match: { $or: filterConditions } });
      }
    }

    // --- Lookup business name ---
    pipeline.push({
      $lookup: {
        from: "businesses",
        localField: "business",
        foreignField: "_id",
        as: "businessInfo",
      },
    });
    pipeline.push({
      $addFields: {
        businessName: { $arrayElemAt: ["$businessInfo.name", 0] },
      },
    });
    pipeline.push({
      $project: { businessInfo: 0 },
    });

    // --- Ordering (non-distance sorts happen in pipeline) ---
    if (order !== "distance") {
      const sortStage = {};
      switch (order) {
        case "price":
          sortStage.ref_price = 1;
          break;
        case "expiry":
          sortStage.expiry = 1;
          break;
        default:
          sortStage.expiry = 1;
      }
      pipeline.push({ $sort: sortStage });
    }

    let items = await Item.aggregate(pipeline);

    // --- Attach distance (in meters) to every item ---
    if (lat && lng) {
      items = items.map((item) => ({
        ...item,
        distance: distanceMap[item.business.toString()] ?? null,
      }));

      if (order === "distance") {
        items.sort(
          (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
        );
      }
    }

    return res
      .status(200)
      .json({ success: true, items, message: "Items found successfully" });
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
