export const assetIdsSchema = {
  $id: "assetIds",
  type: "object",
  properties: {
    assetIdsForSale: { type: "array" },
    assetIdsSold: { type: "array" },
  },
  required: ["assetIdsForSale", "assetIdsSold"],
} as const;
