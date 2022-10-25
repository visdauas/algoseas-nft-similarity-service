export const assetIdsSchema = {
  $id: "assetIds",
  type: "object",
  properties: {
    assetIds: { type: "array" },
  },
  required: ["assetIds"],
} as const;
