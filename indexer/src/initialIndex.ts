import { getAssetIds } from './assets/assetId';
import { getAsset } from './assets/assets';
import { indexData } from './database/indexData';
import { initalizeDatabase } from './database/initalize';
import { dropCollection, loadCollection, checkCollectionExsists, getCollectionStatistics } from './database/manageCollection';
import { getClient } from './database/client';
import { insertData } from './database/data';
import { AssetDBEntry, Asset } from './types';

export async function initialIndex() {
  const exsists = await checkCollectionExsists('algoseas_pirates');
  if(!exsists){
      await initalizeDatabase();
  }

  await loadCollection('algoseas_pirates');

  await getClient().dataManager.flush({
    collection_names: ["algoseas_pirates"],
  });

  await getClient().indexManager.dropIndex({
    collection_name: "algoseas_pirates",
    field_name: 'statVector',
  });

  const resp = await getClient().indexManager.getIndexState({
    collection_name: "algoseas_pirates",
  });

  console.log(resp);

  await indexData();

  const response = await getClient().indexManager.getIndexBuildProgress({
    collection_name: "algoseas_pirates",
  });

  console.log(response);
  const indexedAssetIds = await getClient().dataManager.query({
    collection_name: 'algoseas_pirates',
    expr: "assetId != -1",
    output_fields: ["assetId"],
  });

  const indexedAssetIdsArray: number[] = indexedAssetIds.data.map((asset: any) => +asset.assetId);

  const assetIds: number[] = await getAssetIds();

  const newAssetIds: number[] = [];

  for (const assetId of assetIds) {
    if (!indexedAssetIdsArray.includes(assetId)) {
      newAssetIds.push(assetId);
    }
  }
  
  const errorIds: number[] = [];

  for (let i = 0; i < newAssetIds.length; i++) {
    try {
      const asset: Asset | undefined = (await getAsset(newAssetIds[i]));
      if (asset == undefined){
        errorIds.push(newAssetIds[i]);
      }
      else{
        const assetEntry: AssetDBEntry = {
          assetId: asset.assetId,
          statVector: [asset.combat, asset.constitution, asset.luck, asset.plunder],
          combat: asset.combat,
          constitution: asset.constitution,
          luck: asset.luck,
          plunder: asset.plunder,
          forSale: asset.forSale,
          lastPrice: asset.lastPrice,
          lastSoldRound: asset.lastSoldRound,
        };
        console.log(assetEntry);
        insertData('algoseas_pirates', [assetEntry]);
        console.log(`Loaded asset ${i} of ${newAssetIds.length}`);  
      }
    } catch (error) {
      console.error(`Error loading asset ${newAssetIds[i]} of ${newAssetIds.length}`);
      errorIds.push(newAssetIds[i]);
    }
  }

  console.log(`Error loading assets: ${errorIds}`);

  await indexData();

  console.log('done');
}
