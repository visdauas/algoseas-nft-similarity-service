import { FastifyInstance, RequestGenericInterface } from "fastify";
import { AssetIds } from "../../types/types";
import { FromSchema } from "json-schema-to-ts";
import { assetStatsSchema } from "../../schemas/assetStats";
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
      let { combat, constitution, luck, plunder, topk } = request.params;

      combat = fastify.weights.combatWeight * combat;
      constitution = fastify.weights.constitutionWeight * constitution;
      luck = fastify.weights.luckWeight * luck;
      plunder = fastify.weights.plunderWeight * plunder;

      const results = await fastify.milvus.client.dataManager.search({
        collection_name: fastify.milvus.collectionName,
        expr: "forSale == true",
        vectors: [[combat, constitution, luck, plunder]],
        search_params: {
          anns_field: "statVector",
          topk: topk == "" ? "5" : topk!,
          metric_type: "L2",
          params: JSON.stringify({ search_k: -1 }),
        },
        output_fields: ["price"],
        vector_type: 101, // DataType.FloatVector,
      });

      /*const resultss = await fastify.milvus.client.dataManager.search({
        collection_name: fastify.milvus.collectionName,
        expr: "forSale == false && price > 0",
        vectors: [[combat, constitution, luck, plunder]],
        search_params: {
          anns_field: "statVector",
          topk: topk == "" ? "5" : topk!,    
          metric_type: "L2",
          //params: JSON.stringify({ nprobe: 8 }),
          //params: JSON.stringify({ search_k: -1 }),
          params: JSON.stringify({ ef: 500 }),

        },
        output_fields: ["price"],
        vector_type: 101,    // DataType.FloatVector,
      });*/

      const assetIdsResponse: AssetIds = {
        assetIdsForSale: results.results,
        assetIdsSold: [],
      };

      response.status(200).send(assetIdsResponse);
    }
  );
}
