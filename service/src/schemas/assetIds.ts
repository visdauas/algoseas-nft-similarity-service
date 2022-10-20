export const assetIdsSchema = {
  $id: "assetIds",
  type: "object",
  properties: {
    assetIds: { type: "string" },
  },
  required: ["assetIds"],
} as const;
