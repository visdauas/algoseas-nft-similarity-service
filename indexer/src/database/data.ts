import { schemaToEmbeddings } from '../utils';
import { AssetDBEntry, AssetSalesDBEntry } from '../types';
import { getClient } from './client';
import { flushCollection } from './collection';

export async function insertData(
  collectionName: string,
  data: AssetDBEntry[] | AssetSalesDBEntry[],
) {
  await getClient().dataManager.insert({
    collection_name: collectionName,
    fields_data: data,
  });
  await flushCollection(collectionName);
}

export async function deleteData(collectionName: string, assetIds: number[]) {
  await getClient().dataManager.deleteEntities({
    collection_name: collectionName,
    expr: 'assetId in [' + assetIds + ']',
  });
}

export async function getAllData(collectionName: string, schema: any) {
  const results = await getClient().dataManager.query({
    collection_name: collectionName,
    expr: 'assetId != -1',
    output_fields: schemaToEmbeddings(schema),
  });
  return results;
}

export async function checkIfAssetIdExsists(
  collectionName: string,
  assetId: number,
) {
  const results = await getClient().dataManager.query({
    collection_name: collectionName,
    expr: 'assetId == ' + assetId,
    output_fields: ['assetId'],
  });
  return results.data.length > 0;
}
