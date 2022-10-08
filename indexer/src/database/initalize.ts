import { getClient } from './client';

export async function initalizeDatabase() {
  const milvusClient = getClient();

  const params = {
    collection_name: 'algoseas_pirates',
    description: 'Algoseas Pirates NFT Collection',
    fields: [
      {
        name: 'assetId',
        data_type: 5, //DataType.Int64
        is_primary_key: true,
        description: '',
      },
      {
        name: 'statVector',
        description: '',
        data_type: 101, // DataType.FloatVector
        type_params: {
          dim: '4',
        },
      },
      {
        name: 'combat',
        data_type: 4, //DataType.Int32
        description: '',
      },
      {
        name: 'constitution',
        data_type: 4, //DataType.Int32
        description: '',
      },
      {
        name: 'luck',
        data_type: 4, //DataType.Int32
        description: '',
      },
      {
        name: 'plunder',
        data_type: 4, //DataType.Int32
        description: '',
      },
      {
        name: 'forSale',
        data_type: 1, //DataType.Bool
        description: '',
      },

      {
        name: 'lastPrice',
        data_type: 5, //DataType.Int64
        description: '',
      },
      {
        name: 'lastSoldRound', // algorand blockchain round number at the time of sale
        data_type: 5, //DataType.Int64
        description: '',
      },
    ],
  };

  await milvusClient.collectionManager.createCollection(params);

  console.log('initalized');
}
