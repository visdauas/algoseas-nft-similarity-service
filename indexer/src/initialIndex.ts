import { getAssetIds } from './assets/assetId';
import { getAsset } from './assets/assets';
import { indexData } from './database/indexData';
import { initalizeDatabase } from './database/initalize';
import { dropCollection, loadCollection, checkCollectionExsists, getCollectionStatistics } from './database/manageCollection';
import { getClient } from './database/client';
import { insertData } from './database/data';
import { AssetDBEntry, Asset } from './types';
import { getEveryAsset } from './assets/indexAssets';
import { convertAssetToDBEntry } from './utils';

export async function initialIndex() {

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

  await insertData('algoseas_pirates', assetDBEntries);

  await loadCollection('algoseas_pirates');

  await indexData();

  await getClient().dataManager.flush({
    collection_names: ["algoseas_pirates"],
  });

  console.log('done');
}
