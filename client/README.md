# Recipe AI Feature — Implementation Notes

Four pages built with Tailwind + vanilla HTML/JS, matching your existing app structure.

## Pages

| File | Purpose |
|---|---|
| `recipes.html` | Navigation/list page — shows recipes from cart + nearby store, store selector, refresh button |
| `recipe.html` | Recipe detail (middle wireframe) — name, time, difficulty, step count, total cost, serves |
| `instructions.html` | Step-by-step instructions (third wireframe) |
| `ingredients.html` | Ingredients list using your existing `DiscountCard` component for discounted items |

## Source files

```
src/
├── mock-data.js              ← mock items (itemSchema), stores, stock (stockSchema), cart
├── recipe-api.js             ← AI endpoint client + cache + rate limiting + mock generator
├── recipes-page.js           ← list page logic
├── recipe-detail-page.js     ← detail page logic
├── instructions-page.js      ← instructions page logic
├── ingredients-page.js       ← ingredients page logic
└── components/
    ├── recipe-card.js        ← recipe card for the list page
    └── discount-card.js      ← COPY of the component you provided; delete and import yours
```

## Backend contract

The frontend posts to `${URL}/recipe/` with:

```json
{
  "source": "cart" | "store",
  "storeId": "biz_safeway",
  "items": [{ "_id", "name", "ref_price", "quantity", "expiry" }]
}
```

And expects:

```json
{
  "recipes": [{
    "id": "rcp_abc",
    "name": "Caprese Sandwich",
    "difficulty": "Easy" | "Medium" | "Hard",
    "time_minutes": 10,
    "serves": 2,
    "step_count": 3,
    "image_url": "optional",
    "steps": [{ "title", "description" }],
    "ingredients": [{ "item_id": "itm_001" | null, "name", "quantity" }]
  }]
}
```

The full contract with all fields is documented at the top of `src/recipe-api.js`.

### Recipe AI recommendation

For the backend, I'd suggest **Claude (Anthropic API, `claude-sonnet-4-6`)** because:
- Reliable structured JSON output via tool use
- Strong reasoning about ingredient substitution and expiry prioritization
- One model call per request is enough — no need for a multi-step pipeline

The system prompt should instruct it to (a) prefer items closest to expiry, (b) only use items the user has, (c) link each ingredient to the item's `_id` when matched, and (d) return a strict JSON shape.

## Features built

- **Two sections on the list page**: "From your cart" (only shown if cart non-empty) and "From nearby stores" (always shown, with store selector defaulting to closest)
- **Session caching** (1 hour TTL via `sessionStorage`) keyed by `source:storeId:sortedItemIds`
- **Client-side rate limiting**: 30s cooldown between manual refreshes + max 10 refreshes/hour. The refresh button shows a live countdown when locked. Backend should enforce server-side rate limiting too.
- **Cost calculation** done on the frontend by summing `ref_price` of items linked by `item_id` in the AI response
- **Difficulty badges** (easy/medium/hard with color coding) match the wireframe style
- **Ingredients page** uses your `DiscountCard` to render available discounted items, plus a separate "you'll also need" list for pantry items (`item_id: null`)

## To wire to your real backend

1. In `src/recipe-api.js`:
   - Set `URL` to your API base URL
   - Set `USE_MOCK = false`
2. In `src/ingredients-page.js`: replace the `toDiscountCardShape` discount math with your real sale price field once the item schema has one (currently `ref_price` is the only price field)
3. Delete `src/components/discount-card.js` and update `ingredients-page.js` to import from your existing component location
4. Replace `src/mock-data.js` calls with real API calls for items, stores, cart

## Notes on the item schema

The provided schema has only `ref_price` (reference price). The discount/sale price isn't in the schema, so for the ingredients page I'm mocking the "after" price as a percentage off `ref_price` based on days until expiry. When you have a real sale price field, plug it into `toDiscountCardShape` in `src/ingredients-page.js`.

Also noticed `business: { type: Types.ObjectId, ref: "Item" }` in your schema — the `ref` looks like it should probably be `"Business"`, not `"Item"`. Worth a check on your end.
