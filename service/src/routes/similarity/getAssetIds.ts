import { FastifyInstance, RequestGenericInterface } from "fastify";
import { AssetIds } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { assetIdsSchema } from "../../schemas/assetIds";

const getAssetIdsParamsSchema = {
  type: "object",
  properties: {
    assetId: { type: "string" },
    topk: { type: "string" }
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

      const results = await fastify.milvus.client.dataManager.query({
        collection_name: fastify.milvus.collectionName,
        expr: "assetId == " + assetId,
        output_fields: ["statVector"],
      });
      console.log(results)
      console.log(results.data)

      const results2 = await fastify.milvus.client.dataManager.search({
        collection_name: fastify.milvus.collectionName,
        //expr: "word_count <= 11000",
        vectors: [results.data[0].statVector],
        search_params: {
          anns_field: "statVector",
          topk: topk == "" ? "6" : (+topk! + 1).toString(),    
          metric_type: "L2",
          params: JSON.stringify({ nprobe: 100 }),
        },
        vector_type: 101,    // DataType.FloatVector,
      });

      //console.log(results)

      const assetIdsResponse: AssetIds = {
        assetIds: results2.results.slice(1),
      };

      response.status(200).send(assetIdsResponse);
    }
  );
}
