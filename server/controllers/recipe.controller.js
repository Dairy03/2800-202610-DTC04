import Groq from "groq-sdk";

// Calculate discount based on days until expiry
function getDiscount(expiryDate) {
  const days = Math.max(
    0,
    Math.round((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
  );
  return days <= 1 ? 0.5 : days <= 2 ? 0.35 : days <= 4 ? 0.2 : 0.1;
}

export async function getRecipes(req, res) {
  const { source, storeId, items } = req.body;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ message: "No items provided", success: false });
  }

  const systemPrompt = `You are a recipe recommendation assistant for a grocery discount app called Still Fresh.

Your job is to suggest recipes based on items a user has in their cart or store inventory.

Rules:
- PRIORITIZE items closest to expiry date — help users use them before they go bad
- ONLY use items provided in the list as primary ingredients
- You may suggest common pantry staples (salt, pepper, oil, water) as additional ingredients with item_id: null
- Link each ingredient to the item's _id when it matches an item in the list
- Return ONLY valid JSON, no markdown, no explanation, no backticks
- Return between 3-5 recipes

Return this exact JSON shape:
{
  "recipes": [{
    "id": "rcp_abc",
    "name": "Recipe Name",
    "difficulty": "Easy" | "Medium" | "Hard",
    "time_minutes": 30,
    "serves": 4,
    "step_count": 5,
    "image_url": null,
    "steps": [{ "title": "Step title", "description": "Step description" }],
    "ingredients": [{ "item_id": "_id from items list or null", "name": "ingredient name", "quantity": "2 cups" }]
  }]
}`;

  const userMessage = `Generate recipes based on these items. Source: ${source}${storeId ? `, Store: ${storeId}` : ""}.

Items available:
${JSON.stringify(items, null, 2)}

Today's date is ${new Date().toISOString().split("T")[0]}. Prioritize items expiring soonest.`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4096,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    const enrichedRecipes = await enrichRecipesWithPrices(
      parsed.recipes,
      items,
    );

    res.status(200).json({ recipes: enrichedRecipes });
  } catch (error) {
    console.error("Recipe generation error:", error);

    if (error instanceof SyntaxError) {
      return res
        .status(500)
        .json({ message: "Failed to parse recipe response", success: false });
    }

    res
      .status(500)
      .json({ message: "Error generating recipes", success: false });
  }
}

async function enrichRecipesWithPrices(recipes, items) {
  const priceMap = new Map();

  items.forEach((item) => {
    const idStr = item._id.toString();
    const discount = getDiscount(item.expiry);
    const discountedPrice = +(item.ref_price * (1 - discount)).toFixed(2);

    priceMap.set(idStr, {
      ref_price: item.ref_price,
      discounted_price: discountedPrice,
      expiry: item.expiry,
    });
  });

  const enriched = recipes.map((recipe) => ({
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => {
      if (ingredient.item_id) {
        const idStr = ingredient.item_id.toString();
        if (priceMap.has(idStr)) {
          const prices = priceMap.get(idStr);
          return {
            ...ingredient,
            ref_price: prices.ref_price,
            discounted_price: prices.discounted_price,
            expiry: prices.expiry,
          };
        }
      }
      return {
        ...ingredient,
        ref_price: null,
        discounted_price: null,
        expiry: null,
      };
    }),
  }));

  return enriched;
}
