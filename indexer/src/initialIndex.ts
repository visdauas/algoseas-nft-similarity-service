import { indexData } from './database';
import { initalizeDatabase } from './database/initalize';
import {
  dropCollection,
  loadCollection,
  checkCollectionExsists,
} from './database/collection';
import { insertData } from './database/data';
import { AssetDBEntry, Asset, StatWeights, AssetSalesDBEntry } from './types';
import { getEveryAsset } from './assets/indexAssets';
import {
  applyWeightsToAssetDBEntry,
  applyWeightsToAssetSalesDBEntry,
  convertAssetToDBEntry,
} from './utils';
import { indexSold } from './assets/indexSales';

export async function initialIndex(statWeights: StatWeights) {
  //await dropCollection('algoseas_pirates');
  await dropCollection('algoseas_pirates_sales');

  //const exsists = await checkCollectionExsists('algoseas_pirates');
  //if (!exsists) {
  await initalizeDatabase();
  //}

  //initialIndexAssets(statWeights);
  initialIndexSales(statWeights);
}

async function initialIndexAssets(statWeights: StatWeights) {
  const assets: Asset[] = await getEveryAsset();
  const assetDBEntries: AssetDBEntry[] = assets.map((asset) => {
    return convertAssetToDBEntry(asset);
  });

  const weightedAssetDBEntries: AssetDBEntry[] = assetDBEntries.map(
    (assetDBEntry) => {
      return applyWeightsToAssetDBEntry(assetDBEntry, statWeights);
    },
  );

  await insertData('algoseas_pirates', weightedAssetDBEntries);

  await loadCollection('algoseas_pirates');

  await indexData('algoseas_pirates');
}

async function initialIndexSales(statWeights: StatWeights) {
  const assets: AssetSalesDBEntry[] = await indexSold();

  const weightedAssetDBEntries: AssetSalesDBEntry[] = assets.map(
    (assetDBEntry) => {
      return applyWeightsToAssetSalesDBEntry(assetDBEntry, statWeights);
    },
  );

  await insertData('algoseas_pirates_sales', weightedAssetDBEntries);

  await loadCollection('algoseas_pirates_sales');

  await indexData('algoseas_pirates_sales');
}
