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
  const user = process.env.MILVUS_USER!;
  const password = process.env.MILVUS_PASSWORD!;

  milvusClient = new MilvusClient(address, false, user, password);
  console.log('connected');
}
