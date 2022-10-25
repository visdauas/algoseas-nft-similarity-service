export const assetStatsSchema = {
  $id: "assetStats",
  type: "object",
  properties: {
    combat: { type: "integer" },
    constitution: { type: "integer" },
    luck: { type: "integer" },
    plunder: { type: "integer" },
    topk: { type: "string"}
  },
  required: ["combat", "constitution", "luck", "plunder"],
} as const;
