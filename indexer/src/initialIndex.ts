import { getAssetIds } from './assets/assetId';
import { getAsset } from './assets/assets';
import { indexData } from './database';
import { initalizeDatabase } from './database/initalize';
import { dropCollection, loadCollection, checkCollectionExsists, getCollectionStatistics } from './database/collection';
import { getClient } from './database/client';
import { insertData } from './database/data';
import { AssetDBEntry, Asset, StatWeights } from './types';
import { getEveryAsset } from './assets/indexAssets';
import { applyWeightsToAssetDBEntry, convertAssetToDBEntry } from './utils';

export async function initialIndex(statWeights: StatWeights) {

  await dropCollection('algoseas_pirates');

  const exsists = await checkCollectionExsists('algoseas_pirates');
  if(!exsists){
      await initalizeDatabase();
  }

  /*await getClient().indexManager.dropIndex({
    collection_name: "algoseas_pirates",
    field_name: 'statVector',
  });*/

  const assets: Asset[] = await getEveryAsset();
  const assetDBEntries: AssetDBEntry[] = assets.map((asset) => {
    return convertAssetToDBEntry(asset);
  });

  const weightedAssetDBEntries: AssetDBEntry[] = assetDBEntries.map((assetDBEntry) => {
    return applyWeightsToAssetDBEntry(assetDBEntry, statWeights);
  });  

  await insertData('algoseas_pirates', weightedAssetDBEntries);

  await loadCollection('algoseas_pirates');

  await indexData('algoseas_pirates');

  await getClient().dataManager.flush({
    collection_names: ["algoseas_pirates"],
  });

  console.log('done');
}
