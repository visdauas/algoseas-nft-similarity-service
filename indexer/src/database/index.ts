import { getClient } from './client';

export async function indexData(collectionName: string) {
  const index_params_ANNOY = {
    metric_type: 'L2',
    index_type: 'ANNOY',
    params: JSON.stringify({ n_trees: 20 }),
  };

  await getClient().indexManager.createIndex({
    collection_name: collectionName,
    field_name: 'statVector',
    extra_params: index_params_ANNOY,
  });
}
