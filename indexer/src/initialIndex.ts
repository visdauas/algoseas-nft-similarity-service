import { getAssetIds } from './assets/assetId';
import { Asset, getAsset } from './assets/assets';
import { indexData } from './database/indexData';
import { initalizeDatabase } from './database/initalize';
import { dropCollection, loadCollection, checkCollectionExsists, getCollectionStatistics } from './database/manageCollection';
import { getClient } from './database/client';
import { insertData } from './database/data';
import { AssetDBEntry } from './types';

export async function initialIndex() {
  const exsists = await checkCollectionExsists('algoseas_pirates');
  if(!exsists){
      await initalizeDatabase();
  }

  await loadCollection('algoseas_pirates');

  const indexedAssetIds = await getClient().dataManager.query({
    collection_name: 'algoseas_pirates',
    expr: "assetId != -1",
    output_fields: ["assetId"],
  });
  const indexedAssetIdsArray = indexedAssetIds.data.map((asset: any) => asset.assetId);
  //await dropCollection('algoseas_pirates');

  const assetIds: number[] = await getAssetIds();

  const filteredAssetIds = assetIds.filter((id) => {
    if (indexedAssetIdsArray.includes(id)) {
      return false;
    }
    return id
  });

  const errorIds: number[] = [];

  for (let i = 0; i < filteredAssetIds.length; i++) {
    try {
      const asset: Asset | undefined = (await getAsset(filteredAssetIds[i]));
      if (asset == undefined){
        errorIds.push(filteredAssetIds[i]);
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
        console.log(`Loaded asset ${i} of ${filteredAssetIds.length}`);  
      }
    } catch (error) {
      console.error(`Error loading asset ${filteredAssetIds[i]} of ${filteredAssetIds.length}`);
      errorIds.push(filteredAssetIds[i]);
    }
  }

  await indexData();

  console.log('done');
}
