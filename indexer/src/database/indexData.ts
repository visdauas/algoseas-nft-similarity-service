import { getClient } from './client';

export async function indexData() {
  const milvusClient = getClient();

  const index_params_IVF_FLAT = {
    metric_type: "L2",
    index_type: "IVF_FLAT",
    params: JSON.stringify({ nlist: 1024 }),
  };

  const index_params_FLAT = {
    metric_type: "L2",
    index_type: "FLAT",
    params: "{}",
  };

  await milvusClient.indexManager.createIndex({
    collection_name: "algoseas_pirates",
    field_name: "statVector",
    extra_params: index_params_FLAT,
  });
}
