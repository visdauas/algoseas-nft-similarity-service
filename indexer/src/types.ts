export type AssetDBEntry = {
  assetId: number;
  statVector: number[];
  combat: number;
  constitution: number;
  luck: number;
  plunder: number;
  forSale: boolean;
  price: number;
};

export type AssetSalesDBEntry = {
  assetId: number;
  statVector: number[];
  price: number;
  round: number;
  txId: string;
};

export type Asset = {
  assetId: number,
  combat: number,
  constitution: number,
  luck: number,
  plunder: number,
  forSale: boolean,
  price: number,
}

export type StatWeights = {
  combat: number,
  constitution: number,
  luck: number,
  plunder: number,
}
