import { FastifyInstance, RequestGenericInterface } from "fastify";
import { AssetIds } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { assetStatsSchema } from "../../schemas/assetStats"
import { assetIdsSchema } from "../../schemas/assetIds";


interface getAssetStatsRequestInterface extends RequestGenericInterface {
  Params: FromSchema<typeof assetStatsSchema>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function routes(fastify: FastifyInstance) {
  fastify.get<getAssetStatsRequestInterface>(
    "/stats/combat=:combat/constitution=:constitution/luck=:luck/plunder=:plunder/:topk",
    {
      schema: { 
        params: assetStatsSchema,
        response: {
          200: assetIdsSchema,
          "4xx": { $ref: "errorSchema#" },
        },
      },
    },
    async (request, response) => {
      const { combat, constitution, luck, plunder, topk } = request.params;

      /*const results = await fastify.milvus.client.dataManager.query({
        collection_name: fastify.milvus.collectionName,
        expr: "assetId == " + assetId,
        output_fields: ["statVector"],
      });*/

      const results = await fastify.milvus.client.dataManager.search({
        collection_name: fastify.milvus.collectionName,
        //expr: "word_count <= 11000",
        vectors: [[combat!, constitution!, luck!, plunder!]],
        search_params: {
          anns_field: "statVector",
          topk: topk == "" ? "5" : topk!,    
          metric_type: "L2",
          params: JSON.stringify({ nprobe: 100 }),
        },
        vector_type: 101,    // DataType.FloatVector,
      });

      //console.log(results)
      
      const assetIdsResponse: AssetIds = {
        assetIds: results.results,
      };

      response.status(200).send(assetIdsResponse);
    }
  );
}
