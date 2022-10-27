import { getClient } from './client';

export async function dropCollection(collectionName: string) {
  await getClient().collectionManager.dropCollection({
    collection_name: collectionName,
  });
}

export async function loadCollection(collectionName: string) {
  await getClient().collectionManager.loadCollection({
    collection_name: collectionName,
  });
}

export async function releaseCollection(collectionName: string) {
  await getClient().collectionManager.releaseCollection({
    collection_name: collectionName,
  });
}

export async function checkCollectionExsists(collectionName: string) {
  const response = await getClient().collectionManager.hasCollection({
    collection_name: collectionName,
  });
  return response.value;
}

export async function getCollectionStatistics(collectionName: string) {
  const response = await getClient().collectionManager.getCollectionStatistics({
    collection_name: collectionName,
  });
  return response;
}
