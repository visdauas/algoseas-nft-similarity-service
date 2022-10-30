import {
  applyWeightsToAssetDBEntry,
  applyWeightsToAssetSalesDBEntry,
} from '../utils';
import { StatWeights } from '../types';
import { getAllData, insertData } from './data';
import { ASSETS_AND_LISTINGS_SCHEMA, SALES_SCHEMA } from './schema';
import { createCollection, dropCollection, loadCollection } from './collection';

export async function recalculateAssetsWeights(
  collectionName: string,
  statWeights: StatWeights,
) {
  const results = await getAllData(collectionName, ASSETS_AND_LISTINGS_SCHEMA);
  const allData = results.data;

  const weightedData = allData.map((asset: any) => {
    return applyWeightsToAssetDBEntry(asset, statWeights);
  });

  await dropCollection(collectionName);
  await createCollection(collectionName, ASSETS_AND_LISTINGS_SCHEMA);

  await insertData(collectionName, weightedData);

  await loadCollection(collectionName);
}

export async function recalculateSalesWeights(
  collectionName: string,
  statWeights: StatWeights,
) {
  const results = await getAllData(collectionName, SALES_SCHEMA);
  const allData = results.data;

  const weightedData = allData.map((asset: any) => {
    return applyWeightsToAssetSalesDBEntry(asset, statWeights);
  });

  await dropCollection(collectionName);
  await createCollection(collectionName, SALES_SCHEMA);

  await insertData(collectionName, weightedData);

  await loadCollection(collectionName);
}
