import { indexData } from './database';
import {
  loadCollection,
  checkCollectionExsists,
  createCollection,
  flushCollection,
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
import { ASSETS_AND_LISTINGS_SCHEMA, SALES_SCHEMA } from './database/schema';

export async function initialIndex(
  assetsCollectionName: string,
  salesCollectionName: string,
  statWeights: StatWeights,
) {
  if (!(await checkCollectionExsists(assetsCollectionName))) {
    await createCollection(assetsCollectionName, ASSETS_AND_LISTINGS_SCHEMA);
    await initialIndexAssets(assetsCollectionName, statWeights);
  }

  if (!(await checkCollectionExsists(salesCollectionName))) {
    await createCollection(salesCollectionName, SALES_SCHEMA);
    await initialIndexSales(salesCollectionName, statWeights);
  }
}

async function initialIndexAssets(
  collectionName: string,
  statWeights: StatWeights,
) {
  const assets: Asset[] = await getEveryAsset();
  const assetDBEntries: AssetDBEntry[] = assets.map((asset) => {
    return convertAssetToDBEntry(asset);
  });

  const weightedAssetDBEntries: AssetDBEntry[] = assetDBEntries.map(
    (assetDBEntry) => {
      return applyWeightsToAssetDBEntry(assetDBEntry, statWeights);
    },
  );

  await insertData(collectionName, weightedAssetDBEntries);

  await loadCollection(collectionName);

  await indexData(collectionName);

  await flushCollection(collectionName);
}

async function initialIndexSales(
  collectionName: string,
  statWeights: StatWeights,
) {
  const assets: AssetSalesDBEntry[] = await indexSold();

  const weightedAssetDBEntries: AssetSalesDBEntry[] = assets.map(
    (assetDBEntry) => {
      return applyWeightsToAssetSalesDBEntry(assetDBEntry, statWeights);
    },
  );

  await insertData(collectionName, weightedAssetDBEntries);

  await loadCollection(collectionName);

  await flushCollection(collectionName);
}
