import Groq from "groq-sdk";

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

    res.status(200).json(parsed);
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
