import { FastifyInstance, RequestGenericInterface } from "fastify";
import { AssetIds } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { assetIdsSchema } from "../../schemas/assetIds";

const getAssetIdsParamsSchema = {
  type: "object",
  properties: {
    assetId: { type: "string" },
  },
  required: ["assetId"],
} as const;

interface getAssetIdsRequestInterface extends RequestGenericInterface {
  Params: FromSchema<typeof getAssetIdsParamsSchema>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function routes(fastify: FastifyInstance) {
  fastify.get<getAssetIdsRequestInterface>(
    "/:assetId",
    {
      schema: {
        params: getAssetIdsParamsSchema,
        response: {
          200: assetIdsSchema,
          "4xx": { $ref: "errorSchema#" },
        },
      },
    },
    async (request, response) => {
      const { assetId } = request.params;

      const results = await fastify.milvus.client.dataManager.query({
        collection_name: fastify.milvus.collectionName,
        expr: "assetId == " + assetId,
        output_fields: ["statVector"],
      });
      console.log(results)
      
      const assetIdsResponse: AssetIds = {
        assetIds: "",
      };

      response.status(200).send(assetIdsResponse);
    }
  );
}
