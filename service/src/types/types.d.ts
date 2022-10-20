import { FromSchema } from "json-schema-to-ts";
import { userSchema } from "../schemas/user";
import { assetIdsSchema } from "../schemas/assetIds";

export type User = FromSchema<typeof userSchema>;

export type AssetIds = FromSchema<typeof assetIdsSchema>;
