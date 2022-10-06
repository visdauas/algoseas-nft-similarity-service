import { MilvusClient } from '@zilliz/milvus2-sdk-node';

let milvusClient: MilvusClient;

export function getClient() {
  if (milvusClient == undefined) {
    createClient();
  }
  return milvusClient;
}

function createClient() {
  const address = process.env.MILVUS_URL!;
  milvusClient = new MilvusClient(address);
  console.log('created');
}
