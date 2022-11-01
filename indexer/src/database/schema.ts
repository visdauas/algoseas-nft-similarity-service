export const ASSETS_AND_LISTINGS_SCHEMA = [
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
    name: 'price',
    data_type: 5, //DataType.Int64
    description: '',
  },
];

export const SALES_SCHEMA = [
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
    name: 'price',
    data_type: 5, //DataType.Int64
    description: '',
  },
  {
    name: 'round', // algorand blockchain round number at the time of sale
    data_type: 5, //DataType.Int64
    description: '',
  },
  {
    name: 'txId', // algorand blockchain transaction id at the time of sale
    data_type: 21, //DataType.VarChar
    type_params: {
      max_length: '64',
    },
    description: '',
  },
];
