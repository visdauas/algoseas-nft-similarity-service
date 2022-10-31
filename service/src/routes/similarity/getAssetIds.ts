import { FastifyInstance, RequestGenericInterface } from "fastify";
import { AssetIds } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { assetIdsSchema } from "../../schemas/assetIds";
import { SearchResultData } from "@zilliz/milvus2-sdk-node/dist/milvus/types";

const getAssetIdsParamsSchema = {
  type: "object",
  properties: {
    assetId: { type: "string" },
    topk: { type: "string" },
  },
  required: ["assetId"],
} as const;

interface getAssetIdsRequestInterface extends RequestGenericInterface {
  Params: FromSchema<typeof getAssetIdsParamsSchema>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function routes(fastify: FastifyInstance) {
  fastify.get<getAssetIdsRequestInterface>(
    "/assetId=:assetId/:topk",
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
      const { assetId, topk } = request.params;

      const result = await fastify.milvus.client.dataManager.query({
        collection_name: fastify.milvus.collectionName,
        expr: "assetId == " + assetId,
        output_fields: ["statVector"],
      });

      const statVector = result.data[0].statVector;

      const results = await fastify.milvus.client.dataManager.search({
        collection_name: fastify.milvus.collectionName,
        expr: "forSale == true",
        vectors: [statVector],
        search_params: {
          anns_field: "statVector",
          topk: topk == "" ? "6" : topk! + 1,
          metric_type: "L2",
          params: JSON.stringify({ search_k: -1 }),
        },
        output_fields: ["price"],
        vector_type: 101, // DataType.FloatVector,
      });

      const assetIdsForSale = results.results;
      assetIdsForSale.shift();

      /*const resultss = await fastify.milvus.client.dataManager.search({
        collection_name: fastify.milvus.collectionName,
        expr: "forSale == false && price > 0",
        vectors: [statVector],
        search_params: {
          anns_field: "statVector",
          topk: topk == "" ? "5" : topk!,
          metric_type: "L2",
          params: JSON.stringify({ nprobe: 8 }),
          //params: JSON.stringify({ search_k: -1 }),
          //params: JSON.stringify({ ef: 500
         }),
        },
        output_fields: ["price"],
        vector_type: 101, // DataType.FloatVector,
      });*/

      const assetIdsResponse: AssetIds = {
        assetIdsForSale: assetIdsForSale,
        assetIdsSold: [],
      };

      response.status(200).send(assetIdsResponse);
    }
  );
}
