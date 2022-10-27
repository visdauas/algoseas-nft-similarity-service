import { getAssetIds } from './assets/assetId';
import { Asset, getAsset } from './assets/assets';
import { indexData } from './database/indexData';
import { initalizeDatabase } from './database/initalize';
import { dropCollection, loadCollection } from './database/manage';
import { getClient } from './database/client';

export async function initialIndex() {
  await dropCollection('algoseas_pirates');
  await initalizeDatabase();

  const assets: Asset[] = [];

  const assetIds: number[] = await getAssetIds();

  const errorIds: number[] = [];

  for (let i = 0; i < assetIds.length; i++) {
    try {
      const asset: Asset = await getAsset(assetIds[i]);
      assets.push(asset);
      console.log(`Loaded asset ${i} of ${assetIds.length}`);
    } catch (error) {
      console.error(`Error loading asset ${assetIds[i]} of ${assetIds.length}`);
      errorIds.push(assetIds[i]);
    }
  }

  const milvusClient = getClient();

  let data = [];

  for (let i = 0; i < assets.length; i++) {
    const stats = [
      assets[i].combat,
      assets[i].constitution,
      assets[i].luck,
      assets[i].plunder,
    ];

    data.push({
      assetId: assets[i].assetId,
      statVector: stats,
      combat: stats[0],
      constitution: stats[1],
      luck: stats[2],
      plunder: stats[3],
      forSale: assets[i].forSale,
      lastPrice: assets[i].lastPrice,
      lastSoldRound: assets[i].lastSoldRound,
    });
  }

  const mr = await milvusClient.dataManager.insert({
    collection_name: 'algoseas_pirates',
    fields_data: data,
  });

  await loadCollection('algoseas_pirates');
  await indexData();

  console.log('done');
}
