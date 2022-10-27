import { AssetDBEntry } from '../types';
import { getClient } from './client';

export async function insertData(collectionName: string, data: AssetDBEntry[]) {
  await getClient().dataManager.insert({
    collection_name: collectionName,
    fields_data: data,
  });
}

export async function deleteData(collectionName: string, assetId: number) {
  await getClient().dataManager.deleteEntities({
    collection_name: collectionName,
    expr: 'assetId == ' + assetId,
  });
}
