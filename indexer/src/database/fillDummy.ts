import { getClient } from './client';

export async function fillDummy() {
  const milvusClient = getClient();

  const data = Array.from({ length: 20000 }, (v, k) => ({
    assetId: k,
    statVector: Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 200),
    ),
    combat: Math.floor(Math.random() * 200),
    constitution: Math.floor(Math.random() * 200),
    luck: Math.floor(Math.random() * 200),
    plunder: Math.floor(Math.random() * 200),
    forSale: Math.random() < 0.5,
    lastPrice: Math.floor(Math.random() * 10000),
    lastSoldRound: Math.floor(Math.random() * 1000000),
  }));

  const mr = await milvusClient.dataManager.insert({
    collection_name: 'algoseas_pirates',
    fields_data: data,
  });

  console.log(mr);
}
