import { FastifyInstance } from "fastify";
import { MilvusClient } from "@zilliz/milvus2-sdk-node";

export interface MilvusDBOptions {
  url: string;
  collectionName: string;
}

interface MilvusDBInstance {
  client: MilvusClient;
  collectionName: string;
}

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module "fastify" {
  interface FastifyInstance {
    milvus: MilvusDBInstance;
  }
}

// fastify-plugin automatically adds named export, so be sure to add also this type
// the variable name is derived from `options.name` property if `module.exports.myPlugin` is missing
//export const fastifyMilvusdb: FastifyPluginAsync<MilvusDBOptions>;

const milvusPlugin = async (
  fastify: FastifyInstance,
  options: MilvusDBOptions
): Promise<void> => {
  // Create a client
  const client = new MilvusClient(options.url);

  await client.collectionManager.loadCollection({
    collection_name: options.collectionName,
  });

  // Add the client to the Fastify instance
  fastify.decorate("milvus", {
    client,
    collectionName: options.collectionName,
  });
};

// fastify-plugin automatically adds `.default` property to the exported plugin. See the note below
export default milvusPlugin;
