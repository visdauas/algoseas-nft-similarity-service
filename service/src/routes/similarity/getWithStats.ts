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

      let [assetResults, assetSalesResults] = await Promise.all([
        await fastify.milvus.client.dataManager.search({
          collection_name: fastify.milvus.collectionName,
          expr: "forSale == true",
          vectors: [[combat, constitution, luck, plunder]],
          search_params: {
            anns_field: "statVector",
            topk: topk == "" ? "5" : topk!,
            metric_type: "L2",
            params: JSON.stringify({ search_k: -1 }),
          },
          output_fields: ["price", "statVector"],
          vector_type: 101,
        }),
        await fastify.milvus.client.dataManager.search({
          collection_name: fastify.milvus.collectionNameSales,
          vectors: [[combat, constitution, luck, plunder]],
          search_params: {
            anns_field: "statVector",
            topk: topk == "" ? "5" : topk!,
            metric_type: "L2",
            params: JSON.stringify({ search_k: -1 }),
          },
          output_fields: ["price", "round", "statVector"],
          vector_type: 101,
        }),
      ]);

      let sales = assetSalesResults.results;

      const assetIdsResponse: AssetIds = {
        assetIdsForSale: assetResults.results,
        assetIdsSold: sales,
      };

      response.status(200).send(assetIdsResponse);
    }
  );
}
