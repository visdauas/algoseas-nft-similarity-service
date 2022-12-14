import { schemaToEmbeddings } from '../utils';
import { AssetDBEntry, AssetSalesDBEntry } from '../types';
import { getClient } from './client';
import { ASSETS_AND_LISTINGS_SCHEMA } from './schema';

export async function insertData(
  collectionName: string,
  data: AssetDBEntry[] | AssetSalesDBEntry[],
) {
  await getClient().dataManager.insert({
    collection_name: collectionName,
    fields_data: data,
  });
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

export async function getAssetData(collectionName: string, assetId: number) {
  const results = await getClient().dataManager.query({
    collection_name: collectionName,
    expr: 'assetId == ' + assetId,
    output_fields: schemaToEmbeddings(ASSETS_AND_LISTINGS_SCHEMA),
  });
  return results.data[0];
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

export async function checkIfListingExsists(
  collectionName: string,
  assetId: number,
) {
  const results = await getClient().dataManager.query({
    collection_name: collectionName,
    expr: 'assetId == ' + assetId + ' and forSale == true',
    output_fields: ['assetId'],
  });
  return results.data.length > 0;
}

export async function getIfTxIdExsists(collectionName: string, txId: string) {
  const results = await getClient().dataManager.query({
    collection_name: collectionName,
    expr: 'txId == "' + txId + '"',
    output_fields: ['txId'],
  });
  return results.data.length > 0;
}
