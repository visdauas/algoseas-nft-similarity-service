import { getClient } from './client';

export async function indexData() {
  const milvusClient = getClient();

  const index_params_FLAT = {
    metric_type: "L2",
    index_type: "FLAT",
    params: "{}",
  };

  const index_params_IVF_FLAT = {
    metric_type: "L2",
    index_type: "IVF_FLAT",
    params: JSON.stringify({ nlist: 32 }),
  };

  const index_params_IVF_PQ = {
    metric_type: "L2",
    index_type: "IVF_PQ",
    params: JSON.stringify({ nlist: 1024, m: 4 }),
  };

  const index_params_HNSW = {
    metric_type: "L2",
    index_type: "HNSW",
    params: JSON.stringify({ M: 32, efConstruction: 256 }),
  };

  const index_params_ANNOY = {
    metric_type: "L2",
    index_type: "ANNOY",
    params: JSON.stringify({ n_trees: 20 }),
  };



  await milvusClient.indexManager.createIndex({
    collection_name: "algoseas_pirates",
    field_name: "statVector",
    extra_params: index_params_ANNOY,
  });
}
