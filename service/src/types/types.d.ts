import { FromSchema } from "json-schema-to-ts";
import { assetIdsSchema } from "../schemas/assetIds";

export type AssetIds = FromSchema<typeof assetIdsSchema>;
