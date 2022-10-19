import { getClient } from './client';

export async function fillDummy() {
  const milvusClient = getClient();

  let data = [];

  for (let i = 0; i < 20000; i++) {
    const stats = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 200),
    );

    data.push({
      assetId: i,
      statVector: stats,
      combat: stats[0],
      constitution: stats[1],
      luck: stats[2],
      plunder: stats[3],
      forSale: Math.random() < 0.5,
      lastPrice: Math.floor(Math.random() * 10000),
      lastSoldRound: Math.floor(Math.random() * 1000000),
    });
  }

  const mr = await milvusClient.dataManager.insert({
    collection_name: 'algoseas_pirates',
    fields_data: data,
  });

  console.log(mr);
}
