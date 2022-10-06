import { MilvusClient } from '@zilliz/milvus2-sdk-node';

export async function initDatabase() {
  const address = 'localhost:19530';
  const milvusClient = new MilvusClient(address);

  const params = {
    collection_name: 'book',
    description: 'Test book search',
    fields: [
      {
        name: 'book_intro',
        description: '',
        data_type: 101, // DataType.FloatVector
        type_params: {
          dim: '2',
        },
      },
      {
        name: 'book_id',
        data_type: 5, //DataType.Int64
        is_primary_key: true,
        description: '',
      },
      {
        name: 'word_count',
        data_type: 5, //DataType.Int64
        description: '',
      },
    ],
  };

  await milvusClient.collectionManager.createCollection(params);

  await milvusClient.collectionManager.loadCollection({
    collection_name: 'book',
  });

  const data = Array.from({ length: 2000 }, (v, k) => ({
    book_id: k,
    word_count: k + 10000,
    book_intro: Array.from({ length: 2 }, () => Math.random()),
  }));

  const mr = await milvusClient.dataManager.insert({
    collection_name: 'book',
    fields_data: data,
  });
}
