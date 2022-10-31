import { FastifyInstance } from "fastify";
import { MilvusClient } from "@zilliz/milvus2-sdk-node";

export interface MilvusDBOptions {
  url: string;
  collectionName: string;
  collectionNameSales: string;
  user: string;
  password: string;
}

interface MilvusDBInstance {
  client: MilvusClient;
  collectionName: string;
  collectionNameSales: string;
}

declare module "fastify" {
  interface FastifyInstance {
    milvus: MilvusDBInstance;
  }
}

const milvusPlugin = async (
  fastify: FastifyInstance,
  options: MilvusDBOptions
): Promise<void> => {
  const client = new MilvusClient(
    options.url,
    false,
    options.user,
    options.password
  );

  await client.collectionManager.loadCollection({
    collection_name: options.collectionName,
  });

  await client.collectionManager.loadCollection({
    collection_name: options.collectionNameSales,
  });

  // Add the client to the Fastify instance
  fastify.decorate("milvus", {
    client,
    collectionName: options.collectionName,
    collectionNameSales: options.collectionNameSales,
  });
};

export default milvusPlugin;
